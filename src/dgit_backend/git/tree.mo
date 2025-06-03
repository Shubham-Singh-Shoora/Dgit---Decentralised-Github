import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";

actor {
    public type TreeId = Text;
    public type BlobId = Text;
    public type Path = Text;

    public type TreeEntry = {
        #file : { path : Path; blobId : BlobId };
        #directory : { path : Path; treeId : TreeId };
    };

    public type TreeData = {
        id : TreeId;
        entries : [TreeEntry];
        hash : Text;
    };

    stable var entries : [(TreeId, TreeData)] = [];

    var store = Map.fromIter<TreeId, TreeData>(
        entries.vals(),
        32,
        Text.equal,
        Text.hash,
    );

    public func put(id : TreeId, treeEntries : [TreeEntry]) : async TreeData {
        let treeData = {
            id = id;
            entries = treeEntries;
            hash = generateTreeHash(treeEntries);
        };
        store.put(id, treeData);
        return treeData;
    };

    public query func get(id : TreeId) : async ?TreeData {
        store.get(id);
    };

    public query func getEntry(treeId : TreeId, path : Path) : async ?TreeEntry {
        switch (store.get(treeId)) {
            case (?tree) {
                Array.find<TreeEntry>(
                    tree.entries,
                    func(entry) {
                        switch (entry) {
                            case (#file(f)) f.path == path;
                            case (#directory(d)) d.path == path;
                        };
                    },
                );
            };
            case null null;
        };
    };

    public func addEntry(treeId : TreeId, entry : TreeEntry) : async ?TreeData {
        switch (store.get(treeId)) {
            case (?tree) {
                let newEntries = Array.append(tree.entries, [entry]);
                let updated = await put(treeId, newEntries);
                return ?updated;
            };
            case null return null;
        };
    };

    public query func listEntries(treeId : TreeId) : async ?[TreeEntry] {
        switch (store.get(treeId)) {
            case (?tree) ?tree.entries;
            case null null;
        };
    };

    private func generateTreeHash(treeEntries : [TreeEntry]) : Text {

        Text.fromChar(Char.fromNat32(Nat32.fromNat(treeEntries.size() % 256)));
    };

    system func preupgrade() {
        entries := Iter.toArray(store.entries());
    };

    system func postupgrade() {
        store := Map.fromIter<TreeId, TreeData>(
            entries.vals(),
            32,
            Text.equal,
            Text.hash,
        );
        entries := [];
    };
};
