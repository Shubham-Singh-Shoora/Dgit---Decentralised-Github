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
import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";

actor UserDirectory {
    // Stable storage for user profiles and their canister IDs
    private stable var userEntries : [(Principal, Types.UserRepoCanisterInfo)] = [];
    private var users = HashMap.HashMap<Principal, Types.UserRepoCanisterInfo>(10, Principal.equal, Principal.hash);

    // Improved chunk handling
    private stable var wasmChunks : [(Nat, Blob)] = []; // (index, chunk)
    private stable var expectedChunks : Nat = 0;
    private stable var totalWasmSize : Nat = 0;

    // WASM module for user_repo canister
    private stable var userRepoWasm : ?Blob = null;

    // Initialization
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

    // Initialize chunked upload
    public shared (msg) func initWasmUpload(totalSize : Nat, chunkCount : Nat) : async Result.Result<(), Text> {
        // Add admin check here if needed
        wasmChunks := [];
        expectedChunks := chunkCount;
        totalWasmSize := totalSize;
        #ok();
    };

    // Upload WASM chunk with index for ordering
    public shared (msg) func uploadWasmChunk(index : Nat, chunk : Blob) : async Result.Result<Nat, Text> {
        // Add admin check here if needed

        if (index >= expectedChunks) {
            return #err("Invalid chunk index: " # Nat.toText(index));
        };

        // Check if chunk already exists (prevent duplicates)
        var found = false;
        for ((idx, _) in wasmChunks.vals()) {
            if (idx == index) {
                found := true;
            };
        };

        if (not found) {
            wasmChunks := Array.append(wasmChunks, [(index, chunk)]);
        };

        #ok(wasmChunks.size());
    };

    // Finalize WASM upload with integrity check
    public shared (msg) func finalizeWasmUpload() : async Result.Result<(), Text> {
        // Add admin check here if needed

        if (wasmChunks.size() != expectedChunks) {
            return #err("Missing chunks: expected " # Nat.toText(expectedChunks) # ", got " # Nat.toText(wasmChunks.size()));
        };

        // Sort chunks by index
        let sortedChunks = Array.sort<(Nat, Blob)>(wasmChunks, func((a1, _), (a2, _)) = Nat.compare(a1, a2));

        // Verify sequential indices
        for (i in Iter.range(0, sortedChunks.size() - 1)) {
            let (index, _) = sortedChunks[i];
            if (index != i) {
                return #err("Missing chunk at index: " # Nat.toText(i));
            };
        };

        // Assemble WASM
        let buffer = Buffer.Buffer<Nat8>(totalWasmSize);

        for ((_, chunk) in sortedChunks.vals()) {
            let bytes = Blob.toArray(chunk);
            for (byte in bytes.vals()) {
                buffer.add(byte);
            };
        };

        let assembledWasm = Blob.fromArray(Buffer.toArray(buffer));

        // Verify size
        if (assembledWasm.size() != totalWasmSize) {
            return #err("Size mismatch: expected " # Nat.toText(totalWasmSize) # ", got " # Nat.toText(assembledWasm.size()));
        };

        userRepoWasm := ?assembledWasm;
        wasmChunks := []; // Clear chunks

        Debug.print("WASM assembled successfully, size: " # Nat.toText(assembledWasm.size()));
        #ok();
    };

    // Direct WASM upload for smaller files
    public shared (msg) func uploadUserRepoWasm(wasm : Blob) : async Result.Result<(), Text> {
        // Add admin check here if needed
        userRepoWasm := ?wasm;
        Debug.print("WASM uploaded directly, size: " # Nat.toText(wasm.size()));
        #ok();
    };

    // Enhanced canister creation 
    public shared (msg) func create_user_canister() : async Result.Result<Types.UserRepoCanisterInfo, Text> {
        let userPrincipal = msg.caller;
        let ic = IC.IC();

        // Check if user already exists
        switch (users.get(userPrincipal)) {
            case (?userInfo) {
                return #ok(userInfo);
            };
            case (null) {};
        };

        // Verify WASM is available
        switch (userRepoWasm) {
            case (null) {
                return #err("User repo WASM not uploaded yet");
            };
            case (?wasm) {
                Debug.print("Creating canister with WASM size: " # Nat.toText(wasm.size()));

                try {
                    // Create canister with more cycles
                    let settings : IC.CanisterSettings = {
                        controllers = ?[userPrincipal, Principal.fromActor(UserDirectory)];
                        freezing_threshold = ?2_592_000; // 30 days
                        memory_allocation = ?536_870_912; // 512MB
                        compute_allocation = null;
                    };

                    let createArgs : IC.CreateCanisterArgs = {
                        settings = ?settings;
                    };

                    // Add more cycles (2T cycles)
                    Cycles.add<system>(2_000_000_000_000);
                    let result = await ic.create_canister(createArgs);
                    let canisterId = result.canister_id;

                    Debug.print("Canister created: " # Principal.toText(canisterId));

                    // Install code with proper error handling
                    let installArgs : IC.InstallCodeArgs = {
                        mode = #install;
                        canister_id = canisterId;
                        wasm_module = wasm;
                        arg = Utils.encodeInit(userPrincipal); // Encode the owner principal
                    };

                    await ic.install_code(installArgs);
                    Debug.print("Code installed successfully");

                    // Initialize user repo
                    let userRepo = actor (Principal.toText(canisterId)) : actor {
                        getProfile : shared () -> async Types.Profile;
                        updateProfile : shared (Types.ProfileUpdate) -> async Result.Result<Types.Profile, Text>;
                    };

                    let defaultUsername = Utils.generateUsername(userPrincipal);
                    let initialProfile : Types.ProfileUpdate = {
                        username = ?defaultUsername;
                        bio = ?"New dGit-ICP User";
                        avatar_url = ?"https://dgit-icp.ic0.app/default-avatar.png";
                    };

                    let profileResult = await userRepo.updateProfile(initialProfile);

                    switch (profileResult) {
                        case (#err(e)) {
                            // Try to delete the canister if profile initialization fails
                            try {
                                await ic.delete_canister({
                                    canister_id = canisterId;
                                });
                            } catch (_) {};
                            return #err("Failed to initialize user profile: " # e);
                        };
                        case (#ok(profile)) {
                            let userInfo : Types.UserRepoCanisterInfo = {
                                canister_id = canisterId;
                                profile = profile;
                            };

                            users.put(userPrincipal, userInfo);
                            Debug.print("User canister created successfully for: " # Principal.toText(userPrincipal));
                            return #ok(userInfo);
                        };
                    };
                } catch (e) {
                    let errorMsg = Error.message(e);
                    Debug.print("Error creating canister: " # errorMsg);
                    return #err("Failed to create user canister: " # errorMsg);
                };
            };
        };
    };

    // Rest of your existing functions...
    public shared (msg) func edit_profile(update : Types.ProfileUpdate) : async Result.Result<Types.Profile, Text> {
        let userPrincipal = msg.caller;

        switch (users.get(userPrincipal)) {
            case (null) {
                return #err("User not found. Please create a canister first.");
            };
            case (?userInfo) {
                try {
                    let userRepo = actor (Principal.toText(userInfo.canister_id)) : actor {
                        updateProfile : shared (Types.ProfileUpdate) -> async Result.Result<Types.Profile, Text>;
                    };

                    let result = await userRepo.updateProfile(update);

                    switch (result) {
                        case (#err(e)) {
                            return #err("Failed to update profile: " # e);
                        };
                        case (#ok(newProfile)) {
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

    public query func show_profile(principal : Principal) : async ?Types.Profile {
        switch (users.get(principal)) {
            case (null) { null };
            case (?userInfo) { ?userInfo.profile };
        };
    };

    public query func get_all_users() : async [Types.Profile] {
        let buffer = Buffer.Buffer<Types.Profile>(users.size());
        for ((_, userInfo) in users.entries()) {
            buffer.add(userInfo.profile);
        };
        Buffer.toArray(buffer);
    };

    public query func get_user_canister(principal : Principal) : async ?Principal {
        switch (users.get(principal)) {
            case (null) { null };
            case (?userInfo) { ?userInfo.canister_id };
        };
    };

    public query func get_user_count() : async Nat {
        users.size();
    };

    // Debug functions
    public query func getUploadedSize() : async Nat {
        var totalSize = 0;
        for ((_, chunk) in wasmChunks.vals()) {
            totalSize += chunk.size();
        };
        totalSize;
    };

    public query func hasUserRepoWasm() : async Bool {
        userRepoWasm != null;
    };

    public query func getWasmSize() : async ?Nat {
        switch (userRepoWasm) {
            case (null) { null };
            case (?wasm) { ?wasm.size() };
        };
    };

    public query func getChunkStatus() : async {
        uploaded : Nat;
        expected : Nat;
    } {
        { uploaded = wasmChunks.size(); expected = expectedChunks };
    };
};
