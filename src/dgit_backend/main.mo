import Blob "./git/blob";
import Tree "./git/tree";
import Commit "./git/commit";
import Ref "./git/ref";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";

actor GitSystem {
    private let blobStore = Blob.BlobStore();
    private let treeStore = Tree.TreeStore();
    private let commitStore = Commit.CommitStore();
    private let refStore = Ref.RefStore();

    public type BlobId = Blob.BlobId;
    public type TreeId = Tree.TreeId;
    public type CommitId = Commit.CommitId;
    public type RefName = Ref.RefName;

    public func init() : async Bool {
        let initialTree = treeStore.put("initial", []);
        let author = commitStore.createAuthor("System", "system@git");
        let initialCommit = commitStore.put(
            "initial-commit",
            initialTree.id,
            [],
            author,
            author,
            "Initial commit"
        );
        ignore refStore.createBranch("master", initialCommit.id);
        ignore refStore.setHead(initialCommit.id);
        true
    };

    public func storeBlob(content: Blob.Content) : async BlobId {
        let id = generateId("blob");
        let blob = blobStore.put(id, content);
        blob.id
    };

    public func getBlob(id: BlobId) : async ?Blob.BlobData {
        blobStore.get(id)
    };

    public func storeTree(entries: [Tree.TreeEntry]) : async TreeId {
        let id = generateId("tree");
        let tree = treeStore.put(id, entries);
        tree.id
    };

    public func getTree(id: TreeId) : async ?Tree.TreeData {
        treeStore.get(id)
    };

    public func createCommit(
        treeId: TreeId,
        parents: [CommitId],
        author: Text,
        email: Text,
        message: Text
    ) : async CommitId {
        let id = generateId("commit");
        let authorInfo = commitStore.createAuthor(author, email);
        let commit = commitStore.put(id, treeId, parents, authorInfo, authorInfo, message);
        commit.id
    };

    public func getCommit(id: CommitId) : async ?Commit.CommitData {
        commitStore.get(id)
    };

    public func getCommitHistory(id: CommitId, limit: Nat) : async [Commit.CommitData] {
        commitStore.getHistory(id, limit)
    };

    public func createBranch(name: RefName, target: CommitId) : async Bool {
        ignore refStore.createBranch(name, target);
        true
    };

    public func createTag(name: RefName, target: CommitId) : async Bool {
        ignore refStore.createTag(name, target);
        true
    };

    public func updateRef(name: RefName, target: CommitId) : async Bool {
        switch (refStore.updateTarget(name, target)) {
            case (?_) true;
            case null false;
        }
    };

    public func getRef(name: RefName) : async ?Ref.RefData {
        refStore.get(name)
    };

    public func listBranches() : async [Ref.RefData] {
        refStore.listByType(#branch)
    };

    public func listTags() : async [Ref.RefData] {
        refStore.listByType(#tag)
    };

    public func getCurrentHead() : async ?CommitId {
        refStore.getHead()
    };

    private func generateId(prefix: Text) : Text {
        prefix # "-" # Text.fromChar(Char.fromNat32(Nat32.fromNat(Array.size([]) % 256)))
    };

    system func preupgrade() {
    };

    system func postupgrade() {
    };
}