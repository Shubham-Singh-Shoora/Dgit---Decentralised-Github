import Debug "mo:base/Debug";
import id "./utils/id";
import Nat32 "mo:base/Nat32";

actor {
    public func testHash() : async Nat32 {
        let data : [Nat8] = [72, 101, 108, 108, 111];
        let hash = id.generateId(data);
        Debug.print("Hash = " # Nat32.toText(hash));
        return hash;
    };
};
