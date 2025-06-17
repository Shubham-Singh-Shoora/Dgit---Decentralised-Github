import Types "../shared/Types";
import Utils "../shared/Utils";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import IC "../shared/ic";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";

actor UserDirectory {
    // Stable storage for user profiles and their canister IDs
    private stable var userEntries : [(Principal, Types.UserRepoCanisterInfo)] = [];
    private var users = HashMap.HashMap<Principal, Types.UserRepoCanisterInfo>(10, Principal.equal, Principal.hash);

    // WASM module for user_repo canister
    private stable var userRepoWasm : ?Blob = null;

    // Initialization, called on upgrade or deployment
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, Types.UserRepoCanisterInfo>(
            userEntries.vals(),
            userEntries.size(),
            Principal.equal,
            Principal.hash,
        );
        userEntries := [];
    };

    // Upload the user_repo.wasm code (admin only)
    public shared (msg) func uploadUserRepoWasm(wasm : Blob) : async Result.Result<(), Text> {
        // In production, add proper access control
        // if (not isAdmin(msg.caller)) return #err("Unauthorized");

        userRepoWasm := ?wasm;
        #ok();
    };

    // Create a new user canister or return existing one
    public shared (msg) func create_user_canister() : async Result.Result<Types.UserRepoCanisterInfo, Text> {
        let userPrincipal = msg.caller;
        let ic = IC.IC();

        // Check if the user already has a canister
        switch (users.get(userPrincipal)) {
            case (?userInfo) {
                return #ok(userInfo);
            };
            case (null) {
                // Continue with creation
            };
        };

        // Make sure we have the wasm binary
        switch (userRepoWasm) {
            case (null) {
                return #err("User repo WASM not uploaded yet");
            };
            case (?wasm) {
                try {
                    // Create a new canister
                    let settings : IC.CanisterSettings = {
                        controllers = ?[userPrincipal, Principal.fromActor(UserDirectory)];
                        freezing_threshold = null;
                        memory_allocation = null;
                        compute_allocation = null;
                    };

                    let createArgs : IC.CreateCanisterArgs = {
                        settings = ?settings;
                    };

                    let result = await ic.create_canister(createArgs);
                    let canisterId = result.canister_id;

                    let installArgs : IC.InstallCodeArgs = {
                        mode = #install;
                        canister_id = canisterId;
                        wasm_module = wasm;
                        arg = Blob.fromArray([]); // or just []
                    };

                    await ic.install_code(installArgs);

                    // Create the UserRepo actor and initialize it
                    let userRepo = actor (Principal.toText(canisterId)) : actor {
                        getProfile : shared () -> async Types.Profile;
                        updateProfile : shared (Types.ProfileUpdate) -> async Result.Result<Types.Profile, Text>;
                    };

                    let principalText = Principal.toText(userPrincipal);
                    let charArr = Iter.toArray(Text.toIter(principalText));
                    let slicedIter = Array.slice(charArr, 0, 8); // This is an iterator
                    let defaultUsername = "user" # Text.fromIter(slicedIter); // Use iterator directly

                    // Initialize the profile
                    let initialProfile : Types.ProfileUpdate = {
                        username = ?defaultUsername;
                        bio = ?"New dGit-ICP User";
                        avatar_url = ?"https://dgit-icp.ic0.app/default-avatar.png";
                    };

                    // Update the profile
                    let profileResult = await userRepo.updateProfile(initialProfile);

                    switch (profileResult) {
                        case (#err(e)) {
                            return #err("Failed to initialize user profile: " # e);
                        };
                        case (#ok(profile)) {
                            // Store the canister info
                            let userInfo : Types.UserRepoCanisterInfo = {
                                canister_id = canisterId;
                                profile = profile;
                            };

                            users.put(userPrincipal, userInfo);
                            return #ok(userInfo);
                        };
                    };
                } catch (e) {
                    return #err("Failed to create user canister: " # Error.message(e));
                };
            };
        };
    };

    // Edit a user's profile in both user_directory and user_repo canisters
    public shared (msg) func edit_profile(update : Types.ProfileUpdate) : async Result.Result<Types.Profile, Text> {
        let userPrincipal = msg.caller;

        switch (users.get(userPrincipal)) {
            case (null) {
                return #err("User not found. Please create a canister first.");
            };
            case (?userInfo) {
                try {
                    // Call the user's canister to update the profile
                    let userRepo = actor (Principal.toText(userInfo.canister_id)) : actor {
                        updateProfile : shared (Types.ProfileUpdate) -> async Result.Result<Types.Profile, Text>;
                    };

                    let result = await userRepo.updateProfile(update);

                    switch (result) {
                        case (#err(e)) {
                            return #err("Failed to update profile: " # e);
                        };
                        case (#ok(newProfile)) {
                            // Update our local copy
                            let updatedInfo : Types.UserRepoCanisterInfo = {
                                canister_id = userInfo.canister_id;
                                profile = newProfile;
                            };

                            users.put(userPrincipal, updatedInfo);
                            return #ok(newProfile);
                        };
                    };
                } catch (e) {
                    return #err("Failed to communicate with user canister: " # Error.message(e));
                };
            };
        };
    };

    // Get a user's profile
    public query func show_profile(principal : Principal) : async ?Types.Profile {
        switch (users.get(principal)) {
            case (null) { null };
            case (?userInfo) { ?userInfo.profile };
        };
    };

    // Get all registered users
    public query func get_all_users() : async [Types.Profile] {
        let buffer = Buffer.Buffer<Types.Profile>(users.size());

        for ((_, userInfo) in users.entries()) {
            buffer.add(userInfo.profile);
        };

        Buffer.toArray(buffer);
    };

    // Get a user's canister ID
    public query func get_user_canister(principal : Principal) : async ?Principal {
        switch (users.get(principal)) {
            case (null) { null };
            case (?userInfo) { ?userInfo.canister_id };
        };
    };

    // Get number of registered users
    public query func get_user_count() : async Nat {
        users.size();
    };
};
