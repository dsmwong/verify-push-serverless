const twilio_version = require("twilio/package.json").version;
const fs = require("fs");
const { google } = require("googleapis");

// Google Token
function getClient(keyFile, scope) {
  const content = fs.readFileSync(keyFile);
  const keys = JSON.parse(content);
  return new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    scope,
    null
  );
}

exports.handler = async function (context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);
  console.log(`Context ${JSON.stringify(context, null, 2)}`);
  console.log(`Event ${JSON.stringify(event, null, 2)}`);

  const phoneNumber = event.phone_number

  try {

    // const scope = "https://www.googleapis.com/auth/spreadsheets.readonly",
    const scope = "https://www.googleapis.com/auth/spreadsheets";

    const client = getClient(Runtime.getAssets()[`/${context.GOOGLE_API_KEY_FILE}`].path, [scope]);

    // Setting it in scope
    const sheets = google.sheets({ version: "v4", auth: client });

    // Read the range
    const res = await sheets.spreadsheets.values.get(
    {
      spreadsheetId: context.GOOGLE_FILE,
      range: context.GOOGLE_SHEET_RANGE
    });

    let profiles = {};
    //if (err) return console.log("The API returned an error: " + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log("Index, Users:");
      // Print columns A and E, which correspond to indices 0 and 4.
      console.log(`rows: ${JSON.stringify(rows, null, 2)}`);
      rows.map((row) => {
        console.log(`${row[0]}, ${row[8]}, ${row[9]}, ${row[10]}, ${row[11]}, ${row[12]}, ${row[13]}, ${row[14]}`);
        profiles[row[0]] = {
          phoneNumber: row[0],
          customer: row[8],
          carType: row[9],
          amount: row[10],
          inboundPhone: row[11],
          identifier: row[12],
          factor_sid: row[13],
          tempalate: row[14]
        };
      });
      console.log(`rows: ${JSON.stringify(profiles, null, 2)}`);
      console.log(`D${rows.length}`)
      
    } else {
      console.log("No data found.");
    }
    // console.log('sent update');
    if( profiles[phoneNumber] ) {
      callback(null, {status: "done", profile: profiles[phoneNumber]});
    } else {
      callback(null, {status: "not-found", message: `Could not find profile for ${phoneNumber}`})
    }

    // const result = wres.data;
    // console.log(`${result.updatedCells} cells updated.`);

  } catch (e) {
    console.error(e);
    callback(e, {status: "error", message: e.message});
  }
};
