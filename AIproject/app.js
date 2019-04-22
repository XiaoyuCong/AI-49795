const express = require('express');
const app = express();
const http = require('http').createServer(app);
const multiparty = require('multiparty');
const path = require('path');
const exec = require('child_process').exec;
const request = require('request');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('view'));

'use strict';

// Google Cloud Platform project ID and Full path of the JSON file
const projectId = 'propane-flag-230706';
const keyFilename = 'FaceDetection-52a825bf3bf9.json';

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
    projectId: projectId,
    keyFilename: keyFilename
});
const bucket = storage.bucket('emousic_image');


app.post('/uploadImage', function(req,res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    const form = new multiparty.Form();
    form.parse(req,function(err,fields,files){
        console.log(files);
        if (!files['files']){
            return;
        }
        let tmpName = files['files'][0]['path'].split("/").slice(-1)[0];
        bucket.upload(files['files'][0]['path']).then( function v(){
            const imageUrl = `https://storage.googleapis.com/emousic_image/${tmpName}`;
            const subscriptionKey = '169d650d71f343c3b9c3ad7ac157e45a';
            const uriBase = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect';
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
                    'Ocp-Apim-Subscription-Key' : subscriptionKey,
                    'Access-Control-Allow-Origin': '*',
                }
            };

            request.post(options, (error, response, body) => {

                if (error) {
                    console.log('Error:  request error', error);
                    return;
                }
                let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                jsonResponse = JSON.parse(jsonResponse);
                if(typeof(jsonResponse[0]) === 'undefined'){
                    console.log("there is no face detected in the picture");
                    res.send("there is no face detected in the picture");
                }
                else{
                    let anger = jsonResponse[0]["faceAttributes"]["emotion"]["anger"];
                    let contempt = jsonResponse[0]["faceAttributes"]["emotion"]["contempt"];
                    let disgust = jsonResponse[0]["faceAttributes"]["emotion"]["disgust"];
                    let fear = jsonResponse[0]["faceAttributes"]["emotion"]["fear"];
                    let happiness = jsonResponse[0]["faceAttributes"]["emotion"]["happiness"];
                    let neutral = jsonResponse[0]["faceAttributes"]["emotion"]["neutral"];
                    let sadness = jsonResponse[0]["faceAttributes"]["emotion"]["sadness"];
                    let surprise = jsonResponse[0]["faceAttributes"]["emotion"]["surprise"];
                    console.log("prediction of your emotion is:");
                    console.log("anger:" + anger);
                    console.log("contempt:" + contempt);
                    console.log("disgust:" + disgust);
                    console.log("fear:" + fear);
                    console.log("happiness:" + happiness);
                    console.log("neutral:" + neutral);
                    console.log("sadness:" + sadness);
                    console.log("surprise:" + surprise);
                    exec('python emotion2.py ' + anger + ' ' + contempt + ' ' + disgust + ' ' + fear + ' ' + happiness + ' ' + neutral + ' ' + sadness + ' ' + surprise, (error,stdout,stderr)=>{
                        console.log(stdout);
                        let valence = stdout.substring(13, stdout.length - 3);
                        let arousal = stdout.substring(2, 12);
                        console.log("valence: " + valence);
                        console.log("arousal: " + arousal);
                        exec('python getSong.py '+valence+' '+arousal,(error,stdout,stderr)=>{
                            console.log(stdout);
                            //return to front end
                            stdout += "/" + valence + "/" + arousal;
                            res.send(stdout);
                            if(error){
                                console.log('error:' + error);
                            }
                        });
                        if(error){
                            console.log('error:' + error);
                        }
                    });
                }
            });
        });
    });
});




app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+"/view/mainpage.html"));
});

app.get('/takePhoto', (req,res) =>{
    res.sendFile(path.resolve(__dirname+"/view/takePhoto.html"));
});

http.listen(8082,function(){
	console.log("server running on 127.0.0.1:8082");
});