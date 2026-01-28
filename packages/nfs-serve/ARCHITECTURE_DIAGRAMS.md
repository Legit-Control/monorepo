# Architecture Diagrams (Mermaid)

## 1. High-Level Request Flow

```mermaid
flowchart TD
    Client[Client NFS Request]
    Server[server.ts<br/>handleRecord]

    Client --> Server

    Server -->|Extract XID<br/>Identify Type| Router{RPC<br/>Type?}

    Router -->|NFS| NFSRouter[handleNfsRequest.ts]
    Router -->|MOUNT| MountHandler[Mount Handler]

    NFSRouter -->|Procedure Number| ProcSwitch{Procedure<br/>Number?}

    ProcSwitch -->|0: NULL| NullProc[NULL]
    ProcSwitch -->|1: GETATTR| GetAttr[getAttributes]
    ProcSwitch -->|2: SETATTR| SetAttr[setattr]
    ProcSwitch -->|3: LOOKUP| Lookup[lookup]
    ProcSwitch -->|4: ACCESS| Access[access]
    ProcSwitch -->|5: READLINK| Readlink[readlink]
    ProcSwitch -->|6: READ| Read[read]
    ProcSwitch -->|7: WRITE| Write[write]
    ProcSwitch -->|8: CREATE| Create[create]
    ProcSwitch -->|9: MKDIR| Mkdir[mkdir]
    ProcSwitch -->|10-21| Other[Other Procedures]

    Access -->|xid, socket,<br/>data, handler| AccessImpl[procedures/<br/>access.ts]

    AccessImpl --> Response[RPC Response<br/>to Client]

    style Access fill:#90EE90
    style AccessImpl fill:#87CEEB
    style Client fill:#FFB6C1
```

---

## 2. Three-Phase Pattern (ACCESS Procedure Example)

```mermaid
flowchart TD
    Start([Client Request:<br/>ACCESS Procedure]) --> Decode[PHASE 1: DECODE<br/>procedures/access.ts]

    Decode --> D1[Read file handle<br/>readHandle data]
    Decode --> D2[Parse access mask<br/>data.readUInt32BE]

    D1 --> Execute[PHASE 2: EXECUTE<br/>Call Handler]
    D2 --> Execute

    Execute --> Handler[accessHandler<br/>createAsyncNfsHandler.ts]

    Handler --> H1[Convert handle to path]
    Handler --> H2[Check filesystem access]
    Handler --> H3[Return result object]

    H3 --> ResultCheck{Status<br/>OK?}

    ResultCheck -->|No| Error[sendNfsError]
    ResultCheck -->|Yes| Respond[PHASE 3: RESPOND<br/>Encode & Send]

    Error --> End([Return Error])

    Respond --> R1[Create RPC header]
    Respond --> R2[Pack status buffer]
    Respond --> R3[Pack attributes]
    Respond --> R4[Pack access rights]
    Respond --> R5[Concatenate buffers]
    Respond --> R6[socket.write reply]

    R6 --> End2([Send Response])

    style Decode fill:#FFE4B5
    style Execute fill:#90EE90
    style Respond fill:#87CEEB
    style Handler fill:#DDA0DD
```

---

## 3. Component Architecture

```mermaid
graph TB
    subgraph "Network Layer"
        Socket[net.Socket]
    end

    subgraph "Protocol Layer - procedures/*.ts"
        Access[access.ts]
        Read[read.ts]
        Write[write.ts]
        Lookup[lookup.ts]
        Create[create.ts]
        OtherProc[... 17 more procedures]
    end

    subgraph "Business Logic Layer - createAsyncNfsHandler.ts"
        AccessH[access handler]
        ReadH[read handler]
        WriteH[write handler]
        LookupH[lookup handler]
        CreateH[create handler]
        OtherHandlers[... 17 more handlers]
    end

    subgraph "Filesystem Layer"
        FileHandleMgr[FileHandleManager]
        AsyncFs[fs.promises]
    end

    subgraph "Storage"
        Disk[File System]
    end

    Socket --> Access
    Socket --> Read
    Socket --> Write
    Socket --> Lookup
    Socket --> Create
    Socket --> OtherProc

    Access -->|injects| AccessH
    Read -->|injects| ReadH
    Write -->|injects| WriteH
    Lookup -->|injects| LookupH
    Create -->|injects| CreateH
    OtherProc -->|injects| OtherHandlers

    AccessH --> FileHandleMgr
    ReadH --> FileHandleMgr
    WriteH --> FileHandleMgr
    LookupH --> FileHandleMgr
    CreateH --> FileHandleMgr
    OtherHandlers --> FileHandleMgr

    FileHandleMgr --> AsyncFs
    AccessH --> AsyncFs
    ReadH --> AsyncFs
    WriteH --> AsyncFs
    LookupH --> AsyncFs
    CreateH --> AsyncFs
    OtherHandlers --> AsyncFs

    AsyncFs --> Disk

    style Access fill:#87CEEB
    style AccessH fill:#90EE90
    style FileHandleMgr fill:#FFB6C1
    style AsyncFs fill:#DDA0DD
```

