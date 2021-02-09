const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const twiml = new Twilio.twiml.VoiceResponse();
  const flowSid = "FW15328ea9f28f5c3b3250eb87ecc47f3f";
  const verifyStatus = event.verifyStatus;
  
  const return_url = `https://webhooks.twilio.com/v1/Accounts/${context.ACCOUNT_SID}/Flows/${flowSid}?FlowEvent=return`

  twiml.say({} ,'You have been verified');
    
  twiml.redirect(encodeURI(return_url +'&Verify=' + verifyStatus));
  
  callback(null, twiml);
};