var noble = require('noble');
var awsIot = require('aws-iot-device-sdk');
var moment = require('moment');

var deviceName = 'dev1';
var topic = deviceName + '/ginga';
var myAddress = "eb:1e:91:01:92:2d";

var device = awsIot.device({
   keyPath: './certs/private.pem',
  certPath: './certs/cert.pem',
    caPath: './certs/root.pem',
  clientId: deviceName,
    region: 'ap-northeast-1'
});

function publish_data(sensorType, value) {
     var record = {
        "device": deviceName,
        "sensor": sensorType,
        "timestamp": moment().toISOString(),
        "value": value
      };
      console.log("Publish: " + message);
      device.publish(topic, message);
}

function temp(data){
  var v1 = parseInt(data[0]);
  var v2 = parseInt(data[1]) / 100;
  publish_data('temp',v1 + v2);
}

function humid(data){
  var v1 = parseInt(data[2]);
  var v2 = parseInt(data[3]) / 100;
  publish_data('humid',v1 + v2);
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  noble.stopScanning();
  //console.log('Local Name: ' + peripheral.advertisement.localName);
  if(myAddress == peripheral.address){
      var serviceUUID = peripheral.advertisement.serviceUuids[0];
      console.log('Service UUID: ' + serviceUUID);
      peripheral.connect(function(error){
        if (error) console.log('connect error: ' + error);
        console.log('connected to ' + peripheral.uuid);
        peripheral.discoverServices([serviceUUID],
          function (error, services){
            if (error) console.log('discoverServices error: ' + error);
            console.log('services.length: ' + services.length);
            var service = services[0];
            service.discoverCharacteristics(null,function(error, characteristicss
){
              if (error) console.log('discoverCharacteristics error: ' + error);
              console.log('characteristics.length: ' + characteristics.length);
              characteristics[0].notify(true, function(error){
                if (error) console.log('notify error: ' + error);
                setInterval(function(){
                  characteristics[0].read(function(error, data){
                    if (data){
                      //console.log( data );
                      humid(data);
                      temp(data);
                     }
                   });
                }, 10000);
              });
            });
          }
        );
      });
  } else {
    console.log("not device");
  }
});

device
  .on('connect', function() {
    console.log('Connected to Message Broker.');
  });
