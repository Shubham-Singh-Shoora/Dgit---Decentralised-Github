import id "../utils/id";
import time "../utils/time";

module {
  // Blob data structure, similar to a Git blob.
  public type Blob = {
    id : id.Id;
    createdAt : time.Timestamp;
    content : BlobContent;
  };

  public type BlobContent = [Nat8]; // Raw file content as bytes

  // Create a new blob from file content
  public func createBlob(content : BlobContent) : Blob {
    let blobId = id.generateId(content);
    let now = time.now();
    {
      id = blobId;
      createdAt = now;
      content = content;
    }
  };

  // Get blob id
  public func getBlobId(blob : Blob) : id.Id {
    blob.id
  };

  // Get blob creation time
  public func getBlobTime(blob : Blob) : time.Timestamp {
    blob.createdAt
  };

  // Get blob content
  public func getBlobContent(blob : Blob) : BlobContent {
    blob.content
  };
}