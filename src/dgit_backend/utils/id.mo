import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

module {
  public type Id = Nat32;

  // Simple all-bits hash function for a byte array
  public func generateId(data : [Nat8]) : Id {
    var hash : Nat32 = 2166136261; // FNV offset basis
    for (b in data.vals()) {
      hash := hash ^ Nat32.fromNat(Nat8.toNat(b));
      hash := hash *% 16777619; // FNV prime with wrap multiplication
    };
    Debug.print("Final hash: " # Nat32.toText(hash));
    hash;
  };

  // Convert Text to [Nat8] for id generation
  public func textToId(txt : Text) : Nat32 {
    generateId(Blob.toArray(Text.encodeUtf8(txt)));
  };

  // Concatenate multiple Ids into a [Nat8] list for hashing
  public func concatIds(ids : [Id]) : [Nat8] {
    var result : [Nat8] = [];
    for (i in ids.vals()) {
      // Create a new array with the 4 bytes from this ID
      let bytes : [Nat8] = [
        Nat8.fromNat(Nat32.toNat((i >> 24) & 0xFF)),
        Nat8.fromNat(Nat32.toNat((i >> 16) & 0xFF)),
        Nat8.fromNat(Nat32.toNat((i >> 8) & 0xFF)),
        Nat8.fromNat(Nat32.toNat(i & 0xFF)),
      ];

      // Use Array.append instead of # operator
      for (byte in bytes.vals()) {
        result := Array.tabulate<Nat8>(
          result.size() + 1,
          func(i) {
            if (i < result.size()) { result[i] } else { byte };
          },
        );
      };
    };
    result;
  };
};
