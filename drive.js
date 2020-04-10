module.exports.isLoaded = false;
module.exports.repository = {};

const { google } = require('googleapis');

const credentials = require('./drive/credentials.json');
const token = require('./drive/token.json');
const {client_secret, client_id, redirect_uris} = credentials.installed;

async function catchRepository(){
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  auth.setCredentials(token);
  const drive = google.drive({ version: "v3", auth });

  let res = await drive.files.list({
    pageSize: 1000,
    fields: 'files(id, name, description, parents, webViewLink)',
  });
  let files = res.data.files;
  let repository = generateRepository(files);
  return repository;
}

function generateRepository(files) {
  function Element(id, name, description, url, childs) {
    this.id = id;
    this.name = name;
    this.description = description
    this.url = url;
    this.childs = childs;
  }

  let fileObject = [];
  for(let i = 0; i < files.length; i++) {
    let file = files[i];
    fileObject.push(new Element(file.id, file.name, file.description, file.webViewLink, []));
  }

  let repository = new Element(files[files.length - 1].parents[0], "repository", "main folder", "", []);

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

function refresh(){
  catchRepository().then(function(response){
    module.exports.isLoaded = true;
    module.exports.repository = response;
  });
}
refresh();
module.exports.refresh = refresh;
