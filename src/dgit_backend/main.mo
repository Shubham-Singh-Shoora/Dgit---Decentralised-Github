import BlobModule "git/blob";
import TreeModule "git/tree";
import CommitModule "git/commit";
import RefModule "git/ref";
import Storage "git/storage";
import Types "git/types";
import TimeUtil "utils/time";
import IdUtil "utils/id";

actor class Repository(initName: Text, initOwner: Principal) = this {

  // Metadata
  stable var name : Text = initName;
  stable var owner : Principal = initOwner;

  // In-memory stores using your modules (adjust based on how you structured them)
  let blobStore = BlobModule.init();
  let treeStore = TreeModule.init();
  let commitStore = CommitModule.init();
  let refStore = RefModule.init();

  public query func getName() : async Text {
    name
  };

  public query func getOwner() : async Principal {
    owner
  };

  public func putBlob(content: Text) : async Text {
    blobStore.put(content)
  };

  public func putTree(entries: [(Text, Text)]) : async Text {
    treeStore.put(entries)
  };

  public func commitCode(tree: Text, message: Text, parents: [Text]) : async Text {
    commitStore.commit({
      tree;
      message;
      parents;
      author = owner;
      timestamp = TimeUtil.now();
    })
  };

  public func createBranch(name: Text, commitHash: Text) : async Bool {
    refStore.createBranch(name, commitHash)
  };

  public query func getBranch(name: Text) : async ?Text {
    refStore.getBranch(name)
  };
}
