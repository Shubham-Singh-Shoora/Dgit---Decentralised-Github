import Types "../shared/Types";
import Utils "../shared/Utils";
import GitCore  "../git_core.mo";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Blob "mo:base/Blob";

actor class UserRepo(owner : Principal) {
  // Store user information
  private var profile : Types.Profile = Utils.createDefaultProfile(owner, "user" # Principal.toText(owner).substring(0, 8));
  
  // Initialize Git Store
  private let gitStore = GitCore.GitStore();
  
  // Repository storage
  private let repositories = HashMap.HashMap<Text, Types.Repository>(10, Text.equal, Text.hash);
  
  // Access control - only owner can modify repositories
  private func isOwner(caller : Principal) : Bool {
    Principal.equal(caller, owner)
  };
  
  // Update profile information
  public shared(msg) func updateProfile(update : Types.ProfileUpdate) : async Result.Result<Types.Profile, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can update their profile");
    };
    
    profile := {
      username = Utils.getOrDefault(update.username, profile.username);
      bio = Utils.getOrDefault(update.bio, profile.bio);
      avatar_url = Utils.getOrDefault(update.avatar_url, profile.avatar_url);
      joined = profile.joined;
      principal_id = profile.principal_id;
    };
    
    #ok(profile)
  };
  
  // Get profile information
  public query func getProfile() : async Types.Profile {
    profile
  };
  
  // Create a new repository
  public shared(msg) func createRepository(name : Text, description : Text) : async Result.Result<Types.Repository, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can create repositories");
    };
    
    // Check if repository with same name already exists
    switch (repositories.get(name)) {
      case (?_) { return #err("Repository with name '" # name # "' already exists"); };
      case (null) {};
    };
    
    // Create initial empty tree
    let emptyTreeHash = gitStore.createTree([]);
    
    // Create initial commit
    let initialCommitHash = gitStore.createCommit(
      emptyTreeHash, 
      null, 
      profile.username, 
      "Initial commit"
    );
    
    let now = Utils.timeNow();
    let repo : Types.Repository = {
      name = name;
      description = description;
      head = "main";  // Default branch name
      branches = [("main", initialCommitHash)];
      created_at = now;
      updated_at = now;
    };
    
    repositories.put(name, repo);
    #ok(repo)
  };
  
  // List all repositories
  public query func listRepositories() : async [Types.Repository] {
    Iter.toArray(repositories.vals())
  };
  
  // Get a specific repository
  public query func getRepository(name : Text) : async ?Types.Repository {
    repositories.get(name)
  };
  
  // Create a commit in a repository
  public shared(msg) func createCommit(
    repoName : Text,
    branch : Text,
    fileContents : [(Text, Blob)],  // [(filename, content)]
    message : Text
  ) : async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can commit to repositories");
    };
    
    // Get repository
    switch (repositories.get(repoName)) {
      case (null) { return #err("Repository not found"); };
      case (?repo) {
        // Find the branch
        var branchCommitHash : ?Text = null;
        for ((branchName, commitHash) in repo.branches.vals()) {
          if (branchName == branch) {
            branchCommitHash := ?commitHash;
            break;
          };
        };
        
        switch (branchCommitHash) {
          case (null) { return #err("Branch not found"); };
          case (?parentCommitHash) {
            // Create blobs for each file
            var treeEntries : [Types.TreeEntry] = [];
            for ((filename, content) in fileContents.vals()) {
              let blobHash = gitStore.storeBlob(content);
              let entry : Types.TreeEntry = {
                name = filename;
                hash = blobHash;
                kind = #blob;
                mode = "100644";  // Regular file
              };
              treeEntries := Array.append(treeEntries, [entry]);
            };
            
            // Create a tree with all files
            let treeHash = gitStore.createTree(treeEntries);
            
            // Create the commit
            let commitHash = gitStore.createCommit(
              treeHash,
              ?[parentCommitHash],
              profile.username,
              message
            );
            
            // Update branch reference
            var newBranches : [(Text, Text)] = [];
            for ((branchName, hash) in repo.branches.vals()) {
              if (branchName == branch) {
                newBranches := Array.append(newBranches, [(branchName, commitHash)]);
              } else {
                newBranches := Array.append(newBranches, [(branchName, hash)]);
              };
            };
            
            // Update repository
            let updatedRepo : Types.Repository = {
              name = repo.name;
              description = repo.description;
              head = repo.head;
              branches = newBranches;
              created_at = repo.created_at;
              updated_at = Utils.timeNow();
            };
            
            repositories.put(repoName, updatedRepo);
            #ok(commitHash)
          };
        };
      };
    }
  };
  
  // Get commit information
  public query func getCommit(hash : Text) : async ?Types.Commit {
    gitStore.getCommit(hash)
  };
  
  // Get tree information
  public query func getTree(hash : Text) : async ?Types.Tree {
    gitStore.getTree(hash)
  };
  
  // Get blob content
  public query func getBlob(hash : Text) : async ?Blob {
    gitStore.getBlob(hash)
  };
  
  // Create a new branch
  public shared(msg) func createBranch(repoName : Text, branchName : Text, startPoint : Text) : async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can create branches");
    };
    
    switch (repositories.get(repoName)) {
      case (null) { return #err("Repository not found"); };
      case (?repo) {
        // Check if branch already exists
        for ((name, _) in repo.branches.vals()) {
          if (name == branchName) {
            return #err("Branch already exists");
          };
        };
        
        // Verify that startPoint commit exists
        switch (gitStore.getCommit(startPoint)) {
          case (null) { return #err("Invalid start point: commit not found"); };
          case (_) {
            // Add new branch
            let newBranches = Array.append(repo.branches, [(branchName, startPoint)]);
            
            let updatedRepo : Types.Repository = {
              name = repo.name;
              description = repo.description;
              head = repo.head;
              branches = newBranches;
              created_at = repo.created_at;
              updated_at = Utils.timeNow();
            };
            
            repositories.put(repoName, updatedRepo);
            #ok(branchName)
          };
        };
      };
    };
  };
  
  // System method to get canister's owner
  public query func getOwner() : async Principal {
    owner
  };
}