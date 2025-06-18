import os
import subprocess

CHUNK_SIZE = 1500  # max blob size per dfx call

def call_dfx(method, arg_type, arg):
    result = subprocess.run(
        ["dfx", "canister", "call", "user_directory", method, f"({arg_type} {arg})"],
        capture_output=True,
        text=True
    )
    print(result.stdout)
    if result.stderr:
        print(result.stderr)

def upload_chunks(file_path):
    with open(file_path, "rb") as f:
        chunk_num = 0
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            hex_blob = "blob \"" + chunk.hex() + "\""
            print(f"Uploading chunk {chunk_num}")
            call_dfx("uploadWasmChunk", "", hex_blob)
            chunk_num += 1

    print("Finalizing upload...")
    subprocess.run(["dfx", "canister", "call", "user_directory", "finalizeWasmUpload", "()"])

if __name__ == "__main__":
    wasm_path = ".dfx/local/canisters/user_repo/user_repo.wasm"
    if os.path.exists(wasm_path):
        upload_chunks(wasm_path)
    else:
        print(f"WASM file not found at {wasm_path}")
