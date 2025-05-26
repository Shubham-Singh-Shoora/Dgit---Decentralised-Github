import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor {
    public type RefName = Text;
    public type CommitId = Text;

    public type RefType = {
        #branch;
        #tag;
        #head;
    };

    public type RefData = {
        name: RefName;
        target: CommitId;
        refType: RefType;
        protected: Bool;
    };

    stable var stableEntries: [(RefName, RefData)] = [];

    var store = Map.fromIter<RefName, RefData>(
        stableEntries.vals(), 32, Text.equal, Text.hash
    );

    public func put(
        name: RefName,
        target: CommitId,
        refType: RefType,
        protected: Bool
    ) : async RefData {
        let refData = {
            name = name;
            target = target;
            refType = refType;
            protected = protected;
        };
        store.put(name, refData);
        return refData;
    };

    public func get(name: RefName) : async ?RefData {
        return store.get(name);
    };

    public func updateTarget(name: RefName, newTarget: CommitId) : async ?RefData {
        switch (store.get(name)) {
            case (?ref) {
                if (not ref.protected) {
                    let updated = {
                        name = ref.name;
                        target = newTarget;
                        refType = ref.refType;
                        protected = ref.protected;
                    };
                    store.put(name, updated);
                    return ?updated;
                } else return null;
            };
            case null return null;
        }
    };

    public func delete(name: RefName) : async Bool {
        switch (store.get(name)) {
            case (?ref) {
                if (not ref.protected) {
                    ignore store.remove(name);
                    return true;
                } else return false;
            };
            case null return false;
        }
    };

    public func listByType(refType: RefType) : async [RefData] {
        return store.vals()
            |> Iter.filter(_, func(ref: RefData) : Bool { ref.refType == refType })
            |> Iter.toArray(_);
    };

    public func listAll() : async [RefData] {
        return store.vals() |> Iter.toArray(_);
    };

    public func createBranch(name: RefName, target: CommitId) : async RefData {
        return await put(name, target, #branch, false);
    };

    public func createTag(name: RefName, target: CommitId) : async RefData {
        return await put(name, target, #tag, true);
    };

    public func setHead(target: CommitId) : async RefData {
        return await put("HEAD", target, #head, false);
    };

    public func getHead() : async ?CommitId {
        switch (store.get("HEAD")) {
            case (?ref) return ?ref.target;
            case null return null;
        }
    };

    system func preupgrade() {
        stableEntries := Iter.toArray(store.entries());
    };

    system func postupgrade() {
        store := Map.fromIter<RefName, RefData>(
            stableEntries.vals(), 32, Text.equal, Text.hash
        );
        stableEntries := [];
    };
}
