'use strict';

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = function(event, context, callback){
  var request = event.request;

  if(request.type === "LaunchRequest"){
    handleLaunchRequest(context);
  }
  else if(request.type === "IntentRequest"){
    if(request.intent.name === "SaveDataIntent"){
      handleSaveData(request, context, callback);
    }
    else if(request.intent.name === "ReadDataIntent"){
      handleReadData(request, context);
    }
    else if(request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent"){
      context.succeed(buildResponse({
        speechText: "Good bye",
        endSession: true
      }));
    }
  }
};

function handleLaunchRequest(context){
  let options = {};
  options.speechText = "Welcome to data base practice. What do you want to do?";
  options.endSession = false;
  context.succeed(buildResponse(options));
}

function handleSaveData(request, context, callback){
  var options = {};
  var dataInput = request.intent.slots.data.value;
  options.speechText = "Failed to save";

  var params = {
    TableName: "DataBasePractice",
    Item: {
      data: dataInput
    }
  };

  docClient.put(params, function(err, data){
    if(err){
      callback(err, null);
    } else {
      callback(null, data);
      options.speechText = "Data has been saved";
      options.endSession = true;
      context.succeed(buildResponse(options));
    }
  });
}


function handleReadData(request, context){
}


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

  return response;
}
