#!/usr/bin/env bash
set -euo pipefail

# Fail with a message
fail() {
    echo "❌ ERROR: $1"
    exit 1
}

# Require argument
if [[ $# -ne 1 ]]; then
    echo "Usage: $0 <path-to-nfs-directory>"
    exit 1
fi

BASE="$1"
TESTDIR="$BASE/test"

echo "🔍 Testing NFS path: $BASE"

# ---------------------------------------------------------
# 0. Validate base path exists and is writable
# ---------------------------------------------------------
[[ -d "$BASE" ]] || fail "Base path '$BASE' does not exist."
[[ -w "$BASE" ]] || fail "Base path '$BASE' is not writable."

# ---------------------------------------------------------
# 1. Remove old test directory if exists
# ---------------------------------------------------------
if [[ -d "$TESTDIR" ]]; then
    echo "🧹 Removing existing test directory '$TESTDIR'..."
    rm -rf "$TESTDIR" || fail "Could not remove old test directory."
fi

# ---------------------------------------------------------
# 2. Create test directory
# ---------------------------------------------------------
echo "📁 Creating new test directory '$TESTDIR'..."
mkdir "$TESTDIR" || fail "Failed to create test directory."

# ---------------------------------------------------------
# 3. Create a test file
# ---------------------------------------------------------
FILE="$TESTDIR/file1.txt"
echo "📝 Creating test file '$FILE'..."
echo "Hello NFS" > "$FILE" || fail "Failed to write initial file."

# ---------------------------------------------------------
# 4. Rename file
# ---------------------------------------------------------
RENAMED="$TESTDIR/file_renamed.txt"
echo "🔁 Renaming file1.txt → file_renamed.txt..."
mv "$FILE" "$RENAMED" || fail "Rename failed."

# ---------------------------------------------------------
# 5. Truncate file
# ---------------------------------------------------------
echo "✂️ Truncating file_renamed.txt to 0 bytes..."
: > "$RENAMED" || fail "Truncate failed."
[[ ! -s "$RENAMED" ]] || fail "File still has non-zero size after truncation."

# ---------------------------------------------------------
# 6. Append content using cat
# ---------------------------------------------------------
echo "📥 Appending text using cat..."
echo "Some new content" | cat >> "$RENAMED" || fail "cat append failed."

grep -q "Some new content" "$RENAMED" || fail "Content not found after append."

# ---------------------------------------------------------
# 7. Create subdirectory
# ---------------------------------------------------------
SUBDIR="$TESTDIR/sub"
echo "📁 Creating subdirectory '$SUBDIR'..."
mkdir "$SUBDIR" || fail "Failed to create subdirectory."

# ---------------------------------------------------------
# 8. Move file to subdirectory
# ---------------------------------------------------------
echo "📦 Moving file to subdirectory..."
mv "$RENAMED" "$SUBDIR/" || fail "Move to subdirectory failed."

# ---------------------------------------------------------
# 9. Remove file
# ---------------------------------------------------------
echo "🗑 Removing file in subdirectory..."
rm "$SUBDIR/file_renamed.txt" || fail "File deletion failed."

# ---------------------------------------------------------
# 10. Cleanup: remove test directory
# ---------------------------------------------------------
echo "🧹 Removing test directory..."
rm -rf "$TESTDIR" || fail "Cleanup failed."

# ---------------------------------------------------------
echo "🎉 SUCCESS: All NFS tests completed successfully."
exit 0