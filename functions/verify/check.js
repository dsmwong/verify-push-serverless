const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  
  // uncomment to support CORS
  // response.appendHeader('Access-Control-Allow-Origin', '*');
  // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (typeof event.to === 'undefined' ||
      typeof event.verification_code === 'undefined') {
    response.setBody({
      "success": false,
      "message": "Missing parameter."
    })
    response.setStatusCode(400);
    return callback(null, response);
  }

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;
  const to = event.to;
  const code = event.verification_code;

  client.verify.services(service)
    .verificationChecks
    .create({
      to: to,
      code: code
    })
    .then(check => {
      if (check.status === "approved") {
        response.setStatusCode(200);
        response.setBody({
          "success": true,
          "message": "Verification success."
        });
        callback(null, response);
      } else {
        response.setStatusCode(401);
        response.setBody({
          "success": false,
          "message": "Incorrect token."
        });
        callback(null, response);
      }
    })
    .catch(error => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        success: false,
        message: error.message
      });
      callback(null, response);
    });
};