import Array "mo:base/Array";
import BlobModule "./git/blob";
import CommitModule "./git/commit";
import RefModule "./git/ref";
import TreeModule "./git/tree";
import Types "./git/types";

actor Main {

  var blobs : [BlobModule.Blob] = [];
  var commits : [CommitModule.Commit] = [];
  var trees : [TreeModule.Tree] = [];
  var refs : [RefModule.Ref] = [];

  // ----- Blob functions -----
  public func addBlob(content : [Nat8]) : async BlobModule.Blob {
    let blob = BlobModule.createBlob(content);
    blobs := Array.tabulate<BlobModule.Blob>(
      blobs.size() + 1,
      func(i) {
        if (i < blobs.size()) { blobs[i] } else { blob };
      },
    );
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
  public func addTree(entries : [TreeModule.TreeEntry]) : async TreeModule.Tree {
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
  public func addCommit(tree : Nat32, parents : [Nat32], author : Types.Author, message : Text) : async CommitModule.Commit {
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

  // ----- Ref functions -----
  public func addRef(name : Text, target : Nat32, refType : RefModule.RefType) : async RefModule.Ref {
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
      let newRefs : [RefModule.Ref] = Array.tabulate<RefModule.Ref>(
        refs.size() + 1,
        func(i) {
          if (i < refs.size()) { refs[i] } else { ref };
        },
      );
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
};
