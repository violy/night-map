var express = require('express');
var app = express(),
    APP_PORT = 8080;

app.use('/',express.static('public'));
app.use('/json',express.static('json'));

app.listen(APP_PORT,function(){
    console.log('now listening http://localhost:'+APP_PORT)
});