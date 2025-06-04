import id "../utils/id";
import time "../utils/time";
import types "./types";
import Array "mo:base/Array";

module {
  // TreeEntry represents a file or subdirectory in the tree
  public type TreeEntry = {
    name : Text;
    kind : types.EntryKind; // Blob or Tree
    id : id.Id; // Blob or sub-tree id
    mode : Nat32; // Permissions/mode, e.g. 0o100644 for file
  };

  // Tree data structure, similar to a Git tree object
  public type Tree = {
    id : id.Id;
    createdAt : time.Timestamp;
    entries : [TreeEntry];
  };

  // Create a new tree from entries
  public func createTree(entries : [TreeEntry]) : Tree {
    let entryIds = Array.map<TreeEntry, id.Id>(entries, func(e) { e.id });
    let content : [Nat8] = id.concatIds(entryIds);
    let treeId = id.generateId(content);
    let now = time.now();
    {
      id = treeId;
      createdAt = now;
      entries = entries;
    };
  };

  // Get tree id
  public func getTreeId(tree : Tree) : id.Id {
    tree.id;
  };

  // Get tree creation time
  public func getTreeTime(tree : Tree) : time.Timestamp {
    tree.createdAt;
  };

  // Get tree entries
  public func getTreeEntries(tree : Tree) : [TreeEntry] {
    tree.entries;
  };
};
