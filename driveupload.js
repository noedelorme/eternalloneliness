module.exports.repository = {};

const fs = require('fs');
const { google } = require('googleapis');
const streamifier = require('streamifier');

const credentials = require('./config.json').drivecredentials;
const token = require('./config.json').drivetoken;
const {client_secret, client_id, redirect_uris} = credentials.installed;

async function upload(file, description){
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  auth.setCredentials(token);
  const drive = google.drive({ version: "v3", auth });

  let fileName = file.name;
  let fileMimeType = file.mimetype;
  let fileBody = file.data;

  var fileMetadata = {
    'name': fileName,
    description: description,
    parents: ['1w6O0ZvMYvrEyVbG5RZS4soDh1FFZnJ1C']
  };
  var media = {
    mimeType: fileMimeType,
    body: streamifier.createReadStream(fileBody)
  };

  let res = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      console.error(err);
    } else {
      //console.log('File uploaded : ', fileName);
    }
  });
}

module.exports.upload = upload;
