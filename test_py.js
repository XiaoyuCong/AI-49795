var exec = require('child_process').exec;
var picture_valence = 0.1;
var picture_arsoual = 0.5;
exec('python getSong.py ' + picture_valence + ' ' + picture_arsoual, (error,stdout,stderr)=>{
    console.log(stdout);
    if(error){
        console.log('error:' + error);
    }
});
