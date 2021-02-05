const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  
  console.log(`${JSON.stringify(event)}`);

  //const twiml = new Twilio.twiml.VoiceResponse();
  const client = context.getTwilioClient();

  console.log(`flow: ${event.flowSid} to: ${event.to}   from: ${event.from}`);
  
  client.studio.flows(event.flowSid)
             .executions
             .create({to: event.to, from: event.from})
             .then(execution => {
              callback(null, {status: "ok", execsid: execution.sid});
            }).catch(err => {
              callback(null, {status: "error", error: err.message});
            })
};