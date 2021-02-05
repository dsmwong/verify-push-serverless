const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  // Start Code Here
  
  const response = twiml.toString()

  callback(null, response);
};