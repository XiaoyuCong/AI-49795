const express = require('express');
const app = express();
const http = require('http').createServer(app);
const multiparty = require('multiparty');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var exec = require('child_process').exec;

const request = require('request');




'use strict';


    const projectId = 'propane-flag-230706'; // Your Google Cloud Platform project ID
    const keyFilename = 'FaceDetection-52a825bf3bf9.json'; //Full path of the JSON file

    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage({
        projectId: projectId,
        keyFilename: keyFilename
    });
    const bucket = storage.bucket('emousic_image');

    var tmpName;



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
        tmpName = files['files'][0]['path'].split("/").slice(-1)[0];
        console.log("tmpName： " + tmpName);
        bucket.upload(files['files'][0]['path']).then( function v(){
            const imageUrl = `https://storage.googleapis.com/emousic_image/${tmpName}`;
            //console.log(imageUrl);
            const subscriptionKey = '4455ad2e5936444da9341bbbfd1e594d';

            const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

            //const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';
            //const imageUrl = 'https://storage.googleapis.com/emousic_image/tqVLDY5ViY4M4Xi5SprXESXt.jpg';


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
                    console.log('Error:  request error', error);
                    return;
                }
                //console.log(response);
                let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                jsonResponse = JSON.parse(jsonResponse);

                //
                // let exec = require('child_process').exec;
                // console.log(jsonResponse);
                // console.log()
                // console.log(jsonResponse[0]);
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
                // exec('python emotion.py ' + anger + ' ' + contempt + ' ' + )
                exec('python emotion.py ' + anger + ' ' + contempt + ' '+disgust+' '+fear+' '+happiness+' '+neutral+' '+sadness+' '+surprise, (error,stdout,stderr)=>{
                    console.log(stdout);

                    var result = stdout;
                    var valence = stdout.substring(stdout.indexOf(" ")+1, stdout.length - 3);
                    var arsoual = stdout.substring(2, stdout.indexOf(" "));
                    //console.log(stdout.substring(2, stdout.indexOf(" ")));
                    //console.log(stdout.substring(stdout.indexOf(" ")+1, stdout.length - 3));
                    exec('python getSong.py '+valence+' '+arsoual,(error,stdout,stderr)=>{
                        console.log(stdout);
                        if(error){
                            console.log('error:' + error);
                        }
                    })
                    if(error){
                        console.log('error:' + error);
                    }
                });
                // $.ajax({
                //     type: "POST",
                //     url: "~/pythoncode.py",
                //     data: {
                //         anger: anger,
                //         contempt: contempt,
                //         disgust: disgust,
                //         fear: fear,
                //         happiness: happiness,
                //         neutral: neutral,
                //         sadness: sadness,
                //         surprise: surprise
                //     }
                // }).done(function (av) {
                //     // do something
                //     console.log(av);
                // });

        });
        }




        );
        // noinspection JSAnnotator
        // var waitTill = new Date(new Date().getTime() + 10 * 1000);
        // while(waitTill > new Date()){}




    });



});




app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname+"/view/index.html"));
});

http.listen(8082,function(){
	console.log("server running on 127.0.0.1:8082");
});