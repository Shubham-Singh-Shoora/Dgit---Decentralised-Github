import Array "mo:base/Array";
import blob "./blob";
import commit "./commit";
import tree "./tree";
import ref "./ref";
import id "../utils/id";

module {
  public func findBlob(blobs : [blob.Blob], searchId : id.Id) : ?blob.Blob {
    Array.find<blob.Blob>(blobs, func(b) { b.id == searchId });
  };
  public func findCommit(commits : [commit.Commit], searchId : id.Id) : ?commit.Commit {
    Array.find<commit.Commit>(commits, func(c) { c.id == searchId });
  };
  public func findTree(trees : [tree.Tree], searchId : id.Id) : ?tree.Tree {
    Array.find<tree.Tree>(trees, func(t) { t.id == searchId });
  };
  public func findRef(refs : [ref.Ref], name : Text) : ?ref.Ref {
    Array.find<ref.Ref>(refs, func(r) { r.name == name });
  };
};
