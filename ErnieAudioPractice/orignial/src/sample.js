'use strict';

var audioData = require('./audioAssets');


exports.handler = function(event, context){
  try{
    var request = event.request;
    var session = event.session;

    if(!event.session.attributes){
      event.session.attributes = {};
    }

    if(request.type === "LaunchRequest"){
        handleLaunchRequest(context);
    }
    else if(request.type === "IntentRequest"){

      if(request.intent.name === "JamIntent"){
        handleJamIntent(request, context, session);
      }
      // else if(request.intent.name === "AMAZON.YesIntent"){
      //   create a new intent?
      //   handleJamIntent();
      // }
      else if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent"){
          context.succeed(buildResponse({
            speechText: "Good bye",
            endSession: true
          }));
      }
      else {
        throw "Unknown Intent";
      }
    }
  } catch(e){
      context.fail("Exception: " + e);
  }
};


function buildResponse(options){
  return {
        "response": {
            "directives": [
                {
                    "type": "AudioPlayer.Play",
                    "playBehavior": "REPLACE_ALL",
                    "audioItem": {
                        "stream": {
                            "token": "12345",
                            "url": "https://emit-media-production.s3.amazonaws.com/pbs/the-afterglow/2016/08/24/1700/201608241700_the-afterglow_64.m4a",
                            "offsetInMilliseconds": 0
                        }
                    }
                }
            ],
            "shouldEndSession": "True"
        }
    };
}


function handleLaunchRequest(context){
  let options = {};
  options.speechText = "Welcome to Ernie Ball. What genre do you want to play and in what key? ";
  options.repromptText = "You can say for example, say ask Ernie Ball to play blues in the key of a. ";
  options.endSession = false;
  context.succeed(buildResponse(options));
}


function handleJamIntent(request, context, session){
  let options = {};
  options.directives = [];
  var genre = request.intent.slots.Genre.value;
  var key = request.intent.slots.Key.value;
  var index = session.attributes.index;
  if(!genre){
    genre = audioData.genres[Math.floor(Math.random() * audioData.genres.length)];
  }
  if(!key){
    key = audioData.keys[Math.floor(Math.random() * audioData.keys.length)];
  }
  if(!session.attributes.index){
    index = Math.floor(Math.random() * audioData[genre][key].length);
  }

  key = key.toUpperCase();
  let song = audioData[genre][key][index];

  let audioObject = {
    "playBehavior": "REPLACE_ALL",
    "audioItem": {
      "stream": {
        "type": "AudioPlayer.Play",
        "token": "0",
        "url": song.url,
        "offsetInMilliseconds": 0
      }
    }
  };

  //come back to this. need condition to check for
  //length of array
  session.attributes.index += 1;

  options.speechText = `Here is ${song.title}`;
  options.directives.push(audioObject);
  options.endSession = true;
  context.succeed(buildResponse(options));
}
