import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";

actor AuthCanister {

    // ======== User Data Structure ========
    public type UserProfile = {
        id: Principal;             // Internet Identity Principal
        username: Text;            // User's chosen username
        email: Text;               // User's email
        country: Text;             // User's country/region
        emailPreferences: Bool;    // Marketing preferences
        createdAt: Int;            // Timestamp when account was created
        lastLogin: Int;            // Timestamp of last login
    };

    // ======== Error Types ========
    public type AuthError = {
        #UsernameTaken;
        #EmailTaken;
        #UserAlreadyExists;
        #UserNotFound;
        #InvalidCredentials;
        #NotAuthorized;
        #InvalidInput: Text;
    };

    // ======== Result Types ========
    public type AuthResult<T> = Result.Result<T, AuthError>;

    // ======== Stable Data Structures ========
    // Using stable variables for data persistence across canister upgrades
    private stable var userProfilesEntries : [(Principal, UserProfile)] = [];
    private stable var usernamesEntries : [(Text, Principal)] = [];
    private stable var emailsEntries : [(Text, Principal)] = [];

    // ======== In-Memory Maps ========
    private var userProfiles = Map.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);
    private var usernames = Map.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    private var emails = Map.HashMap<Text, Principal>(10, Text.equal, Text.hash);

    // Initialize the maps with any stored data (on canister start/upgrade)
    system func preupgrade() {
        userProfilesEntries := Iter.toArray(userProfiles.entries());
        usernamesEntries := Iter.toArray(usernames.entries());
        emailsEntries := Iter.toArray(emails.entries());
    };

    system func postupgrade() {
        for ((principal, profile) in userProfilesEntries.vals()) {
            userProfiles.put(principal, profile);
        };
        for ((username, principal) in usernamesEntries.vals()) {
            usernames.put(username, principal);
        };
        for ((email, principal) in emailsEntries.vals()) {
            emails.put(email, principal);
        };
        
        // Clear stable variables to free memory
        userProfilesEntries := [];
        usernamesEntries := [];
        emailsEntries := [];
    };

    // ======== Authentication Methods ========

    // Sign up a new user with Internet Identity
    public shared(msg) func signUp(
        username: Text,
        email: Text,
        country: Text,
        emailPreferences: Bool
    ): async AuthResult<UserProfile> {
        let caller = msg.caller;

        // Input validation
        if (Principal.isAnonymous(caller)) {
            return #err(#NotAuthorized);
        };

        if (username.size() < 3) {
            return #err(#InvalidInput("Username must be at least 3 characters"));
        };

        if (email.size() < 5 or not Text.contains(email, #text "@")) {
            return #err(#InvalidInput("Invalid email format"));
        };

        // Check if user already exists
        switch (userProfiles.get(caller)) {
            case (?_) { return #err(#UserAlreadyExists); };
            case null { /* Continue with signup */ };
        };

        // Check if username is taken
        switch (usernames.get(username)) {
            case (?_) { return #err(#UsernameTaken); };
            case null { /* Username is available */ };
        };

        // Check if email is taken
        switch (emails.get(email)) {
            case (?_) { return #err(#EmailTaken); };
            case null { /* Email is available */ };
        };

        // Create user profile
        let currentTime = Time.now();
        let newProfile : UserProfile = {
            id = caller;
            username = username;
            email = email;
            country = country;
            emailPreferences = emailPreferences;
            createdAt = currentTime;
            lastLogin = currentTime;
        };

        // Store user data
        userProfiles.put(caller, newProfile);
        usernames.put(username, caller);
        emails.put(email, caller);

        return #ok(newProfile);
    };

    // Sign in a user using Internet Identity
    public shared(msg) func signIn() : async AuthResult<UserProfile> {
        let caller = msg.caller;

        if (Principal.isAnonymous(caller)) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(caller)) {
            case (null) { 
                return #err(#UserNotFound); 
            };
            case (?profile) {
                // Update last login time
                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    email = profile.email;
                    country = profile.country;
                    emailPreferences = profile.emailPreferences;
                    createdAt = profile.createdAt;
                    lastLogin = Time.now();
                };
                
                userProfiles.put(caller, updatedProfile);
                return #ok(updatedProfile);
            };
        };
    };

    // Get the current user's profile
    public shared query(msg) func getMyProfile() : async AuthResult<UserProfile> {
        let caller = msg.caller;

        if (Principal.isAnonymous(caller)) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(caller)) {
            case (null) { return #err(#UserNotFound); };
            case (?profile) { return #ok(profile); };
        };
    };

    // Check if a username is available
    public query func isUsernameAvailable(username: Text) : async Bool {
        return Option.isNull(usernames.get(username));
    };

    // Check if an email is available
    public query func isEmailAvailable(email: Text) : async Bool {
        return Option.isNull(emails.get(email));
    };

    // Update user profile
    public shared(msg) func updateProfile(
        email: ?Text,
        country: ?Text,
        emailPreferences: ?Bool
    ) : async AuthResult<UserProfile> {
        let caller = msg.caller;

        if (Principal.isAnonymous(caller)) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(caller)) {
            case (null) { 
                return #err(#UserNotFound); 
            };
            case (?profile) {
                // Validate new email if provided
                switch (email) {
                    case (?newEmail) {
                        if (newEmail.size() < 5 or not Text.contains(newEmail, #text "@")) {
                            return #err(#InvalidInput("Invalid email format"));
                        };

                        // Check if the new email is taken by someone else
                        switch (emails.get(newEmail)) {
                            case (?existingUser) {
                                if (not Principal.equal(existingUser, caller)) {
                                    return #err(#EmailTaken);
                                };
                            };
                            case (null) { 
                                // Remove old email mapping
                                emails.delete(profile.email);
                                // Add new email mapping
                                emails.put(newEmail, caller);
                            };
                        };
                    };
                    case (null) { /* Keep existing email */ };
                };

                // Create updated profile
                let updatedProfile : UserProfile = {
                    id = profile.id;
                    username = profile.username;
                    email = Option.get(email, profile.email);
                    country = Option.get(country, profile.country);
                    emailPreferences = Option.get(emailPreferences, profile.emailPreferences);
                    createdAt = profile.createdAt;
                    lastLogin = profile.lastLogin;
                };

                userProfiles.put(caller, updatedProfile);
                return #ok(updatedProfile);
            };
        };
    };

    // Admin function to get total user count
    public query func getUserCount() : async Nat {
        return userProfiles.size();
    };
}