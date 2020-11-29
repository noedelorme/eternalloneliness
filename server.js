/*
MODULE IMPORT
*/
const express = require('express');
const session = require('express-session')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

const drivelist = require('./drivelist.js');
const driveupload = require('./driveupload.js');


/*
INITIALISATION
*/
const app = express();
app.use(session({
    secret: 'roses',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/content/');
app.use(express.static(__dirname + '/content/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());


/*
VARIABLES
*/
const maxSizeUpload = 10 * 1024 * 1024;

/*
ROOTER SYSTEM
*/
app.post('/dogy', function(req, res){
  if(req.body.dogy.includes("666open666")){
    req.session.is_connected = true;
    res.send({connected: true, goTo: './home'});
  }
  if(req.body.dogymobile.includes("dggdg")){
    req.session.is_connected = true;
    res.send({connected: true, goTo: './home'});
  }
  res.end();
});
app.get('/', function(req, res){
  drivelist.refresh();
  res.render('./index');
});
app.get('/home', function(req, res){
  if(!req.session.is_connected || drivelist.repository.childs.length<1){
    res.redirect('/');
  }else{
    let eternalloneliness;
    for(let i=0; i<drivelist.repository.childs.length; i++){
      let child = drivelist.repository.childs[i];
      if(child.name == "eternalloneliness"){
        eternalloneliness = child;
      }
    }
    res.render('./home', {
      eternalloneliness: eternalloneliness
    });
  }
});
app.get('/files', function(req, res){
  if(!req.session.is_connected || !req.query.module){
    res.redirect('/');
  }else{
    let eternalloneliness;
    for(let i=0; i<drivelist.repository.childs.length; i++){
      let child = drivelist.repository.childs[i];
      if(child.name == "eternalloneliness"){
        eternalloneliness = child;
      }
    }
    res.render('./files', {
      eternalloneliness: eternalloneliness,
      moduleID: req.query.module
    });
  }
});
app.get('/upload', function(req, res){
  if(!req.session.is_connected){
    res.redirect('/');
  }else{
    res.render('./upload', {
      status: req.query.status || "none",
    });
  }
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
console.log(process.env);
console.log(process.env.PORT);
app.listen(process.env.PORT || 8100, process.env.IP || 'fd00::2:90ed');
