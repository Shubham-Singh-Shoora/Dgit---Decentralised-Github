import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Types "/Types";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";
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

    // Generate username from principal (used in UserDirectory)
    public func generateUsername(principal : Principal) : Text {
        let principalText = Principal.toText(principal);
        let charArr = Iter.toArray(Text.toIter(principalText));
        let slicedIter = Array.slice(charArr, 0, 8);
        "user" # Text.fromIter(slicedIter);
    };

    // Encode the owner principal for canister initialization
    public func encodeInit(owner : Principal) : Blob {
        // Simple encoding - convert principal to blob for canister init
        Principal.toBlob(owner);
    };

    // Helper to verify WASM file header (basic validation)
    public func isValidWasm(wasm : Blob) : Bool {
        let bytes = Blob.toArray(wasm);

        // Check minimum size
        if (bytes.size() < 8) { return false };

        // Check WASM magic number: 0x00, 0x61, 0x73, 0x6D
        if (bytes[0] != 0x00 or bytes[1] != 0x61 or bytes[2] != 0x73 or bytes[3] != 0x6D) {
            return false;
        };

        // Check version: 0x01, 0x00, 0x00, 0x00
        if (bytes[4] != 0x01 or bytes[5] != 0x00 or bytes[6] != 0x00 or bytes[7] != 0x00) {
            return false;
        };

        true;
    };
};
