const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = function(event, context, callback){

  trythis(event, context, callback);
};

function trythis(event, context, callback){
  var params = {
    TableName: "DataBasePractice",
    Item: {
      data: "why hello"
    }
  };
  docClient.put(params, function(err, data){
    if(err){
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
