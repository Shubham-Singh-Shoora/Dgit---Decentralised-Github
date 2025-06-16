module {
    public type ProfileUpdate = {
        username : ?Text;
        bio : ?Text;
        avatar_url : ?Text;
    };

    public type Profile = {
        username : Text;
        bio : Text;
        avatar_url : Text;
        joined : Int;
        principal_id : Text;
    };

    public type UserRepoCanisterInfo = {
        canister_id : Principal;
        profile : Profile;
    };

    // Git object types
    public type Commit = {
        id : Text; // SHA-1 hash
        tree : Text;
        parent : ?[Text];
        author : Text;
        committer : Text;
        message : Text;
        timestamp : Int;
    };

    public type Tree = {
        id : Text; // SHA-1 hash
        entries : [TreeEntry];
    };

    public type TreeEntry = {
        name : Text;
        hash : Text;
        kind : { #blob; #tree };
        mode : Text; // File permissions
    };

    public type Blob = {
        id : Text; // SHA-1 hash
        content : Blob;
    };

    public type Repository = {
        name : Text;
        description : Text;
        head : Text; // Default branch reference
        branches : [(Text, Text)]; // Branch name to commit hash
        created_at : Int;
        updated_at : Int;
    };
};
