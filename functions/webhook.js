const twilio_version = require('twilio/package.json').version;

exports.handler = function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  console.log(`Event ${JSON.stringify(event)}`);
  const client = context.getTwilioClient();

  // Start Code Here
  //{"service_sid":"VA341ef808f766f9ad4ad699df1e0a409f","entity_identity":"c57320476ac925f9e21e03c6367b9ed2d198877ec99881abab4dfca3fabc2b37","account_sid":"AC81cffb679132d4154463d551b34dec2b","factor_sid":"YF036b972da1ffbed387b41a54a861f0e6","type":"challenge.approved","uuid":"2c4f7a36-bf7a-4394-a241-3fccc024ab7a","challenge_sid":"YC032bccc3ae605cafd16ad8b12529a7d7"}

  client.verify.services(event.service_sid)
                .entities(event.entity_identity)
                .challenges(event.challenge_sid)
                .fetch()
                .then(challenge => {
                  console.log(`challenge details ${JSON.stringify(challenge)}`);
                  console.log(`Details ${JSON.stringify(challenge.details)}`);
                  console.log(`Status ${JSON.stringify(challenge.status)}`);
                  
                  // Get Call SID
                  // Modify Call to Proceed
                  // send status or event.type to Call
                  let fields = {}
                  for( index in challenge.details.fields ) {
                    console.log(`${JSON.stringify(challenge.details.fields[index])}`);
                    fields[challenge.details.fields[index].label] = challenge.details.fields[index].value;
                  }

                  console.log(`${JSON.stringify(fields)}`);
                  const callSid = fields.CallSid;

                  console.log(`Call Sid: ${callSid}`);

                  client.calls(callSid).update({
                    url: `https://${context.DOMAIN_NAME}/twiml/flowreturn`
                  }).then(call => {
                    console.log(`Call Updated: ${call.sid}`);
                    callback(null, {status: "done", call: call}); 
                  }).catch( err => {
                    console.log(`Error: ${JSON.stringify(err)}`);
                    callback(err);
                  });
            

                })
                .catch(error => {
                  console.log(`error out ${JSON.stringify(error)}`);
                  callback(error, {status: "error", message: error.message})
                })
  
  // const response = twiml.toString()

  // callback(null, {status: "done", event: event});
};