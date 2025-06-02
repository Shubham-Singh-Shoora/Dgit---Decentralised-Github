import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";

actor {
    public type BlobId = Text;
    public type Content = Blob;

    public type BlobData = {
        id: BlobId;
        content: Content;
        size: Nat;
        hash: Text;
    };

    stable var stableEntries : [(BlobId, BlobData)] = [];

    var store = Map.HashMap<BlobId, BlobData>(32, Text.equal, Text.hash);


    public func put(id: BlobId, content: Content) : async BlobData {
        let blobData : BlobData = {
            id = id;
            content = content;
            size = content.size();
            hash = generateHash(content);
        };
        store.put(id, blobData);
        return blobData;
    };

    public func get(id: BlobId) : async ?BlobData {
        return store.get(id);
    };

    public func exists(id: BlobId) : async Bool {
        return switch (store.get(id)) {
            case (?_) true;
            case null false;
        };
    };

    public func delete(id: BlobId) : async Bool {
        return switch (store.remove(id)) {
            case (?_) true;
            case null false;
        };
    };

    system func preupgrade() {
        stableEntries := Iter.toArray(store.entries());
    };

    system func postupgrade() {
        store := Map.fromIter<BlobId, BlobData>(
            stableEntries.vals(),
            32,
            Text.equal,
            Text.hash
        );
        stableEntries := [];
    };


    private func generateHash(content: Content) : Text {
        Text.fromChar(Char.fromNat32(Nat32.fromNat(content.size() % 256)))
    };
}
