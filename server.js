/*
NATIVE REQUIRE
*/
const express = require('express');
const ejs = require('ejs');


/*
INITIALISATION
*/
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/content/');
app.use(express.static(__dirname + '/content/'));

/*
ROOTER SYSTEM
*/
app.get('/', function(req, res){
  res.render('./index');
});
app.post('/dogy', function(req, res){
  res.send('666open666');
});
app.get('/home', function(req, res){
  res.render('./home', {
    test : 'ceci est une variable'
  });
});
app.get('*', function(req, res){
  res.render('./404');
});

app.listen(8101, '0.0.0.0');
