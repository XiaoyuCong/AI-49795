var express = require('express');
var app = express();
var http = require('http').createServer(app);
var multiparty = require('multiparty');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/uploadImage', function(req,res){
    console.log("aaa");
    var form = new multiparty.Form();
    form.parse(req,function(err,fields,files){
        console.log(fields);
        console.log(files);
    })
    
})
app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+"/view/index.html"));
})
http.listen(8082,function(){
	console.log("server running on 127.0.0.1:8082");
}) 