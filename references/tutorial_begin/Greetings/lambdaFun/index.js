'use strict';

exports.handler = function(event, context){

  try{
    var request = event.request;

    /*
      i)   LaunchRequest
      ii)  IntentRequest
      iii) SessionEndedRequst
    */

    if(request.type === "LaunchRequest"){
      let options = {};
      options.speechText = "Welcome to Greetings Skill. Using our skill you can greet your guests. Whom you want to greet?";
      options.repromptText = "You can sayy for example, say hello to John";
      options.endSession = false;
      context.succeed(buildResponse(options));

    } else if(request.type === "IntentRequest"){
      let options = {};

      if(request.intent.name === "HelloIntent"){
        let name = request.intent.slots.FirstName.value;
        options.speechText = "Hello" + name +". ";
        options.speechText += getWish();
        options.endSession = true;
        context.success(buildResponse(options));

      } else {
        throw "Unknown Intent";
      }

    } else if(request.type === "SessionEndedRequst"){

    } else {
      throw "Unknown Intent Type";
    }
  } catch(e){
    context.fail("Exception:" + e);
  }
};

//grabs the date and figures out if it is morning, afternoon, or evening
function getWish(){
  var myDate = new Date();
  var hours = myDate.getUTCHours() - 8;

  if(hours < 0){
    hours = hours + 24;
  }

  if(hours < 12){
    return "Good Morning.";
  } else if(hours < 18){
    return "Good afternoon.";
  } else {
    return "Good evening.";
  }
}

function buildResponse(options){
  var response = {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: options.speechText
      },
      shouldEndSession: options.endSession
    }
  };

  if(options.repromptText){
    response.response.reprompt = {
      outSpeech: {
        type: "PlainText",
        text: options.reprompText
      }
    };
  }

  return response;
}
