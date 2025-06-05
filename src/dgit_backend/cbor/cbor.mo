import BlobModule "../git/blob";
import CommitModule "../git/commit";
import RefModule "../git/ref";
import TreeModule "../git/tree";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";

// Minimal CBOR helpers for simple types and structures
module {

    // ----------- Basic CBOR helpers (very minimal) ------------

    // Encode Nat as CBOR (major type 0, up to 16-bit for demo)
    func encodeNat(n : Nat) : [Nat8] {
        if (n < 24) return [Nat8.fromNat(n)];
        if (n <= 0xff) return [24, Nat8.fromNat(n)];
        if (n <= 0xffff) return [25, Nat8.fromNat(n >> 8), Nat8.fromNat(n & 0xff)];
        assert false;
        [];
    };

    // Decode (for demo, only 0..23, 24, 25)
    func decodeNat(bytes : [Nat8], pos : Nat) : (Nat, Nat) {
        let hd = bytes[pos];
        if (hd < 24) return (Nat8.toNat(hd), pos + 1);
        if (hd == 24) return (Nat8.toNat(bytes[pos + 1]), pos + 2);
        if (hd == 25) return ((Nat8.toNat(bytes[pos + 1]) << 8 | Nat8.toNat(bytes[pos + 2])), pos + 3);
        (0, pos);
    };

    // Encode Text as CBOR (major type 3, short strings)
    func encodeText(t : Text) : [Nat8] {
        let arr = Text.encodeUtf8(t);
        let len = arr.size();
        assert len < 24; // Only support short strings for demo
        [0x60 + Nat8.fromNat(len)] # arr;
    };

    func decodeText(bytes : [Nat8], pos : Nat) : (Text, Nat) {
        let hd = bytes[pos];
        if (hd >= 0x60 and hd < 0x78) {
            let len = hd - 0x60;
            let arr = Array.slice<Nat8>(bytes, pos + 1, pos + 1 + len);
            let txt = Text.decodeUtf8(arr);
            (txt, pos + 1 + len);
        } else { ("", pos) };
    };

    // Encode [Nat8] as CBOR bytes (type 2, short blobs)
    func encodeByteBlob(b : [Nat8]) : [Nat8] {
        let len = b.size();
        assert len < 24; // Only support short blobs for demo
        [0x40 + Nat8.fromNat(len)] # b;
    };

    func decodeByteBlob(bytes : [Nat8], pos : Nat) : ([Nat8], Nat) {
        let hd = bytes[pos];
        if (hd >= 0x40 and hd < 0x58) {
            let len = hd - 0x40;
            let arr = Array.slice<Nat8>(bytes, pos + 1, pos + 1 + len);
            (arr, pos + 1 + len);
        } else { ([], pos) };
    };

    // Encode array of [Nat8] (array of CBOR objects)
    func encodeArray(arr : [[Nat8]]) : [Nat8] {
        let len = arr.size();
        assert len < 24; // Only support short arrays for demo
        var out = [0x80 + Nat8.fromNat(len)];
        for (elem in arr.vals()) out := out # elem;
        out;
    };

    func decodeArrayLen(bytes : [Nat8], pos : Nat) : (Nat, Nat) {
        let hd = bytes[pos];
        if (hd >= 0x80 and hd < 0x98) {
            let len = hd - 0x80;
            (len, pos + 1);
        } else { (0, pos) };
    };

    // ----------- Blob -----------
    public func encodeBlobObject(blob : BlobModule.Blob) : [Nat8] {
        encodeByteBlob(blob.content);
    };

    public func decodeBlobObject(bytes : [Nat8]) : BlobModule.Blob {
        let (content, _) = decodeByteBlob(bytes, 0);
        BlobModule.Blob({ content = content });
    };

    // ----------- Commit -----------
    public func encodeCommitObject(commit : CommitModule.Commit) : [Nat8] {
        // CBOR array: [tree, parents, author, message]
        encodeArray([
            encodeNat(Nat32.toNat(commit.tree)),
            encodeArray(Array.map<Nat32, [Nat8]>(commit.parents, func(p) { encodeNat(Nat32.toNat(p)) })),
            encodeArray([
                encodeText(commit.author.name),
                encodeText(commit.author.email),
                encodeNat(Nat32.toNat(commit.author.timestamp)),
            ]),
            encodeText(commit.message),
        ]);
    };

    public func decodeCommitObject(bytes : [Nat8]) : CommitModule.Commit {
        var pos = 0;
        let (_, p0) = decodeArrayLen(bytes, pos);
        pos := p0;
        // tree
        let (treeNat, p1) = decodeNat(bytes, pos);
        pos := p1;
        // parents
        let (parentsLen, p2) = decodeArrayLen(bytes, pos);
        pos := p2;
        var parents : [Nat32] = [];
        var i = 0;
        while (i < parentsLen) {
            let (parentNat, pn) = decodeNat(bytes, pos);
            parents := Array.append<Nat32>(parents, [Nat32.fromNat(parentNat)]);
            pos := pn;
            i += 1;
        };
        // author
        let (authorArrLen, p3) = decodeArrayLen(bytes, pos);
        pos := p3;
        let (authorName, p4) = decodeText(bytes, pos);
        pos := p4;
        let (authorEmail, p5) = decodeText(bytes, pos);
        pos := p5;
        let (authorTS, p6) = decodeNat(bytes, pos);
        pos := p6;
        // message
        let (msg, _) = decodeText(bytes, pos);
        CommitModule.Commit({
            tree = Nat32.fromNat(treeNat);
            parents = parents;
            author = {
                name = authorName;
                email = authorEmail;
                timestamp = Nat32.fromNat(authorTS);
            };
            message = msg;
        });
    };

    // ----------- Tree -----------
    public func encodeTreeObject(tree : TreeModule.Tree) : [Nat8] {
        // For demo, just encode the number of entries (expand for real data)
        encodeArray([
            encodeNat(tree.entries.size())
            // Expand for all entry content as needed
        ]);
    };

    public func decodeTreeObject(bytes : [Nat8]) : TreeModule.Tree {
        var pos = 0;
        let (_, p0) = decodeArrayLen(bytes, pos);
        pos := p0;
        let (nEntries, _) = decodeNat(bytes, pos);
        // Not decoding entries for demo
        TreeModule.Tree({
            entries = Array.init<TreeModule.TreeEntry>(nEntries, func _ = TreeModule.TreeEntry({ name = ""; mode = 0; object = 0; obj_type = #Blob }));
        });
    };

    // ----------- Ref -----------
    public func encodeRefObject(ref : RefModule.Ref) : [Nat8] {
        encodeArray([
            encodeText(ref.name),
            encodeNat(Nat32.toNat(ref.target)),
            encodeText(RefModule.refTypeToText(ref.refType)),
        ]);
    };

    public func decodeRefObject(bytes : [Nat8]) : RefModule.Ref {
        var pos = 0;
        let (_, p0) = decodeArrayLen(bytes, pos);
        pos := p0;
        let (name, p1) = decodeText(bytes, pos);
        pos := p1;
        let (targetNat, p2) = decodeNat(bytes, pos);
        pos := p2;
        let (refTypeText, _) = decodeText(bytes, pos);
        RefModule.Ref({
            name = name;
            target = Nat32.fromNat(targetNat);
            refType = RefModule.textToRefType(refTypeText);
        });
    };

};
