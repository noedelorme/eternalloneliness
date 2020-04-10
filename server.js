/*
MODULE IMPORT
*/
const express = require('express');
const ejs = require('ejs');

const drive = require('./drive.js');


/*
INITIALISATION
*/
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/content/');
app.use(express.static(__dirname + '/content/'));


/*
CONSTANTES
*/
const url = "http://localhost:8101/";

/*
ROOTER SYSTEM
*/
app.post('/dogy', function(req, res){
  res.send('666open666');
});
app.get('/', function(req, res){
  drive.refresh();
  res.render('./dog');
});
app.get('/home', function(req, res){
  let eternalloneliness;
  for(let i=0; i<drive.repository.childs.length; i++){
    let child = drive.repository.childs[i];
    if(child.name == "eternalloneliness"){
      eternalloneliness = child;
    }
  }
  res.render('./home', {
    url: url,
    eternalloneliness: eternalloneliness
  });
});
app.get('/files', function(req, res){
  let eternalloneliness;
  for(let i=0; i<drive.repository.childs.length; i++){
    let child = drive.repository.childs[i];
    if(child.name == "eternalloneliness"){
      eternalloneliness = child;
    }
  }
  res.render('./files', {
    url: url,
    eternalloneliness: eternalloneliness,
    moduleID: req.query.module
  });
});
app.get('/upload', function(req, res){
  res.render('./upload', {
    url: url
  });
});
app.get('*', function(req, res){
  res.render('./404');
});

app.listen(8101, '0.0.0.0');
