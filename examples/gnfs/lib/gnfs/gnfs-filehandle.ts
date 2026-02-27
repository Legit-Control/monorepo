export class AsyncGnfsFileHandle {
  constructor(
    public path: string,
    private originFs: AsyncGnfs
  ) {}

  // FileHandle methods needed by createAsyncNfsHandler
  async stat(): Promise<fsDisk.Stats> {
    return this.originFs.stat(this.path);
  }

  async close(): Promise<void> {
    this.originFs.closeFileHandle(this);
  }

  async read(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number | null = null // NOTE null is not behaving a standard node, where a file has a current position that is used when position is null, here we just treat null as 0
  ): Promise<{ bytesRead: number; buffer: Buffer }> {
    const fileContent = await this.originFs.getFile(this.path);

    if (fileContent === null) {
      throw new Error('File not found: ' + this.path);
    }

    if (fileContent === undefined) {
      // its a directory, not a file
      throw new Error('Not a file: ' + this.path);
    }

    const contentBuffer = Buffer.from(fileContent, 'utf8');
    const bytesToRead = Math.min(
      length,
      contentBuffer.length - (position ?? 0)
    );
    contentBuffer.copy(
      buffer,
      offset,
      position ?? 0,
      (position ?? 0) + bytesToRead
    );

    return { bytesRead: bytesToRead, buffer };
  }

  async write(
    buffer: Buffer,
    offset: number = 0,
    length: number = buffer.length,
    position: number = 0
  ): Promise<{ bytesWritten: number }> {
    const fileContent = await this.originFs.getFile(this.path);

    if (fileContent === null) {
      throw new Error('File not found: ' + this.path);
    }

    if (fileContent === undefined) {
      // its a directory, not a file
      throw new Error('Not a file: ' + this.path);
    }

    // for now we load the whole file content, apply the changes and write the whole file back
    // later we want to send range patches

    let contentBuffer = Buffer.from(fileContent, 'utf8');

    const targetBufferSize = Math.max(contentBuffer.length, position + length);
    if (contentBuffer.length < targetBufferSize) {
      // need to grow the buffer
      const newBuffer = Buffer.alloc(targetBufferSize);
      contentBuffer.copy(newBuffer, 0, 0, contentBuffer.length);
      buffer.copy(newBuffer, offset, position, length);
      contentBuffer = newBuffer;
    } else {
      buffer.copy(contentBuffer, position, offset, offset + length);
    }

    this.originFs.putFile(this.path, contentBuffer.toString('utf8'));
    return { bytesWritten: length };
  }

  async sync(): Promise<void> {
    console.warn('nooop');
  }

  async chmod(mode: number): Promise<void> {
    throw new Error('Method not implemented: chmod');
  }

  async truncate(len: number): Promise<void> {
    if (len > 0) {
      const content = await this.read(Buffer.alloc(len), 0, len, 0);

      this.originFs.putFile(this.path, content.buffer.toString('utf8'));
    } else {
      this.originFs.putFile(this.path, '');
    }
  }

  async utimes(atime: Date, mtime: Date): Promise<void> {
    await this.originFs.utimes(this.path, atime, mtime);
  }
}
