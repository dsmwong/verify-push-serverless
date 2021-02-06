const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  // Start Code Here

  // prereq Google Docs lookup for customer details and have car_type, identity, call_sid and factor_sid passed in

  // client.verify.services(context.VERIFY_SERVICE_SID)
  // .entities(event.identity)
  // .challenges
  // .create({
  //    'details.message': 'Do you approve',
  //    'details.fields': [{'label': 'CarType', 'value': event.car_type}, {'label': 'CallSid', 'value': event.call_sid}],
  //    hiddenDetails: {
  //      ip: '127.0.0.1',
  //      callSid: event.call_sid
  //    },
  //    factorSid: event.factor_sid
  //  })
  // .then(challenge => console.log(challenge.sid));

  // generate twiml
  // <enqueue></enqueue>
  
  const response = twiml.toString()

  callback(null, response);
};