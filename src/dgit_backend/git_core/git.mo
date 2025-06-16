import Types "../shared/Types";
import Utils "../shared/Utils";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";

module {
    // In-memory storage for Git objects
    public class GitStore() {
        // Storage for different Git objects
        private let commits = HashMap.HashMap<Text, Types.Commit>(10, Text.equal, Text.hash);
        private let trees = HashMap.HashMap<Text, Types.Tree>(10, Text.equal, Text.hash);
        private let blobs = HashMap.HashMap<Text, Blob>(10, Text.equal, Text.hash);

        // Store a blob and return its hash
        public func storeBlob(content : Blob) : Text {
            let hash = Utils.generateHash(content);
            blobs.put(hash, content);
            hash;
        };

        // Create and store a tree
        public func createTree(entries : [Types.TreeEntry]) : Text {
            let tree : Types.Tree = {
                id = ""; // Temporary value
                entries = entries;
            };

            // Create a blob representation of the tree to hash it
            let treeBlob = Text.encodeUtf8(createTreeString(tree));
            let hash = Utils.generateHash(treeBlob);

            // Update the ID and store the tree
            let finalTree : Types.Tree = {
                id = hash;
                entries = entries;
            };

            trees.put(hash, finalTree);
            hash;
        };

        // Helper to create a string representation of a tree
        private func createTreeString(tree : Types.Tree) : Text {
            var result = "";
            for (entry in tree.entries.vals()) {
                result #= entry.mode # " " # entry.name # " " # entry.hash # "\n";
            };
            result;
        };

        // Create and store a commit
        public func createCommit(
            tree : Text,
            parent : ?[Text],
            author : Text,
            message : Text,
        ) : Text {
            let timestamp = Utils.timeNow();
            let commit : Types.Commit = {
                id = ""; // Temporary
                tree = tree;
                parent = parent;
                author = author;
                committer = author; // For simplicity, author = committer
                message = message;
                timestamp = timestamp;
            };

            // Create a string representation and hash it
            let commitStr = createCommitString(commit);
            let commitBlob = Text.encodeUtf8(commitStr);
            let hash = Utils.generateHash(commitBlob);

            // Update with final ID and store
            let finalCommit : Types.Commit = {
                id = hash;
                tree = tree;
                parent = parent;
                author = author;
                committer = author;
                message = message;
                timestamp = timestamp;
            };

            commits.put(hash, finalCommit);
            hash;
        };

        private func createCommitString(commit : Types.Commit) : Text {
            var result = "tree " # commit.tree # "\n";

            switch (commit.parent) {
                case (null) {};
                case (?parents) {
                    for (parent in parents.vals()) {
                        result #= "parent " # parent # "\n";
                    };
                };
            };

            result #= "author " # commit.author # " " # Int.toText(commit.timestamp) # "\n";
            result #= "committer " # commit.committer # " " # Int.toText(commit.timestamp) # "\n";
            result #= "\n" # commit.message;

            result;
        };

        // Getters
        public func getCommit(hash : Text) : ?Types.Commit {
            commits.get(hash);
        };

        public func getTree(hash : Text) : ?Types.Tree {
            trees.get(hash);
        };

        public func getBlob(hash : Text) : ?Blob {
            blobs.get(hash);
        };
    };
};
