import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

import Types "types"; 

actor {

    public type RepoId = Text;
    public type RepoMeta = Types.RepoMeta;

    stable var stableRepos : [(RepoId, RepoMeta)] = [];

    var repoStore = Map.fromIter<RepoId, RepoMeta>(
        stableRepos.vals(), 32, Text.equal, Text.hash
    );

    public func createRepo(id: RepoId, meta: RepoMeta) : async Bool {
        if (repoStore.get(id) != null) return false;
        repoStore.put(id, meta);
        return true;
    };

    public func getRepo(id: RepoId) : async ?RepoMeta {
        return repoStore.get(id);
    };

    public func listRepos() : async [RepoMeta] {
        return Iter.toArray(repoStore.vals());
    };

    public func deleteRepo(id: RepoId) : async Bool {
        return switch (repoStore.remove(id)) {
            case (?_) true;
            case null false;
        };
    };

    system func preupgrade() {
        stableRepos := Iter.toArray(repoStore.entries());
    };

    system func postupgrade() {
        repoStore := Map.fromIter<RepoId, RepoMeta>(
            stableRepos.vals(), 32, Text.equal, Text.hash
        );
        stableRepos := [];
    };
}