---

## 4. Sequence Diagram: ACCESS Procedure

```mermaid
sequenceDiagram
    participant C as Client
    participant S as server.ts<br/>handleRecord
    participant R as handleNfsRequest.ts
    participant P as procedures/access.ts
    participant H as createAsyncNfsHandler.ts<br/>(access handler)
    participant F as File System

    C->>S: TCP Request<br/>(ACCESS procedure)
    S->>S: Extract XID
    S->>R: Route to NFS handler

    R->>R: procedure = 4 (ACCESS)
    R->>P: await access(xid, socket, data, handler)

    Note over P: PHASE 1: DECODE
    P->>P: readHandle(data)
    P->>P: data.readUInt32BE(offset)
    P->>P: Extract handle and access mask

    Note over P: PHASE 2: EXECUTE
    P->>H: accessHandler(handle, requestedAccess)

    H->>H: getPathFromHandle(handle)
    H->>F: fs.promises.access(path)
    F-->>H: Access result
    H->>F: fs.promises.stat(path)
    F-->>H: File attributes
    H-->>P: AccessResult

    Note over P: PHASE 3: RESPOND
    P->>P: Create success header
    P->>P: Pack status buffer
    P->>P: Pack attributes buffer
    P->>P: Pack access rights buffer
    P->>P: Buffer.concat all
    P->>P: createRpcReply(xid, replyBuf)

    P->>C: socket.write(reply)

    Note over C: Client receives response
```

---

## 5. Buffer Encoding/Decoding Flow

```mermaid
flowchart LR
    subgraph "Request Decoding"
        RBuf[Request Buffer<br/>Raw Bytes]
        RHandle[File Handle<br/>Variable Length]
        RAccess[Access Mask<br/>4 Bytes]

        RBuf --> RHandle
        RHandle --> RAccess
    end

    subgraph "Handler Execution"
        HParams[Extracted<br/>Parameters]
        HResult[Result<br/>Object]

        HParams --> HResult
    end

    subgraph "Response Encoding"
        RHeader[RPC Header<br/>Fixed]
        RStatus[Status<br/>4 Bytes]
        RAttrs[Attributes<br/>Variable]
        RData[Access Rights<br/>4 Bytes]

        RHeader --> RStatus
        RStatus --> RAttrs
        RAttrs --> RData
    end

    RAccess --> HParams
    HResult --> RHeader

    style RBuf fill:#FFB6C1
    style HResult fill:#90EE90
    style RData fill:#87CEEB
```

---

## 6. Error Handling Flow

```mermaid
flowchart TD
    Start([Procedure Called]) --> Decode[Decode Request]

    Decode --> DecodeErr{Decode<br/>Error?}
    DecodeErr -->|Yes| SendErr1[sendNfsError<br/>ERR_INVAL]
    DecodeErr -->|No| Execute[Call Handler]

    Execute --> HandlerErr{Handler<br/>Error?}
    HandlerErr -->|Yes| CheckType{Error<br/>Type?}
    HandlerErr -->|No| CheckStatus{Result<br/>Status?}

    CheckType -->|ENOENT| SendErr2[sendNfsError<br/>ERR_NOENT]
    CheckType -->|EACCES| SendErr3[sendNfsError<br/>ERR_ACCES]
    CheckType -->|IO| SendErr4[sendNfsError<br/>ERR_IO]

    CheckStatus -->|Not OK| SendErr5[sendNfsError<br/>result.status]
    CheckStatus -->|OK| Encode[Encode Response]

    SendErr1 --> End([Return Error])
    SendErr2 --> End
    SendErr3 --> End
    SendErr4 --> End
    SendErr5 --> End

    Encode --> EncodeErr{Encode<br/>Error?}
    EncodeErr -->|Yes| SendErr6[sendNfsError<br/>ERR_SERVERFAULT]
    EncodeErr -->|No| Send[socket.write]

    SendErr6 --> End
    Send --> End2([Return Success])

    style SendErr1 fill:#FFB6C1
    style SendErr2 fill:#FFB6C1
    style SendErr3 fill:#FFB6C1
    style SendErr4 fill:#FFB6C1
    style SendErr5 fill:#FFB6C1
    style SendErr6 fill:#FFB6C1
    style Send fill:#90EE90
```

