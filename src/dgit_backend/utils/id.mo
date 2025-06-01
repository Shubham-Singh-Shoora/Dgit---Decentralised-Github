import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";

object {
  private var counter : Nat = 0;

  public func nextId(prefix : Text) : Text {
    counter += 1;
    let time = Nat64.toNat(Nat64.fromIntWrap(Time.now()));
    prefix # "-" # Nat.toText(time) # "-" # Nat.toText(counter)
  }
}