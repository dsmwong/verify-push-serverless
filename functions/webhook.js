const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`${JSON.stringify(event)}`);
  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  // Start Code Here
  
  const response = twiml.toString()

  callback(null, {status: "done", event: event});
};