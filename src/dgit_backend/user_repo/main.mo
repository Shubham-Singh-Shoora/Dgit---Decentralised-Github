import Types "../shared/Types";
import Utils "../shared/Utils";
import GitCore "../git_core/git";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

actor class UserRepo(owner : Principal) {
  // Store user information - initialize with proper default profile
  private stable var profileData : Types.Profile = Utils.createDefaultProfile(owner, Utils.generateUsername(owner));
  private var profile : Types.Profile = profileData;

  // Initialize Git Store
  private let gitStore = GitCore.GitStore();

  // Repository storage - make it stable for upgrades
  private stable var repositoryEntries : [(Text, Types.Repository)] = [];
  private var repositories = HashMap.HashMap<Text, Types.Repository>(10, Text.equal, Text.hash);

  // System upgrade hooks
  system func preupgrade() {
    profileData := profile;
    repositoryEntries := Iter.toArray(repositories.entries());
  };

  system func postupgrade() {
    profile := profileData;
    repositories := HashMap.fromIter<Text, Types.Repository>(
      repositoryEntries.vals(),
      repositoryEntries.size(),
      Text.equal,
      Text.hash,
    );
    repositoryEntries := [];
  };

  // Access control - only owner can modify repositories
  private func isOwner(caller : Principal) : Bool {
    Principal.equal(caller, owner);
  };

  // Update profile information
  public shared (msg) func updateProfile(update : Types.ProfileUpdate) : async Result.Result<Types.Profile, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can update their profile");
    };

    // Update profile with new values, keeping existing ones if not provided
    profile := {
      username = Utils.getOrDefault(update.username, profile.username);
      bio = Utils.getOrDefault(update.bio, profile.bio);
      avatar_url = Utils.getOrDefault(update.avatar_url, profile.avatar_url);
      joined = profile.joined; // Keep original join date
      principal_id = profile.principal_id; // Keep original principal
    };

    Debug.print("Profile updated for user: " # Principal.toText(owner));
    #ok(profile);
  };

  // Get profile information
  public query func getProfile() : async Types.Profile {
    profile;
  };

  // Create a new repository
  public shared (msg) func createRepository(name : Text, description : Text) : async Result.Result<Types.Repository, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can create repositories");
    };

    // Validate repository name
    if (Text.size(name) == 0) {
      return #err("Repository name cannot be empty");
    };

    if (Text.size(name) > 100) {
      return #err("Repository name too long (max 100 characters)");
    };

    // Check if repository with same name already exists
    switch (repositories.get(name)) {
      case (?_) {
        return #err("Repository with name '" # name # "' already exists");
      };
      case (null) {};
    };

    try {
      // Create initial empty tree
      let emptyTreeHash = gitStore.createTree([]);

      // Create initial commit
      let initialCommitHash = gitStore.createCommit(
        emptyTreeHash,
        null,
        profile.username,
        "Initial commit",
      );

      let now = Utils.timeNow();
      let repo : Types.Repository = {
        name = name;
        description = description;
        head = "main"; // Default branch name
        branches = [("main", initialCommitHash)];
        created_at = now;
        updated_at = now;
      };

      repositories.put(name, repo);
      Debug.print("Repository created: " # name # " for user: " # Principal.toText(owner));
      #ok(repo);
    } catch (e) {
      #err("Failed to create repository: " # debug_show (e));
    };
  };

  // List all repositories
  public query func listRepositories() : async [Types.Repository] {
    Iter.toArray(repositories.vals());
  };

  // Get a specific repository
  public query func getRepository(name : Text) : async ?Types.Repository {
    repositories.get(name);
  };

  // Delete a repository
  public shared (msg) func deleteRepository(name : Text) : async Result.Result<(), Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can delete repositories");
    };

    switch (repositories.get(name)) {
      case (null) { return #err("Repository not found") };
      case (?_) {
        repositories.delete(name);
        Debug.print("Repository deleted: " # name);
        #ok();
      };
    };
  };

  // Create a commit in a repository
  public shared (msg) func createCommit(
    repoName : Text,
    branch : Text,
    fileContents : [(Text, Blob)], // [(filename, content)]
    message : Text,
  ) : async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can commit to repositories");
    };

    // Validate inputs
    if (Text.size(message) == 0) {
      return #err("Commit message cannot be empty");
    };

    if (fileContents.size() == 0) {
      return #err("At least one file must be included in the commit");
    };

    // Get repository
    switch (repositories.get(repoName)) {
      case (null) { return #err("Repository not found") };
      case (?repo) {
        // Find the branch
        var branchCommitHash : ?Text = null;
        label branchLoop for ((branchName, commitHash) in repo.branches.vals()) {
          if (branchName == branch) {
            branchCommitHash := ?commitHash;
            break branchLoop;
          };
        };

        switch (branchCommitHash) {
          case (null) { return #err("Branch '" # branch # "' not found") };
          case (?parentCommitHash) {
            try {
              // Create blobs for each file
              var treeEntries : [Types.TreeEntry] = [];
              for ((filename, content) in fileContents.vals()) {
                // Validate filename
                if (Text.size(filename) == 0) {
                  return #err("Filename cannot be empty");
                };

                let blobHash = gitStore.storeBlob(content);
                let entry : Types.TreeEntry = {
                  name = filename;
                  hash = blobHash;
                  kind = #blob;
                  mode = "100644"; // Regular file
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
                message,
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
              Debug.print("Commit created: " # commitHash # " in " # repoName # "/" # branch);
              #ok(commitHash);
            } catch (e) {
              #err("Failed to create commit: " # debug_show (e));
            };
          };
        };
      };
    };
  };

  // Get commit information
  public query func getCommit(hash : Text) : async ?Types.Commit {
    gitStore.getCommit(hash);
  };

  // Get tree information
  public query func getTree(hash : Text) : async ?Types.Tree {
    gitStore.getTree(hash);
  };

  // Get blob content
  public query func getBlob(hash : Text) : async ?Blob {
    gitStore.getBlob(hash);
  };

  // Create a new branch
  public shared (msg) func createBranch(repoName : Text, branchName : Text, startPoint : Text) : async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can create branches");
    };

    // Validate branch name
    if (Text.size(branchName) == 0) {
      return #err("Branch name cannot be empty");
    };

    switch (repositories.get(repoName)) {
      case (null) { return #err("Repository not found") };
      case (?repo) {
        // Check if branch already exists
        for ((name, _) in repo.branches.vals()) {
          if (name == branchName) {
            return #err("Branch '" # branchName # "' already exists");
          };
        };

        // Verify that startPoint commit exists
        switch (gitStore.getCommit(startPoint)) {
          case (null) {
            return #err("Invalid start point: commit '" # startPoint # "' not found");
          };
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
            Debug.print("Branch created: " # branchName # " in " # repoName);
            #ok(branchName);
          };
        };
      };
    };
  };

  // Delete a branch
  public shared (msg) func deleteBranch(repoName : Text, branchName : Text) : async Result.Result<(), Text> {
    if (not isOwner(msg.caller)) {
      return #err("Unauthorized: Only the owner can delete branches");
    };

    switch (repositories.get(repoName)) {
      case (null) { return #err("Repository not found") };
      case (?repo) {
        // Can't delete the main branch
        if (branchName == repo.head) {
          return #err("Cannot delete the default branch");
        };

        // Check if branch exists and remove it
        var newBranches : [(Text, Text)] = [];
        var found = false;

        for ((name, hash) in repo.branches.vals()) {
          if (name != branchName) {
            newBranches := Array.append(newBranches, [(name, hash)]);
          } else {
            found := true;
          };
        };

        if (not found) {
          return #err("Branch '" # branchName # "' not found");
        };

        let updatedRepo : Types.Repository = {
          name = repo.name;
          description = repo.description;
          head = repo.head;
          branches = newBranches;
          created_at = repo.created_at;
          updated_at = Utils.timeNow();
        };

        repositories.put(repoName, updatedRepo);
        Debug.print("Branch deleted: " # branchName # " from " # repoName);
        #ok();
      };
    };
  };

  // Get repository statistics
  public query func getRepositoryStats(repoName : Text) : async ?{
    commits : Nat;
    branches : Nat;
    files : Nat;
  } {
    switch (repositories.get(repoName)) {
      case (null) { null };
      case (?repo) {
        // This is a simplified version - in a real implementation, you'd traverse the git history
        ?{
          commits = 1; // Placeholder
          branches = repo.branches.size();
          files = 0; // Placeholder
        };
      };
    };
  };

  // System method to get canister's owner
  public query func getOwner() : async Principal {
    owner;
  };

  // Health check method
  public query func healthCheck() : async {
    status : Text;
    owner : Principal;
    profileInitialized : Bool;
  } {
    {
      status = "healthy";
      owner = owner;
      profileInitialized = profile.username != "";
    };
  };
};
