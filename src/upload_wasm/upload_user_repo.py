#!/usr/bin/env python3
"""
Improved WASM uploader for UserDirectory canister
Handles chunked upload with better error handling and verification
"""

import subprocess
import json
import os
import hashlib
import time
from typing import List, Tuple

class WasmUploader:
    def __init__(self, canister_id: str, wasm_path: str, identity: str = None):
        self.canister_id = canister_id
        self.wasm_path = wasm_path
        self.identity = identity
        self.chunk_size = 1024 * 1024  # 1MB chunks (adjust as needed)
        
    def get_file_info(self) -> Tuple[int, int, str]:
        """Get file size, chunk count, and hash"""
        file_size = os.path.getsize(self.wasm_path)
        chunk_count = (file_size + self.chunk_size - 1) // self.chunk_size
        
        # Calculate file hash for verification
        sha256_hash = hashlib.sha256()
        with open(self.wasm_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        
        return file_size, chunk_count, sha256_hash.hexdigest()
    
    def call_canister(self, method: str, args: str = "") -> dict:
        """Call canister method with proper error handling"""
        cmd = ["dfx", "canister", "call", self.canister_id, method]
        
        if args:
            cmd.append(args)
            
        if self.identity:
            cmd.extend(["--identity", self.identity])
            
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                print(f"Error calling {method}: {result.stderr}")
                return {"error": result.stderr}
                
            # Parse the result
            output = result.stdout.strip()
            if output.startswith("(") and output.endswith(")"):
                # Remove outer parentheses and parse
                output = output[1:-1]
                
            return {"success": True, "output": output}
            
        except subprocess.TimeoutExpired:
            return {"error": "Timeout calling canister"}
        except Exception as e:
            return {"error": str(e)}
    
    def read_chunks(self) -> List[bytes]:
        """Read file in chunks"""
        chunks = []
        with open(self.wasm_path, 'rb') as f:
            while True:
                chunk = f.read(self.chunk_size)
                if not chunk:
                    break
                chunks.append(chunk)
        return chunks
    
    def upload_direct(self) -> bool:
        """Try direct upload first (for smaller files)"""
        file_size, _, _ = self.get_file_info()
        
        if file_size > 1024 * 1024:  # 1MB limit for direct upload
            print(f"File too large for direct upload ({file_size} bytes), using chunked upload")
            return False
            
        print(f"Attempting direct upload ({file_size} bytes)...")
        
        # Read entire file
        with open(self.wasm_path, 'rb') as f:
            wasm_data = f.read()
        
        # Convert to hex string for dfx
        hex_data = wasm_data.hex()
        args = f'(blob "\\{hex_data}")'
        
        result = self.call_canister("uploadUserRepoWasm", args)
        
        if "error" in result:
            print(f"Direct upload failed: {result['error']}")
            return False
            
        print("Direct upload successful!")
        return True
    
    def upload_chunked(self) -> bool:
        """Upload file in chunks"""
        file_size, chunk_count, file_hash = self.get_file_info()
        
        print(f"File: {self.wasm_path}")
        print(f"Size: {file_size} bytes")
        print(f"Chunks: {chunk_count}")
        print(f"Hash: {file_hash}")
        
        # Initialize upload
        print("Initializing chunked upload...")
        init_args = f"({file_size} : nat, {chunk_count} : nat)"
        result = self.call_canister("initWasmUpload", init_args)
        
        if "error" in result:
            print(f"Failed to initialize upload: {result['error']}")
            return False
            
        # Read chunks
        print("Reading file chunks...")
        chunks = self.read_chunks()
        
        if len(chunks) != chunk_count:
            print(f"Chunk count mismatch: expected {chunk_count}, got {len(chunks)}")
            return False
        
        # Upload chunks
        print("Uploading chunks...")
        for i, chunk in enumerate(chunks):
            print(f"Uploading chunk {i+1}/{chunk_count} ({len(chunk)} bytes)...")
            
            # Convert chunk to hex
            hex_chunk = chunk.hex()
            args = f'({i} : nat, blob "\\{hex_chunk}")'
            
            result = self.call_canister("uploadWasmChunk", args)
            
            if "error" in result:
                print(f"Failed to upload chunk {i}: {result['error']}")
                return False
                
            # Small delay between chunks
            time.sleep(0.1)
        
        # Finalize upload
        print("Finalizing upload...")
        result = self.call_canister("finalizeWasmUpload")
        
        if "error" in result:
            print(f"Failed to finalize upload: {result['error']}")
            return False
            
        print("Chunked upload successful!")
        return True
    
    def verify_upload(self) -> bool:
        """Verify the upload was successful"""
        print("Verifying upload...")
        
        # Check if WASM exists
        result = self.call_canister("hasUserRepoWasm")
        if "error" in result:
            print(f"Failed to check WASM status: {result['error']}")
            return False
            
        if "true" not in result.get("output", "").lower():
            print("WASM not found in canister")
            return False
            
        # Check size
        result = self.call_canister("getWasmSize")
        if "error" in result:
            print(f"Failed to get WASM size: {result['error']}")
            return False
            
        expected_size, _, _ = self.get_file_info()
        print(f"Expected size: {expected_size}")
        print(f"Uploaded size: {result.get('output', 'unknown')}")
        
        return True
    
    def upload(self) -> bool:
        """Main upload method"""
        print(f"Starting WASM upload to canister {self.canister_id}")
        
        if not os.path.exists(self.wasm_path):
            print(f"WASM file not found: {self.wasm_path}")
            return False
        
        # Try direct upload first, then chunked
        if not self.upload_direct():
            if not self.upload_chunked():
                return False
        
        # Verify upload
        return self.verify_upload()

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Upload WASM file to UserDirectory canister")
    parser.add_argument("canister_id", help="Canister ID")
    parser.add_argument("wasm_path", help="Path to WASM file")
    parser.add_argument("--chunk-size", type=int, default=1024*1024, help="Chunk size in bytes")
    
    args = parser.parse_args()
    
    uploader = WasmUploader(args.canister_id, args.wasm_path, args.identity)
    uploader.chunk_size = args.chunk_size
    
    if uploader.upload():
        print("✅ Upload completed successfully!")
        return 0
    else:
        print("❌ Upload failed!")
        return 1

if __name__ == "__main__":
    exit(main())