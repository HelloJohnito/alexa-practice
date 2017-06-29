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
      else if(request.intent.name === "AMAZON.NextIntent"){
        handleJamIntent(request, context, session);
      }
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
  var response = {
    version: "1.0",
    response: {
      directives: [
        {
          "type": "AudioPlayer.Play",
          "playBehavior": "REPLACE_ALL",
          "audioItem": {
              "stream": {
                  "token": "0",
                  "url": options.songUrl,
                  "offsetInMilliseconds": 0
              }
          }
        }
      ],
      shouldEndSession: options.endSession
    }
  };

  if(options.speechText){
    response.response.outputSpeech = {
      type: "SSML",
      ssml: "<speak>" + options.speechText + "</speak>"
    };
  }

  if(options.repromptText){
    response.response.reprompt = {
      outputSpeech: {
        type: "SSML",
        ssml: "<speak>" + options.reprompText + "</speak>"
      }
    };
  }

  if(options.cardTitle){
    response.response.card = {
      type: "Simple",
      title: options.cardTitle
    };

    if(options.imageUrl){
      response.response.card.type = "Standard";
      response.response.card.content = options.cardContent;
      response.response.card.image = {
        smallImageUrl: options.imageUrl,
        largeImageUrl: options.imageUrl
      };
    }
    else {
      response.response.card.content = options.cardContent;
    }
  }

  if(options.session && options.session.attributes){
    response.sessionAttributes = options.session.attributes;
  }

  return response;
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

  //come back to this. need condition to check for
  //length of array
  session.attributes.index += 1;

  options.speechText = `Here is ${song.title}`;
  options.songUrl = song.url;
  options.endSession = true;
  context.succeed(buildResponse(options));
}

// for next have session that has the key and the genre. Then use that. 
