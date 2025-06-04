import id "../utils/id";
import time "../utils/time";

module {
  // Ref data structure, similar to a Git reference (branch, tag, etc.)
  public type Ref = {
    id : id.Id;
    createdAt : time.Timestamp;
    name : Text; // Name of the reference (e.g., "refs/heads/main", "refs/tags/v1.0")
    target : id.Id; // The commit (or object) this ref points to
    refType : RefType; // Branch, Tag, or Other
  };

  public type RefType = {
    #Branch;
    #Tag;
    #Other;
  };

  public func createRef(name : Text, target : id.Id, refType : RefType) : Ref {
    // Prepare as [Nat32]
    let nameId : id.Id = id.textToId(name);
    let refTypeId : id.Id = id.textToId(debug_show refType);
    let allIds : [id.Id] = [nameId, target, refTypeId];
    let content : [Nat8] = id.concatIds(allIds);
    let refId = id.generateId(content);
    let now = time.now();
    {
      id = refId;
      createdAt = now;
      name = name;
      target = target;
      refType = refType;
    };
  };

  // Getters
  public func getRefId(ref : Ref) : id.Id {
    ref.id;
  };

  public func getRefTime(ref : Ref) : time.Timestamp {
    ref.createdAt;
  };

  public func getRefName(ref : Ref) : Text {
    ref.name;
  };

  public func getRefTarget(ref : Ref) : id.Id {
    ref.target;
  };

  public func getRefType(ref : Ref) : RefType {
    ref.refType;
  };
};
