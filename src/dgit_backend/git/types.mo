module {
  // Represents the kind of entry in a tree (directory)
  public type EntryKind = {
    #Blob; // File
    #Tree; // Subdirectory
  };

  // Represents the author of a commit
  public type Author = {
    name : Text;
    email : Text;
  };
}