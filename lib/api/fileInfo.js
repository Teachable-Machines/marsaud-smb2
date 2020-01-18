var SMB2Forge = require('../tools/smb2-forge');
var SMB2Request = SMB2Forge.request;

/*
 * readFile
 * ========
 *
 * read the content of a file from the share
 *
 *  - open the file
 *
 *  - read the content
 *
 *  - close the file
 *
 */
module.exports = function fileInfo(filename, options, cb) {
  var connection = this;

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  SMB2Request('query_info', { path: filename }, connection, function(err, file) {
    if (err) cb && cb(err);
    // SMB2 read file content
    else  cb( null, file)


  });
};
