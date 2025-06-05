import Array "mo:base/Array";
import BlobModule "./git/blob";
import CommitModule "./git/commit";
import RefModule "./git/ref";
import TreeModule "./git/tree";
import Option "mo:base/Option";
import Types "./git/types";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import id "./utils/id";
import Storage "./git/storage";
import Text "mo:base/Text";

actor Main {

  // ------------------ Repository Metadata ------------------
  stable var repoName : Text = "";
  stable var owner : Principal = Principal.fromText("aaaaa-aa");
  stable var collaborators : [Principal] = [];

  // ------------------ Git Data Structures ------------------

  var blobs : [BlobModule.Blob] = [];
  var commits : [CommitModule.Commit] = [];
  var trees : [TreeModule.Tree] = [];
  var refs : [RefModule.Ref] = [];
  let storage = Storage.Storage();

  // ------------------ HEAD Management ------------------
  stable var headRef : Text = ""; // points to a branch name
  stable var headCommitId : Nat32 = 0; // used if HEAD is detached

  // ------------------ Access Control ------------------
  func isAuthorized(caller : Principal) : Bool {
    caller == owner or Option.isSome(Array.find<Principal>(collaborators, func(p) { p == caller }));
  };

  // ------------------ Repo Setup ------------------
  public shared ({ caller }) func createRepo(name : Text) : async Text {
    assert repoName == "";
    let repoId = id.textToId(name);
    repoName := name;
    owner := caller;

    return "Repository initialized with ID: " # Nat32.toText(repoId);
  };

  public shared ({ caller }) func addCollaborator(newUser : Principal) : async Text {
    if (caller != owner) return "Only owner can add collaborators.";
    collaborators := Array.append<Principal>(collaborators, [newUser]);
    return "Collaborator added!";
  };

  public query func getRepoInfo() : async (Text, Principal, [Principal]) {
    (repoName, owner, collaborators);
  };

  // ------------------ HEAD Functions ------------------
  public query func getHEAD() : async (Text, Nat32) {
    (headRef, headCommitId);
  };

  public func setHEAD(name : Text) : async Text {
    switch (Array.find<RefModule.Ref>(refs, func(r) { r.name == name })) {
      case (?ref) {
        headRef := ref.name;
        headCommitId := ref.target;
        "HEAD now points to " # name;
      };
      case null {
        "Branch not found.";
      };
    };
  };

  // ----- Blob functions -----
  public shared ({ caller }) func addBlob(content : [Nat8]) : async BlobModule.Blob {
    assert isAuthorized(caller);
    let blob = BlobModule.createBlob(content);
    blobs := Array.append<BlobModule.Blob>(blobs, [blob]); // safer appending
    blob;
  };

  public func getBlob(blobId : Nat) : async ?BlobModule.Blob {
    if (blobId < blobs.size()) {
      ?blobs[blobId];
    } else {
      null;
    };
  };

  public func getAllBlobs() : async [BlobModule.Blob] {
    blobs;
  };

  // ----- Tree functions -----
  public shared ({ caller }) func addTree(entries : [TreeModule.TreeEntry]) : async TreeModule.Tree {
    assert isAuthorized(caller);
    let tree = TreeModule.createTree(entries);
    trees := Array.tabulate<TreeModule.Tree>(
      trees.size() + 1,
      func(i) {
        if (i < trees.size()) { trees[i] } else { tree };
      },
    );
    tree;
  };

  public func getTree(treeId : Nat) : async ?TreeModule.Tree {
    if (treeId < trees.size()) {
      ?trees[treeId];
    } else {
      null;
    };
  };

  public func getAllTrees() : async [TreeModule.Tree] {
    trees;
  };

  // ----- Commit functions -----
  public shared ({ caller }) func addCommit(tree : Nat32, parents : [Nat32], author : Types.Author, message : Text) : async CommitModule.Commit {
    assert isAuthorized(caller);
    let commit = CommitModule.createCommit(tree, parents, author, message);
    commits := Array.tabulate<CommitModule.Commit>(
      commits.size() + 1,
      func(i) {
        if (i < commits.size()) { commits[i] } else { commit };
      },
    );
    commit;
  };

  public func getCommit(commitId : Nat) : async ?CommitModule.Commit {
    if (commitId < commits.size()) {
      ?commits[commitId];
    } else {
      null;
    };
  };

  public func getAllCommits() : async [CommitModule.Commit] {
    commits;
  };

  // ------------------ Ref (Branch) Functions ------------------
  public shared ({ caller }) func addRef(name : Text, target : Nat32, refType : RefModule.RefType) : async RefModule.Ref {
    assert isAuthorized(caller);
    let ref : RefModule.Ref = RefModule.createRef(name, target, refType);
    var updated = false;

    if (refs.size() > 0) {
      refs := Array.tabulate<RefModule.Ref>(
        refs.size(),
        func(i) {
          if (refs[i].name == name) {
            updated := true;
            ref;
          } else {
            refs[i];
          };
        },
      );
    };

    if (refs.size() == 0 or not updated) {
      let newRefs : [RefModule.Ref] = Array.append<RefModule.Ref>(refs, [ref]);
      refs := newRefs;
    };
    ref;
  };

  public func getRef(name : Text) : async ?RefModule.Ref {
    let matches = Array.filter<RefModule.Ref>(refs, func(r) { r.name == name });
    if (matches.size() > 0) { ?matches[0] } else { null };
  };

  public func getAllRefs() : async [RefModule.Ref] {
    refs;
  };

  // ------------------ High-level Git API ------------------
  public shared ({ caller }) func createCommit(treeId : Nat32, parentIds : [Nat32], author : Types.Author, message : Text) : async Nat {
    assert isAuthorized(caller);
    let commit = CommitModule.createCommit(treeId, parentIds, author, message);
    let id = storage.insertCommit(commit);
    Nat32.toNat(id);
  };

  public shared ({ caller }) func createBranch(name : Text, commitId : Nat32) : async Text {
    assert isAuthorized(caller);
    ignore addRef(name, commitId, #Branch);
    "Branch " # name # " created at commit " # debug_show (commitId);
  };

  public func getCommitHistory(commitId : Nat32) : async [CommitModule.Commit] {
    var visited : [Nat32] = [];
    var result : [CommitModule.Commit] = [];

    // Helper function to check if an ID is in the visited array
    func isVisited(id : Nat32) : Bool {
      Option.isSome(Array.find<Nat32>(visited, func(v) { v == id }));
    };

    // Must use recursion differently for async functions
    func processCommit(id : Nat32) : async () {
      if (isVisited(id)) return;
      visited := Array.append<Nat32>(visited, [id]);

      switch (await getCommit(Nat32.toNat(id))) {
        // Convert Nat32 to Nat for getCommit
        case (?commit) {
          result := Array.append(result, [commit]);
          for (parent in commit.parents.vals()) {
            await processCommit(parent);
          };
        };
        case null {};
      };
    };

    // Start the traversal
    await processCommit(commitId);
    result;
  };

  public func getBranchHistory(branchName : Text) : async [CommitModule.Commit] {
    switch (await getRef(branchName)) {
      case (?ref) {
        await getCommitHistory(ref.target); // Add await here
      };
      case null {
        [];
      };
    };
  };

  public shared ({ caller }) func mergeBranch(sourceBranch : Text, targetBranch : Text, author : Types.Author, message : Text) : async Text {
    assert isAuthorized(caller);
    // Fetch source and target refs
    let sourceRef = Array.find<RefModule.Ref>(refs, func(r) { r.name == sourceBranch });
    let targetRef = Array.find<RefModule.Ref>(refs, func(r) { r.name == targetBranch });

    switch (sourceRef, targetRef) {
      case (?src, ?tgt) {
        // Get commits
        let sourceCommitId = src.target;
        let targetCommitId = tgt.target;

        let sourceCommitOpt = await getCommit(Nat32.toNat(sourceCommitId));
        let targetCommitOpt = await getCommit(Nat32.toNat(targetCommitId));

        switch (sourceCommitOpt, targetCommitOpt) {
          case (?srcCommit, ?tgtCommit) {
            // Naive merge logic: use source commit's tree (could be improved with 3-way merge later)
            let mergeTree = srcCommit.tree;

            // Create merge commit with 2 parents
            let mergeCommit = CommitModule.createCommit(
              mergeTree,
              [sourceCommitId, targetCommitId],
              author,
              message # " (Merged " # sourceBranch # " into " # targetBranch # ")",
            );

            let newId = storage.insertCommit(mergeCommit);

            // Update the target branch to point to this new merge commit
            ignore addRef(targetBranch, newId, #Branch);

            return "Merged " # sourceBranch # " into " # targetBranch # " at commit " # debug_show (newId);
          };
          case _ return "Unable to fetch commits from source/target branches.";
        };
      };
      case _ return "One or both branches do not exist.";
    };
  };

  public shared ({ caller }) func forkRepo() : async Text {
    let forkedName = repoName # "-fork";

    // Shallow clone data (for simplicity; not deep copy of objects)
    let newBlobs = blobs;
    let newTrees = trees;
    let newCommits = commits;
    let newRefs = refs;
    let newHeadRef = headRef;
    let newHeadCommitId = headCommitId;

    // Reset the current repo state for the fork
    repoName := forkedName;
    owner := caller;
    collaborators := [];

    blobs := newBlobs;
    trees := newTrees;
    commits := newCommits;
    refs := newRefs;
    headRef := newHeadRef;
    headCommitId := newHeadCommitId;

    return "Repository successfully forked as '" # forkedName # "' with new owner.";
  };

  public shared ({ caller }) func deleteBranch(name : Text) : async Text {
    assert isAuthorized(caller);
    if (name == headRef) {
      return "Cannot delete the currently checked-out branch.";
    };

    let newRefs = Array.filter<RefModule.Ref>(
      refs,
      func(ref) { ref.name != name },
    );

    if (newRefs.size() == refs.size()) {
      return "Branch not found.";
    };

    refs := newRefs;
    return "Branch '" # name # "' deleted.";
  };

};
