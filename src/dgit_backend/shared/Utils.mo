import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Types "/Types";
import Nat32 "mo:base/Nat32";

module {
    // Convert time to nanoseconds
    public func timeNow() : Int {
        return Time.now();
    };

    // Helper to convert Principal to Text
    public func principalToText(p : Principal) : Text {
        return Principal.toText(p);
    };

    // Generate a simple hash (for demo purposes - in a real implementation, use proper cryptographic hash)
    public func generateHash(content : Blob) : Text {
        let hash = Hash.hash(Nat32.toNat(Blob.hash(content)));
        let natHash = Nat32.toNat(hash);
        return Nat.toText(natHash);

    };

    // Helper to create default profile
    public func createDefaultProfile(principal : Principal, username : Text) : Types.Profile {
        {
            username = username;
            bio = "New dGit-ICP User";
            avatar_url = "https://dgit-icp.ic0.app/default-avatar.png";
            joined = timeNow();
            principal_id = principalToText(principal);
        };
    };

    // For optional values handling
    public func getOrDefault<T>(opt : ?T, default : T) : T {
        switch (opt) {
            case (null) { default };
            case (?val) { val };
        };
    };
};
