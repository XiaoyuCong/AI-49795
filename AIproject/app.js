const express = require('express');
const app = express();
const http = require('http').createServer(app);
const multiparty = require('multiparty');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const request = require('request');

'use strict';


    const projectId = 'propane-flag-230706'; // Your Google Cloud Platform project ID
    const keyFilename = 'FaceDetection-52a825bf3bf9.json'; //Full path of the JSON file

    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage({keyFilename, projectId});
    const bucket = storage.bucket('emousic_image');




app.post('/uploadImage', function(req,res){
    
    res.json({"music1":"song1"});

    
    const form = new multiparty.Form();
    form.parse(req,function(err,fields,files){
        // console.log(fields);
        // console.log(files);
        // console.log(files['files'][0]['originalFilename']);
        // const fileName = path.basename(files['files'][0]['originalFilename']);
        // console.log(fileName);
        // const file = bucket.file(fileName);
        // console.log('file:' + file);
        bucket.upload(files['files'][0]['path']).then();
        const tmpName = files['files'][0]['path'].split("/").slice(-1)[0];

        const imageUrl = `https://storage.googleapis.com/emousic_image/${tmpName}`;
        console.log(imageUrl);
        const subscriptionKey = 'd56a4c64612f411eaebddccb1038fccd';

        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

        // const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';

// Request parameters.
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'emotion'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + imageUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };

        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('JSON Response\n');
            console.log(jsonResponse);
            
        });

    });






});

app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+"/view/index.html"));
});

http.listen(8082,function(){
	console.log("server running on 127.0.0.1:8082");
})