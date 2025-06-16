import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module {
    /// Alias for Principal as CanisterId
    public type CanisterId = Principal;
    public type CanisterIdRecord = { canister_id : CanisterId };

    /// Settings for canister creation
    public type CanisterSettings = {
        controllers : ?[Principal];
        compute_allocation : ?Nat;
        memory_allocation : ?Nat;
        freezing_threshold : ?Nat;
    };

    public type CreateCanisterArgs = {
        settings : ?CanisterSettings;
    };

    public type InstallMode = {
        #install;
        #reinstall;
        #upgrade;
    };

    public type InstallCodeArgs = {
        mode : InstallMode;
        canister_id : CanisterId;
        wasm_module : Blob; // [Nat8] (alias)
        arg : Blob; // [Nat8] (alias)
    };

    /// The management canister interface
    public type IC = actor {
        create_canister : shared (CreateCanisterArgs) -> async CanisterIdRecord;
        install_code : shared (InstallCodeArgs) -> async ();
    };

    /// Returns a reference to the management canister actor
    public func IC() : IC = actor ("aaaaa-aa") : IC;
};
