const twilio_version = require('twilio/package.json').version;
const crypto = require('crypto')

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  console.log(`context: ${JSON.stringify(context)}`);
  console.log(`event: ${JSON.stringify(event)}`);

  const identifier_hash = crypto.createHash("sha256").update(event.identifier).digest("hex");

  client.verify.services(context.VERIFY_SERVICE_SID)
    .entities(identifier_hash)
    .challenges.create({
      'details.message': "Do you approve access?",
      'details.fields': [{ label: "CallSid", value: event.call_sid }],
      factorSid: event.factor_sid,
    }).then(challenge => {
      callback(null, {status: "ok", "challenge": challenge});
    }).catch(error => {
      callback(error, {status: "error", "error": error});
    })

};