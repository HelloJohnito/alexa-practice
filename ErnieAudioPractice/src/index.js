'use strict';

exports.handler = function(event, context){

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
      handleJamIntent(request, context);
    }
  }
};

function handleLaunchRequest(context){

}

function handleJamIntent(request, context){

}
