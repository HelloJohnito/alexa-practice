'use strict';

var http = require('http');

exports.handler = function(event, context){
  try{
    var request = event.request;
    var session = event.session;

    if(!event.session.attributes){
      event.session.attributes = {};
    }

    /*
      i)   LaunchRequest
      ii)  IntentRequest
      iii) SessionEndedRequst
    */

    if(request.type === "LaunchRequest"){
      handleLaunchRequest(context);

    }
    else if(request.type === "IntentRequest"){

      if(request.intent.name === "HelloIntent"){
        handleHelloIntent(request, context);
      }
      else {
        throw "Unknown Intent";
      }
    }
    else if(request.type === "SessionEndedRequst"){
    }
    else {
      throw "Unknown Intent Type";
    }
  } catch(e){
    context.fail("Exception: " + e);
  }
};


/////////////////////////
  /// Functions ///////
/////////////////////////

//Uses Quotes API to grab quotes
function getQuote(callback){
  var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json";

  var req = http.get(url, function(res){
    var body = "";

    res.on("data", function(chunk){
      body += chunk;
    });

    res.on("end", function(){
      body = body.replace(/\\/g, "");
      var quote = JSON.parse(body);
      callback(quote.quoteText);
    });
  });

  req.on("error", function(err){
    callback("", err);
  });
}

//grabs the date and figures out if it is morning, afternoon, or evening
function getWish(){
  var myDate = new Date();
  var hours = myDate.getUTCHours() - 8;

  if(hours < 0){
    hours = hours + 24;
  }

  if(hours < 12){
    return "Good Morning. ";
  }
  else if(hours < 18){
    return "Good afternoon. ";
  }
  else {
    return "Good evening. ";
  }
}

//////////////////////////////
  //// Build Response ////
//////////////////////////////

function buildResponse(options){
  var response = {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "SSML",
        ssml: "<speak>" + options.speechText + "</speak>"
      },
      shouldEndSession: options.endSession
    }
  };

  if(options.repromptText){
    response.response.reprompt = {
      outputSpeech: {
        type: "SSML",
        ssml: "<speak>" + options.reprompText + "</speak>"
      }
    };
  }

  return response;
}


////////////////////////////
  //HANDLE REQUESTS///
////////////////////////////

function handleLaunchRequest(context){
  let options = {};
  options.speechText = "Welcome to Greetings Skill. Using our skill you can greet your guests. Whom you want to greet?";
  options.repromptText = "You can say for example, say hello to John";
  options.endSession = false;
  context.succeed(buildResponse(options));
}


function handleHelloIntent(request, context){
  let options = {};
  let name = request.intent.slots.FirstName.value;
  options.speechText = `Hello ${name}. Your name is spelled <say-as interpret-as="spell-out">${name}</say-as> .`;
  options.speechText += getWish();

  getQuote(function(quote, err){
    if(err){
      context.fail(err);
    }
    else {
      options.speechText += quote;
      options.endSession = true;
      context.succeed(buildResponse(options));
    }
  });
}

///////////////////////
  ////Testing ///
///////////////////////

let e = {
  "session": {
    "new": false,
    "sessionId": "session1234",
    "attributes": {},
    "user": {
      "userId": "usr123"
    },
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.5acba9b5-6d09-4444-aaa8-618c56eb0335"
    }
  },
  "version": "1.0",
  "request": {
    "intent": {
      "slots": {
        "FirstName": {
          "name": "FirstName",
          "value": "John"
        }
      },
      "name": "HelloIntent"
    },
    "type": "IntentRequest",
    "requestId": "request5678"
  }
};

//
// handler(e, {
//   succeed: function(res){
//     console.log(res);
//   },
//   fail: function(string){
//     console.log(string);
//   }
// });
