const dotenv = require('dotenv');
dotenv.config();

const { DRACHTIO_HOST = "localhost", DRACHTIO_PORT = 9022, DRACHTIO_PASSWORD='helloWord', DEBUG_LOG="true" } = process.env;

const Srf = require('drachtio-srf');
const srf = new Srf('sbc-in-out');
const parseUri = Srf.parseUri;

srf.connect({
  host: DRACHTIO_HOST,
  port: DRACHTIO_PORT,
  secret: DRACHTIO_PASSWORD
}) ;

if(DEBUG_LOG === "false") {
  console.debug = function() {}
  console.log = function() {}
}

srf.on("connect", (err, hostport) => {
  if (err) return console.log("error connecting: ${err}");

  console.log(`Connected With SERVER...`);
  const {registerToTRUNK} = require('./lib/utils');
  registerToTRUNK(srf);
});
