# NFS v3 Server Test Plan

This document outlines a comprehensive testing strategy for the NFS v3 server implementation to ensure reliability, performance, and RFC 1813 compliance.

## Overview

The test suite covers all 22 NFS v3 procedures, real-world usage patterns, edge cases, and performance scenarios. Tests are organized into multiple categories from basic unit tests to complex integration tests using containerized NFS clients.

## Testing Approach

### Hybrid Testing Strategy

1. **Unit Tests (80%)** - Fast feedback during development
   - Individual procedure testing
   - Mocked file system operations using `memfs`
   - Protocol compliance verification

2. **Container Integration Tests (20%)** - Real-world validation
   - Complete workflow testing
   - Real Linux NFS client interactions
   - Multi-client scenarios

## Test Categories

### 📁 Basic File Operations

#### File Creation & Deletion (CREATE Procedure)
- [ ] Create empty file
- [ ] Create file with initial data
- [ ] Create file in subdirectory
- [ ] Create file with long names (>255 chars)
- [ ] Create file with special characters
- [ ] Create file in read-only directory (should fail)
- [ ] Duplicate file creation (should fail)

#### File Reading & Writing (READ/WRITE Procedures)
- [ ] Read entire file
- [ ] Read file with offset
- [ ] Read partial file (specific byte count)
- [ ] Read beyond file EOF
- [ ] Write entire file
- [ ] Write with offset
- [ ] Append to file
- [ ] Write beyond EOF (should extend file)
- [ ] Zero-byte write
- [ ] Large file writes (>1MB)

#### File Copy Operations
- [ ] Copy within same directory
- [ ] Copy between directories
- [ ] Copy over existing file (overwrite)
- [ ] Copy file with preserve attributes
- [ ] Copy file to different name in same directory
- [ ] Recursive directory copy
- [ ] Copy large files (>10MB)
- [ ] Copy many small files (performance test)

### 🔄 File Modification Operations

#### File Renaming (RENAME Procedure)
- [ ] Simple rename (same directory)
- [ ] Move between directories
- [ ] Rename to existing name (overwrite)
- [ ] Rename non-existent file (should fail)
- [ ] Rename open file handles
- [ ] Rename with special characters
- [ ] Rename directory with files
- [ ] Batch rename operations

#### File Attributes (SETATTR/GETATTR Procedures)
- [ ] Change file permissions
- [ ] Change file ownership (if supported)
- [ ] Change file timestamps (mtime, atime)
- [ ] Set file size (truncate)
- [ ] Change file mode bits
- [ ] Get file attributes (size, permissions, timestamps)
- [ ] Verify attributes persist after unmount/remount

### 💾 Transaction & Consistency Tests

#### Partial Writes & Commits (WRITE + COMMIT Procedures)
- [ ] Partial write (write 1000 bytes at offset 500)
- [ ] Multiple partial writes to same file
- [ ] Write without commit (verify unstable)
- [ ] Commit after multiple writes
- [ ] Commit while other process reading
- [ ] Unstable write verification
- [ ] Crash recovery scenarios

#### Uncommitted File Reads
- [ ] Read file during write operation
- [ ] Read uncommitted changes from another client
- [ ] Verify dirty cache behavior
- [ ] Multiple clients writing same file
- [ ] Read verification after commit
- [ ] Stale read detection

### 📂 Directory Operations

#### Directory Management (MKDIR/RMDIR Procedures)
- [ ] Create empty directory
- [ ] Create nested directories
- [ ] Remove empty directory
- [ ] Remove directory with files (should fail)
- [ ] Create directory with long names
- [ ] Remove directory with subdirectories
- [ ] Directory permission changes

#### Directory Listing (READDIR/READDIRPLUS Procedures)
- [ ] List empty directory
- [ ] List directory with files
- [ ] List directory with subdirectories
- [ ] List directory with mixed content
- [ ] Directory listing with attributes
- [ ] Large directory listing (1000+ files)
- [ ] Directory listing during file operations

### 🔗 Advanced File Operations

#### Symbolic Links (SYMLINK/READLINK Procedures)
- [ ] Create symbolic link to file
- [ ] Create symbolic link to directory
- [ ] Create absolute symbolic link
- [ ] Create relative symbolic link
- [ ] Read symbolic link target
- [ ] Follow symbolic link in operations
- [ ] Broken symbolic link handling
- [ ] Circular symbolic link detection

