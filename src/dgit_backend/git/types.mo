module {
    public type Hash = Text;
    public type Timestamp = Int;
    public type Path = Text;

    public type BlobId = Text;
    public type TreeId = Text;
    public type CommitId = Text;
    public type RefName = Text;

    public type AuthorInfo = {
        name: Text;
        email: Text;
        timestamp: Timestamp;
    };

    public type Permission = {
        #owner;
        #collaborator;
        #viewer;
    };

    public type User = {
        principal: Principal;
        username: Text;
    };

    public type Visibility = {
        #Public;
        #Private;
    };

    public type RepoMeta = {
        id: Text;
        name: Text;
        owner: Principal;
        collaborators: [Principal];
        visibility: Visibility;
        created: Timestamp;
        updated: Timestamp;
    };
}
