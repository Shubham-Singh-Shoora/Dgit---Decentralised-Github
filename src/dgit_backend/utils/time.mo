import Time "mo:base/Time";

module {
  // Use Int as a timestamp (nanoseconds since Unix epoch)
  public type Timestamp = Int;

  // Get current time as timestamp
  public func now() : Timestamp {
    Time.now()
  }
}