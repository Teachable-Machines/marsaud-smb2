var SMB2Message = require('../tools/smb2-message');
var message = require('../tools/message');

module.exports = message({
  generate: function(connection, params) {
    return new SMB2Message({
      headers: {
        Command: 'QUERY_INFO',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        FileId: params.FileId,
        Buffer: Buffer.from('*', 'ucs2'),
      },
    });
  },

  parseResponse: function(response) {
    return parseFile(response.getResponse().Buffer);
  },
});

function parseFile(buffer) {
  var file = {};
  var offset = 0;

  // index
  file.Index = buffer.readUInt32LE(offset);
  offset += 4;

  // CreationTime
  file.CreationTime = buffer.slice(offset, offset + 8);
  offset += 8;

  // LastAccessTime
  file.LastAccessTime = buffer.slice(offset, offset + 8);
  offset += 8;

  // LastWriteTime
  file.LastWriteTime = buffer.slice(offset, offset + 8);
  offset += 8;

  // ChangeTime
  file.ChangeTime = buffer.slice(offset, offset + 8);
  offset += 8;

  // EndofFile
  file.EndofFile = buffer.slice(offset, offset + 8);
  offset += 8;

  // AllocationSize
  file.AllocationSize = buffer.slice(offset, offset + 8);
  offset += 8;

  // FileAttributes
  file.FileAttributes = buffer.readUInt32LE(offset);
  offset += 4;

  // FilenameLength
  file.FilenameLength = buffer.readUInt32LE(offset);
  offset += 4;

  // EASize
  file.EASize = buffer.readUInt32LE(offset);
  offset += 4;

  // ShortNameLength
  file.ShortNameLength = buffer.readUInt8(offset);
  offset += 1;

  // FileId
  file.FileId = buffer.slice(offset, offset + 8);
  offset += 8;

  // Reserved
  offset += 27;

  // Filename
  file.Filename = buffer
    .slice(offset, offset + file.FilenameLength)
    .toString('ucs2');
  offset += file.FilenameLength;

  return file;
}
