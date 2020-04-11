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
    orderBy: 'folder,name'
  });
  let files = res.data.files;

  function Element(id, name, description, url, childs) {
    this.id = id;
    this.name = name;
    this.description = description
    this.url = url;
    this.childs = childs;
  }
  function reporitorize(element){
    let childs = files.filter(e => e.parents[0] == element.id);
    if(childs.length == 0){
      let file = new Element(element.id, element.name, element.description, element.webViewLink, []);
      return file;
    }else{
      let folder = new Element(element.id, element.name, element.description, element.webViewLink, []);
      for(let i=0; i<childs.length; i++){
        folder.childs.push(reporitorize(childs[i]));
      }
      return folder;
    }
  }
  /*
  let mainFolderId;
  for(let i=0; i<files.length; i++){
    if(files[i].name == "eternalloneliness"){
      mainFolderId = files[i].parents[0];
    }
  }
  */
  let mainFolder = {
    id: "0AHCbZHme9dyTUk9PVA",
    name: "main",
    description: "main",
    parents: [],
    webViewLink: ""
  }
  let repository = reporitorize(mainFolder);
  //console.log(repository.childs);
  return repository;
}


function refresh(){
  catchRepository().then(function(response){
    module.exports.repository = response;
  });
}
refresh();
module.exports.refresh = refresh;
