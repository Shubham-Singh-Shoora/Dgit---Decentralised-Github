import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";

actor {
    public type CommitId = Text;
    public type TreeId = Text;

    public type AuthorInfo = {
        name: Text;
        email: Text;
        timestamp: Int;
    };

    public type CommitData = {
        id: CommitId;
        treeId: TreeId;
        parents: [CommitId];
        author: AuthorInfo;
        committer: AuthorInfo;
        message: Text;
        hash: Text;
    };

    stable var stableEntries : [(CommitId, CommitData)] = [];

    var store = Map.HashMap<CommitId, CommitData>(32, Text.equal, Text.hash);


    public func put(
        id: CommitId,
        treeId: TreeId,
        parents: [CommitId],
        author: AuthorInfo,
        committer: AuthorInfo,
        message: Text
    ) : async CommitData {
        let commitData = {
            id = id;
            treeId = treeId;
            parents = parents;
            author = author;
            committer = committer;
            message = message;
            hash = generateCommitHash(id, treeId, message);
        };
        store.put(id, commitData);
        return commitData;
    };

    public func get(id: CommitId) : async ?CommitData {
        return store.get(id);
    };

    public func getParents(id: CommitId) : async ?[CommitId] {
        return switch (store.get(id)) {
            case (?commit) ?commit.parents;
            case null null;
        };
    };

    public func getHistory(id: CommitId, limit: Nat) : async [CommitData] {
        var history : [CommitData] = [];
        var current = ?id;
        var count = 0;

        while (current != null and count < limit) {
            switch (current) {
                case (?commitId) {
                    switch (store.get(commitId)) {
                        case (?commit) {
                            history := Array.append(history, [commit]);
                            current := if (commit.parents.size() > 0) ?commit.parents[0] else null;
                            count += 1;
                        };
                        case null current := null;
                    }
                };
                case null {};
            }
        };
        return history;
    };

    public func createAuthor(name: Text, email: Text) : async AuthorInfo {
        return {
            name = name;
            email = email;
            timestamp = Time.now();
        };
    };


    system func preupgrade() {
        stableEntries := Iter.toArray(store.entries());
    };

    system func postupgrade() {
        store := Map.fromIter<CommitId, CommitData>(
            stableEntries.vals(),
            32,
            Text.equal,
            Text.hash
        );
        stableEntries := [];
    };


    private func generateCommitHash(id: CommitId, treeId: TreeId, message: Text) : Text {
        let combined = id # treeId # message;
        Text.fromChar(Char.fromNat32(Nat32.fromNat(combined.size() % 256)))
    };
}
