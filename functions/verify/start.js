const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  
  // uncomment to support CORS
  // response.appendHeader('Access-Control-Allow-Origin', '*');
  // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (typeof event.to === 'undefined') {
    response.setBody({
      "success": false,
      "error": {
        "message": "Missing parameter; please provide a phone number or email.",
        "moreInfo": "https://www.twilio.com/docs/verify/api/verification"
      }
    })
    response.setStatusCode(400);
    return callback(null, response);
  }

  const client = context.getTwilioClient();
  const service = context.VERIFY_SERVICE_SID;
  const to = event.to;
  const channel = (typeof event.channel === 'undefined') ? "sms" : event.channel;
  const locale = (typeof event.locale === 'undefined') ? "en" : event.locale;

  client.verify.services(service)
    .verifications
    .create({
      to: to,
      channel: channel,
      locale: locale
    })
    .then(verification => {
      console.log(`Sent verification: '${verification.sid}'`);
      response.setStatusCode(200);
      response.setBody({
        "success": true
      });
      callback(null, response);
    })
    .catch(error => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        "success": false,
        "error": {
          "message": error.message,
          "moreInfo": error.moreInfo
        }
      });
      callback(null, response);
    });
};