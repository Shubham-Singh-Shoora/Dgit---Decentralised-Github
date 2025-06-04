import id "../utils/id";
import time "../utils/time";
import types "./types";
import Array "mo:base/Array";

module {
  // Commit data structure, similar to a Git commit object.
  public type Commit = {
    id : id.Id;
    createdAt : time.Timestamp;
    tree : id.Id; // The tree this commit points to (root directory snapshot)
    parents : [id.Id]; // Parent commit IDs (empty for first commit)
    author : types.Author;
    message : Text;
  };

  // Create a new commit
  public func createCommit(tree : id.Id, parents : [id.Id], author : types.Author, message : Text) : Commit {
    // First, convert text to IDs
    let messageId = id.textToId(message);
    let nameId = id.textToId(author.name);
    let emailId = id.textToId(author.email);

    // Create separate arrays and then concatenate the byte arrays
    let treeBytes = id.concatIds([tree]);
    let parentBytes = id.concatIds(parents);
    let messageBytes = id.concatIds([messageId]);
    let authorBytes = id.concatIds([nameId, emailId]);

    // Combine all bytes for the final content
    let allIdsBytes = Array.append(
      Array.append(treeBytes, parentBytes),
      Array.append(messageBytes, authorBytes),
    );

    // Generate commit ID
    let commitId = id.generateId(allIdsBytes);
    let now = time.now();

    {
      id = commitId;
      createdAt = now;
      tree = tree;
      parents = parents;
      author = author;
      message = message;
    };
  };

  // Get commit id
  public func getCommitId(commit : Commit) : id.Id {
    commit.id;
  };

  // Get commit creation time
  public func getCommitTime(commit : Commit) : time.Timestamp {
    commit.createdAt;
  };

  // Get commit's tree id
  public func getCommitTree(commit : Commit) : id.Id {
    commit.tree;
  };

  // Get commit's parent ids
  public func getCommitParents(commit : Commit) : [id.Id] {
    commit.parents;
  };

  // Get commit's author
  public func getCommitAuthor(commit : Commit) : types.Author {
    commit.author;
  };

  // Get commit's message
  public func getCommitMessage(commit : Commit) : Text {
    commit.message;
  };
};
