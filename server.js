/*
MODULE IMPORT
*/
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

const drivelist = require('./drivelist.js');
const driveupload = require('./driveupload.js');


/*
INITIALISATION
*/
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/content/');
app.use(express.static(__dirname + '/content/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

/*
VARIABLES
*/
const url = "http://localhost:8101";
//const url = "https://eternalloneliness.dog";
const maxSizeUpload = 10 * 1024 * 1024;

/*
ROOTER SYSTEM
*/
app.post('/dogy', function(req, res){
  res.send('666open666');
});
app.get('/', function(req, res){
  drivelist.refresh();
  res.render('./index');
});
app.get('/home', function(req, res){
  let eternalloneliness;
  for(let i=0; i<drivelist.repository.childs.length; i++){
    let child = drivelist.repository.childs[i];
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
  for(let i=0; i<drivelist.repository.childs.length; i++){
    let child = drivelist.repository.childs[i];
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
    url: url,
    status: req.query.status || "none",
  });
});
app.post('/upload', function(req, res){
  if(req.files != null){
    let file = req.files.userfile;
    if(file.size > maxSizeUpload){
      res.redirect('/upload?status=toobig');
    }else{
      driveupload.upload(req.files.userfile, req.body.description);
      res.redirect('/upload?status=success');
    }
  }else{
    res.redirect('/upload?status=error');
  }

  res.end();
});
app.post('/uploadstatus', function(req, res){
  res.send(uploadStatus);
});
app.get('*', function(req, res){
  res.redirect('/');
});

app.listen(8101, '0.0.0.0');