#### Hard Links (LINK Procedure)
- [ ] Create hard link to file
- [ ] Create multiple hard links
- [ ] Delete original file (link should remain)
- [ ] Hard link to directory (should fail)
- [ ] Hard link with different owners
- [ ] Cross-device hard link (should fail)

### 🛡️ Error Handling & Edge Cases

#### Permission & Access (ACCESS Procedure)
- [ ] Check read permissions
- [ ] Check write permissions
- [ ] Check execute permissions
- [ ] Access non-existent file
- [ ] Access with invalid credentials
- [ ] Permission denied scenarios

#### Invalid Operations
- [ ] Invalid file handles
- [ ] Stale file handle usage
- [ ] Invalid offsets/sizes
- [ ] Buffer overflow attempts
- [ ] Malformed RPC packets
- [ ] Network interruption handling

### ⚡ Concurrency & Performance

#### Multi-Client Scenarios
- [ ] Multiple clients reading same file
- [ ] Multiple clients writing different files
- [ ] Multiple clients writing same file
- [ ] Concurrent directory operations
- [ ] Race condition testing
- [ ] Lock behavior verification

#### Performance Benchmarks
- [ ] Large file sequential read/write
- [ ] Random access patterns
- [ ] Small file creation/deletion
- [ ] Directory listing performance
- [ ] Network latency handling
- [ ] Throughput measurement

### 🔄 State & Persistence

#### Mount/Unmount Cycles (Mount Protocol)
- [ ] Mount and unmount repeatedly
- [ ] Mount with different options
- [ ] Mount during active operations
- [ ] File persistence across unmount
- [ ] Attribute preservation
- [ ] Stale handle cleanup

#### Crash Recovery
- [ ] Server restart during operations
- [ ] Network interruption recovery
- [ ] Partial operation recovery
- [ ] File system corruption handling
- [ ] Journal consistency (if implemented)

### 🧪 Container-Specific Integration Tests

#### Real NFS Client Operations
- [ ] `cp` commands across NFS mount
- [ ] `mv` operations
- [ ] `rsync` synchronization
- [ ] `tar` extraction to NFS
- [ ] Application-specific file operations
- [ ] Database file operations on NFS
- [ ] Media file streaming

## Implementation Phases

### Phase 1: Unit Tests (Priority: High)
- Focus on individual NFS procedures
- Use `memfs` for file system mocking
- Quick feedback for development
- Covers basic functionality

### Phase 2: Integration Tests (Priority: Medium)
- Test complete workflows
- Multiple procedure interactions
- State management verification
- Error propagation testing

### Phase 3: Container Tests (Priority: Medium)
- Real Linux NFS client testing
- Multi-client scenarios
- Performance benchmarking
- Production-like conditions

### Phase 4: Edge Cases (Priority: Low)
- Malformed input handling
- Resource exhaustion scenarios
- Security boundary testing
- Extreme performance cases

## Test Tools & Dependencies

### Current Dependencies
- **Vitest** - Test runner (already configured)
- **memfs** - In-memory file system for mocking
- **@stellar/js-xdr** - XDR encoding/decoding verification

### Additional Dependencies Needed
- **testcontainers** - Container management for integration tests
- **Docker** - Container runtime for client testing

### Test Data Requirements
- Various file sizes (bytes to MB)
- Different file content types (binary, text)
- Directory structures of varying depths
- Special character filenames
- Large numbers of files for performance testing

## Success Criteria

### Functional Requirements
- [ ] All 22 NFS v3 procedures working correctly
- [ ] RFC 1813 compliance
- [ ] Compatible with standard Linux/macOS NFS clients
- [ ] Proper error handling and recovery

### Performance Requirements
- [ ] File read/write performance within acceptable limits
- [ ] Concurrent client support
- [ ] Memory usage within reasonable bounds
- [ ] Network efficiency optimization

### Reliability Requirements
- [ ] Data consistency across operations
- [ ] Proper cleanup of resources
- [ ] Graceful handling of network issues
- [ ] No memory leaks or resource exhaustion

## Maintenance

### Test Maintenance
- Regular test suite updates as features evolve
- Performance baseline updates
- New NFS client compatibility testing
- Security vulnerability scanning

### Documentation Updates
- Test results documentation
- Performance benchmark tracking
- Known limitations documentation
- Troubleshooting guides

---

**Note:** This test plan should be used as a guide for implementing a comprehensive test suite. Prioritization may be adjusted based on project needs and available resources.