---

## 7. Data Flow: Handle to Path

```mermaid
flowchart LR
    subgraph "Client Side"
        CHandle[File Handle<br/>Opaque Identifier]
    end

    subgraph "Server Side - Procedure"
        PHandle[Buffer Handle<br/>From Request]
    end

    subgraph "Server Side - Handler"
        FHMgr[FileHandleManager]
        FHMappings[Handle → Path<br/>Mappings]
    end

    subgraph "Filesystem"
        Path[File Path<br/>/path/to/file]
        FS[fs.promises<br/>Operations]
    end

    CHandle -->|XDR encoded| PHandle
    PHandle --> FHMgr
    FHMappings --> FHMgr
    FHMgr --> Path
    Path --> FS

    style PHandle fill:#87CEEB
    style FHMgr fill:#90EE90
    style FS fill:#DDA0DD
```

---

## 8. Type System Flow

```mermaid
classDiagram
    class AccessHandler {
        <<type>>
        (handle: Buffer, access: number) => Promise~AccessResult~
    }

    class AccessResult {
        <<discriminated union>>
        OK: { status: 0, access: number, statsAfter: Stats }
        Error: { status: number, access?: never }
    }

    class AccessFunction {
        <<procedure>>
        access(xid, socket, data, handler)
    }

    class CreateAsyncNfsHandler {
        <<factory>>
        createAsyncNfsHandler(options)
    }

    class HandlerImplementation {
        async access(handle, requestedAccess) {
            const path = getPathFromHandle(handle)
            await fs.access(path, requestedAccess)
            return { status: OK, access: ... }
        }
    }

    AccessFunction --> AccessHandler : uses
    AccessHandler --> AccessResult : returns
    CreateAsyncNfsHandler --> HandlerImplementation : creates
    HandlerImplementation ..|> AccessHandler : implements
```

---

## 9. Complete ACCESS Procedure Flow (Detailed)

```mermaid
flowchart TD
    Start([Client: ACCESS Request]) --> Extract[Extract XID and Type]

    Extract --> Route{Is NFS<br/>Request?}

    Route -->|No| Mount[Handle MOUNT]
    Route -->|Yes| GetProc[Get Procedure Number]

    GetProc --> Switch{Procedure<br/>Number?}

    Switch -->|4| AccessProc[Call access function]
    Switch -->|Other| Other[Other Procedures]

    AccessProc --> Decode1[readHandle data]
    Decode1 --> Decode2[data.readUInt32BE<br/>get access mask]
    Decode2 --> CallHandler[await accessHandler<br/>handle, access]

    CallHandler --> HandleImpl[createAsyncNfsHandler.ts<br/>access implementation]

    HandleImpl --> GetPath[getPathFromHandle handle]
    GetPath --> FsAccess[fs.promises.access path]
    FsAccess --> FsStat[fs.promises.stat path]
    FsStat --> Return[return AccessResult]

    Return --> CheckStatus{result.status<br/>== OK?}

    CheckStatus -->|No| SendError[sendNfsError]
    CheckStatus -->|Yes| CreateHeader[createSuccessHeader]

    CreateHeader --> PackStatus[statusBuf<br/>writeUInt32BE 0]
    PackStatus --> PackAttrs[getAttributeBuffer<br/>result.statsAfter]
    PackAttrs --> PackAccess[accessRightsBuf<br/>writeUInt32BE access]
    PackAccess --> Concat[Buffer.concat all buffers]
    Concat --> RpcReply[createRpcReply xid, replyBuf]
    RpcReply --> Send[socket.write reply]

    Send --> Done([Response Sent])
    SendError --> Done

    style AccessProc fill:#87CEEB
    style HandleImpl fill:#90EE90
    style CheckStatus fill:#FFE4B5
    style Send fill:#DDA0DD
```
