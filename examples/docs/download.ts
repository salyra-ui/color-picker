/** Small ZIP writer for source downloads. Files are stored without compression. */
export function sourceArchive(
  files: readonly { name: string; code: string }[],
): Uint8Array {
  const encoder = new TextEncoder(),
    chunks: Uint8Array[] = [],
    directory: Uint8Array[] = [];
  let offset = 0;
  const crc32 = (data: Uint8Array) => {
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++)
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  for (const file of files) {
    const name = encoder.encode(file.name),
      data = encoder.encode(file.code),
      crc = crc32(data);
    const local = new Uint8Array(30 + name.length),
      l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true);
    l.setUint16(4, 20, true);
    l.setUint16(6, 0x800, true);
    l.setUint32(14, crc, true);
    l.setUint32(18, data.length, true);
    l.setUint32(22, data.length, true);
    l.setUint16(26, name.length, true);
    local.set(name, 30);
    chunks.push(local, data);
    const central = new Uint8Array(46 + name.length),
      c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x800, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true);
    c.setUint32(24, data.length, true);
    c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.set(name, 46);
    directory.push(central);
    offset += local.length + data.length;
  }
  const size = directory.reduce((n, c) => n + c.length, 0),
    end = new Uint8Array(22),
    e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, size, true);
  e.setUint32(16, offset, true);
  const result = new Uint8Array(offset + size + end.length);
  let cursor = 0;
  for (const chunk of [...chunks, ...directory, end]) {
    result.set(chunk, cursor);
    cursor += chunk.length;
  }
  return result;
}
export function downloadSources(
  files: readonly { name: string; code: string }[],
  name: string,
) {
  const bytes = sourceArchive(files),
    url = URL.createObjectURL(
      new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/zip' }),
    );
  const a = document.createElement('a');
  a.href = url;
  a.download = name + '.zip';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
