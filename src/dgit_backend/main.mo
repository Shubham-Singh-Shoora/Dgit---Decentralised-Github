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
import CBOR "./cbor/cbor"; // <<--- Ensure you have CBOR helpers

actor Main {

  // ------------------ Repository Metadata ------------------
  stable var repoName : Text = "";
  stable var owner : Principal = Principal.fromText("aaaaa-aa");
  stable var collaborators : [Principal] = [];

  // ------------------ Git Data Structures (CBOR storage) ------------------
  stable var blobsCBOR : [[Nat8]] = [];
  stable var commitsCBOR : [[Nat8]] = [];
  stable var treesCBOR : [[Nat8]] = [];
  stable var refsCBOR : [[Nat8]] = [];
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
    switch (await getRef(name)) {
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
  public shared ({ caller }) func addBlob(content : [Nat8]) : async Nat {
    assert isAuthorized(caller);
    let blob = BlobModule.createBlob(content);
    let cborBytes = CBOR.encodeBlobObject(blob);
    blobsCBOR := Array.append<[[Nat8]]>(blobsCBOR, [cborBytes]);
    blobsCBOR.size() - 1;
  };

  public func getBlob(blobId : Nat) : async ?BlobModule.Blob {
    if (blobId < blobsCBOR.size()) {
      ?CBOR.decodeBlobObject(blobsCBOR[blobId]);
    } else {
      null;
    };
  };

  public func getAllBlobs() : async [BlobModule.Blob] {
    Array.map<[[Nat8]], BlobModule.Blob>(blobsCBOR, func(bytes) { CBOR.decodeBlobObject(bytes) });
  };

  // ----- Tree functions -----
  public shared ({ caller }) func addTree(entries : [TreeModule.TreeEntry]) : async Nat {
    assert isAuthorized(caller);
    let tree = TreeModule.createTree(entries);
    let cborBytes = CBOR.encodeTreeObject(tree);
    treesCBOR := Array.append<[[Nat8]]>(treesCBOR, [cborBytes]);
    treesCBOR.size() - 1;
  };

  public func getTree(treeId : Nat) : async ?TreeModule.Tree {
    if (treeId < treesCBOR.size()) {
      ?CBOR.decodeTreeObject(treesCBOR[treeId]);
    } else {
      null;
    };
  };

  public func getAllTrees() : async [TreeModule.Tree] {
    Array.map<[[Nat8]], TreeModule.Tree>(treesCBOR, func(bytes) { CBOR.decodeTreeObject(bytes) });
  };

  // ----- Commit functions -----
  public shared ({ caller }) func addCommit(tree : Nat32, parents : [Nat32], author : Types.Author, message : Text) : async Nat {
    assert isAuthorized(caller);
    let commit = CommitModule.createCommit(tree, parents, author, message);
    let cborBytes = CBOR.encodeCommitObject(commit);
    commitsCBOR := Array.append<[[Nat8]]>(commitsCBOR, [cborBytes]);
    commitsCBOR.size() - 1;
  };

  public func getCommit(commitId : Nat) : async ?CommitModule.Commit {
    if (commitId < commitsCBOR.size()) {
      ?CBOR.decodeCommitObject(commitsCBOR[commitId]);
    } else {
      null;
    };
  };

  public func getAllCommits() : async [CommitModule.Commit] {
    Array.map<[[Nat8]], CommitModule.Commit>(commitsCBOR, func(bytes) { CBOR.decodeCommitObject(bytes) });
  };

  // ------------------ Ref (Branch) Functions ------------------
  public shared ({ caller }) func addRef(name : Text, target : Nat32, refType : RefModule.RefType) : async Nat {
    assert isAuthorized(caller);
    let ref : RefModule.Ref = RefModule.createRef(name, target, refType);
    let cborBytes = CBOR.encodeRefObject(ref);
    var updated = false;

    if (refsCBOR.size() > 0) {
      refsCBOR := Array.tabulate<[[Nat8]]>(
        refsCBOR.size(),
        func(i) {
          let r = CBOR.decodeRefObject(refsCBOR[i]);
          if (r.name == name) {
            updated := true;
            cborBytes;
          } else {
            refsCBOR[i];
          };
        },
      );
    };

    if (refsCBOR.size() == 0 or not updated) {
      refsCBOR := Array.append<[[Nat8]]>(refsCBOR, [cborBytes]);
    };
    refsCBOR.size() - 1;
  };

  public func getRef(name : Text) : async ?RefModule.Ref {
    let matches = Array.filter<[[Nat8]]>(
      refsCBOR,
      func(bytes) {
        CBOR.decodeRefObject(bytes).name == name;
      },
    );
    if (matches.size() > 0) { ?CBOR.decodeRefObject(matches[0]) } else { null };
  };

  public func getAllRefs() : async [RefModule.Ref] {
    Array.map<[[Nat8]], RefModule.Ref>(refsCBOR, func(bytes) { CBOR.decodeRefObject(bytes) });
  };

  // ------------------ High-level Git API ------------------
  public shared ({ caller }) func createCommit(treeId : Nat32, parentIds : [Nat32], author : Types.Author, message : Text) : async Nat {
    assert isAuthorized(caller);
    let commit = CommitModule.createCommit(treeId, parentIds, author, message);
    let cborBytes = CBOR.encodeCommitObject(commit);
    commitsCBOR := Array.append<[[Nat8]]>(commitsCBOR, [cborBytes]);
    commitsCBOR.size() - 1;
  };

  public shared ({ caller }) func createBranch(name : Text, commitId : Nat32) : async Text {
    assert isAuthorized(caller);
    ignore addRef(name, commitId, #Branch);
    "Branch " # name # " created at commit " # debug_show (commitId);
  };

  public func getCommitHistory(commitId : Nat32) : async [CommitModule.Commit] {
    var visited : [Nat32] = [];
    var result : [CommitModule.Commit] = [];

    func isVisited(id : Nat32) : Bool {
      Option.isSome(Array.find<Nat32>(visited, func(v) { v == id }));
    };

    func processCommit(id : Nat32) : async () {
      if (isVisited(id)) return;
      visited := Array.append<Nat32>(visited, [id]);
      switch (await getCommit(Nat32.toNat(id))) {
        case (?commit) {
          result := Array.append(result, [commit]);
          for (parent in commit.parents.vals()) {
            await processCommit(parent);
          };
        };
        case null {};
      };
    };

    await processCommit(commitId);
    result;
  };

  public func getBranchHistory(branchName : Text) : async [CommitModule.Commit] {
    switch (await getRef(branchName)) {
      case (?ref) {
        await getCommitHistory(ref.target);
      };
      case null {
        [];
      };
    };
  };

  public shared ({ caller }) func mergeBranch(sourceBranch : Text, targetBranch : Text, author : Types.Author, message : Text) : async Text {
    assert isAuthorized(caller);
    let sourceRefOpt = await getRef(sourceBranch);
    let targetRefOpt = await getRef(targetBranch);

    switch (sourceRefOpt, targetRefOpt) {
      case (?src, ?tgt) {
        let sourceCommitId = src.target;
        let targetCommitId = tgt.target;

        let sourceCommitOpt = await getCommit(Nat32.toNat(sourceCommitId));
        let targetCommitOpt = await getCommit(Nat32.toNat(targetCommitId));

        switch (sourceCommitOpt, targetCommitOpt) {
          case (?srcCommit, ?tgtCommit) {
            let mergeTree = srcCommit.tree;
            let mergeCommit = CommitModule.createCommit(
              mergeTree,
              [sourceCommitId, targetCommitId],
              author,
              message # " (Merged " # sourceBranch # " into " # targetBranch # ")",
            );
            let cborBytes = CBOR.encodeCommitObject(mergeCommit);
            commitsCBOR := Array.append<[[Nat8]]>(commitsCBOR, [cborBytes]);
            let newId = commitsCBOR.size() - 1;
            ignore addRef(targetBranch, Nat32.fromNat(newId), #Branch);
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
    let newBlobsCBOR = blobsCBOR;
    let newTreesCBOR = treesCBOR;
    let newCommitsCBOR = commitsCBOR;
    let newRefsCBOR = refsCBOR;
    let newHeadRef = headRef;
    let newHeadCommitId = headCommitId;

    repoName := forkedName;
    owner := caller;
    collaborators := [];
    blobsCBOR := newBlobsCBOR;
    treesCBOR := newTreesCBOR;
    commitsCBOR := newCommitsCBOR;
    refsCBOR := newRefsCBOR;
    headRef := newHeadRef;
    headCommitId := newHeadCommitId;

    return "Repository successfully forked as '" # forkedName # "' with new owner.";
  };

  public shared ({ caller }) func deleteBranch(name : Text) : async Text {
    assert isAuthorized(caller);
    if (name == headRef) {
      return "Cannot delete the currently checked-out branch.";
    };

    let newRefsCBOR = Array.filter<[[Nat8]]>(
      refsCBOR,
      func(bytes) { CBOR.decodeRefObject(bytes).name != name },
    );

    if (newRefsCBOR.size() == refsCBOR.size()) {
      return "Branch not found.";
    };

    refsCBOR := newRefsCBOR;
    return "Branch '" # name # "' deleted.";
  };

};
