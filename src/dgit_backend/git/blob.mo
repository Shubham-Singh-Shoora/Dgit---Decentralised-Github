import id "../utils/id";
import time "../utils/time";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";

module {
  // Blob data structure, similar to a Git blob.
  public type Blob = {
    id : id.Id;
    createdAt : time.Timestamp;
    content : BlobContent;
  };

  public type BlobContent = [Nat8]; // Raw file content as bytes
  public type BlobContentSize = [Nat32]; // Size of the blob content in bytes

  public func createBlob(content : BlobContent) : Blob {
    Debug.print("Creating blob with content length: " # Nat32.toText(Nat32.fromNat(Array.size(content))));
    let blobId = id.generateId(content);
    Debug.print("Blob ID = " # Nat32.toText(blobId));

    let now = time.now();
    {
      id = blobId;
      createdAt = now;
      content = content;
    };
  };

  // Get blob id
  public func getBlobId(blob : Blob) : id.Id {
    blob.id;
  };

  // Get blob creation time
  public func getBlobTime(blob : Blob) : time.Timestamp {
    blob.createdAt;
  };

  // Get blob content
  public func getBlobContent(blob : Blob) : BlobContent {
    blob.content;
  };
};
