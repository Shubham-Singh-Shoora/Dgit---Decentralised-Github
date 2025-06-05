import Array "mo:base/Array";
import blob "./blob";
import commit "./commit";
import tree "./tree";
import ref "./ref";
import Nat8 "mo:base/Nat8";
import id "../utils/id";

module {
  // Use object instead of module-level variable for mutable state
  public class Storage() {
    private var commits : [commit.Commit] = [];
    private var blobs : [blob.Blob] = [];
    private var trees : [tree.Tree] = [];
    private var refs : [ref.Ref] = [];

    // Public helper to insert a new commit and return its ID (index)
    public func insertCommit(newCommit : commit.Commit) : id.Id {
      // Generate ID using proper method from your id module
      let commitId : id.Id = id.generateId([Nat8.fromNat(commits.size())]); // Or whatever method your id module uses
      let updatedCommit = { newCommit with id = commitId };
      commits := Array.tabulate<commit.Commit>(
        commits.size() + 1,
        func(i) {
          if (i < commits.size()) {
            commits[i];
          } else {
            updatedCommit;
          };
        },
      );
      commitId;
    };

    public func findBlob(searchId : id.Id) : ?blob.Blob {
      Array.find<blob.Blob>(blobs, func(b) { b.id == searchId });
    };

    public func findCommit(searchId : id.Id) : ?commit.Commit {
      Array.find<commit.Commit>(commits, func(c) { c.id == searchId });
    };

    public func findTree(searchId : id.Id) : ?tree.Tree {
      Array.find<tree.Tree>(trees, func(t) { t.id == searchId });
    };

    public func findRef(name : Text) : ?ref.Ref {
      Array.find<ref.Ref>(refs, func(r) { r.name == name });
    };

    // Add getters for arrays
    public func getAllCommits() : [commit.Commit] {
      commits;
    };

    // Add other necessary methods here
  };

  // Static utility functions (don't need access to state)
  public func findBlobInArray(blobs : [blob.Blob], searchId : id.Id) : ?blob.Blob {
    Array.find<blob.Blob>(blobs, func(b) { b.id == searchId });
  };

  public func findCommitInArray(commits : [commit.Commit], searchId : id.Id) : ?commit.Commit {
    Array.find<commit.Commit>(commits, func(c) { c.id == searchId });
  };

  public func findTreeInArray(trees : [tree.Tree], searchId : id.Id) : ?tree.Tree {
    Array.find<tree.Tree>(trees, func(t) { t.id == searchId });
  };

  public func findRefInArray(refs : [ref.Ref], name : Text) : ?ref.Ref {
    Array.find<ref.Ref>(refs, func(r) { r.name == name });
  };
};
