/*
  create_cert.js
  Create certificate file from CSR
*/

var AWS = require('aws-sdk');
var fs  = require('fs');

AWS.config.loadFromPath('./config.json');
var iot = new AWS.Iot();

// Read csr string from file
var csr_buffer = fs.readFileSync('./cert.csr');
var csr_str = csr_buffer.toString();

console.log("CSR String:" + csr_str);

// Parameter for create certificate
var params = {
  certificateSigningRequest: csr_str, /* required */
  setAsActive: true
};

// Create certificate from CSR
iot.createCertificateFromCsr(params, function(err, data) {
  if (err) {
      console.log(err, err.stack); // an error occurred
  } else {
      console.log(data);           // successful response
      fs.writeFile('cert.pem', data.certificatePem);   //Store to certificate file
  }
});
