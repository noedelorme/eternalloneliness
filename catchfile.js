const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = './drive/token.json';

fs.readFile('./drive/credentials.json', (err, content) => {
  if(err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listFiles);
});

function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if(err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if(err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if(err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}



let rep;

function listFiles(auth) {
  const drive = google.drive({
    version: 'v3',
    auth
  });
  drive.files.list({
    pageSize: 1000,
    fields: 'nextPageToken, files(id, name, parents, webViewLink)',
  }, (err, res) => {
    if(err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if(files.length) {

      rep = generateRepository(files);
      console.log(rep);

    } else {
      console.log('No files found.');
    }
  });
  //console.log(rep);
}

function generateRepository(files) {
  function Element(id, name, url, childs) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.childs = childs;
  }

  let fileObject = [];
  for(let i = 0; i < files.length; i++) {
    let file = files[i];
    fileObject.push(new Element(file.id, file.name, file.webViewLink, []));
  }

  let repository = new Element(files[files.length - 1].parents[0], "repository", "", []);

  for(let i = 0; i < files.length; i++) {
    for(let j = 0; j < files.length; j++) {
      if(files[j].parents[0] == files[i].id) {
        let child = fileObject[j];
        let parent = fileObject[i];
        parent.childs.push(child);
      }
    }
    if(files[i].parents[0] == repository.id) {
      repository.childs.push(fileObject[i]);
    }
  }
  return repository;
}

/*
function generateTree(files){
  let tree = [];
  let filesReversed = files.reverse();

  function searchParent(parentId, filePath){
    for(var j=0; j<filesReversed.length; j++){
      if(parentId == filesReversed[j].id){
        filePath.unshift(filesReversed[j]);
        if(filesReversed[j].name != "eternalloneliness"){
          return searchParent(filesReversed[j].parents[0], filePath);
        }else{
          return filePath;
        }
      }
    }
  }

  for(let i=1; i<filesReversed.length; i++){
    let currentFile = filesReversed[i];
    tree.push(searchParent(currentFile.parents[0], [currentFile]));
  }

  return tree;
}
*/
