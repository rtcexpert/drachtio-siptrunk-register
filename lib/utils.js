const { TRUNK_ADDRESS="10.10.10.22:5060", 
        TRUNK_USERNAME="xxxx@ims.xxxx.in", 
        TRUNK_PASSWORD="tmpPass", 
        TRUNK_TRNASPORT="udp",
        LOCAL_IP_PORT="10.10.10.1:8958",
        REGISTER_TIMEOUT=60 } = process.env;


function registerTrunk(srf, trunk) {
  let trunkUser = TRUNK_USERNAME.split("@")[0];
  let trankProxy = TRUNK_USERNAME.split("@")[1];
  const uri = `sip:${trankProxy};transport=${TRUNK_TRNASPORT}`;
  const proxy = `sip:${trunk};transport=${TRUNK_TRNASPORT}`;
  const contact = `<sip:${trunkUser}@${LOCAL_IP_PORT};transport=${TRUNK_TRNASPORT}>`;
  
  console.log(`Sending To -> ${uri} form ${contact}`);

  srf.request(uri, {
    method: 'REGISTER',
    proxy,
    headers: {
      'Contact': contact,
      'From': `<sip:${TRUNK_USERNAME}>`,
      'To': `<sip:${TRUNK_USERNAME}>`,
      'Expires': 600,
      'Allow': 'INVITE, ACK, BYE, CANCEL, OPTIONS, MESSAGE, INFO, UPDATE, REGISTER, REFER, NOTIFY'
    },
    auth: {
      username: TRUNK_USERNAME,
      password: TRUNK_PASSWORD
    }
  }, (err, req) => {
    if (err) {console.log(`Error got is ${err}`)};
    req.on('response', (res) => {
      if (res.status === 200) { console.log(`200OK...`) };
      console.log(`REGISTER was rejected after auth with ${res.status}`);
    });
  });
}

function registerToTRUNK(srf) {
  let trunks = TRUNK_ADDRESS.split(',');
  console.log(trunks);
  trunks.forEach(trunk => {
      setTimeout(registerTrunk.bind(this, srf, trunk), 0.5 * 1000);
      setInterval(registerTrunk.bind(this, srf, trunk), REGISTER_TIMEOUT * 1000);
  });
}

module.exports = {
  registerToTRUNK
};
