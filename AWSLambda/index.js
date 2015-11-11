var request = require('request');
var moment = require('moment');
var APP_ID = '<<AppID>>';
var SUBDOMAIN = '<<Subdomain>>';

exports.handler = function(event, context) {
  var dueDate = moment().add(1, 'd').format('YYYY-MM-DD');
  var acceptNum = moment();
  console.log(dueDate);
  

	record = {
		'受付番号': { value: acceptNum },
		'タイトル': { value: event.title },
		'インシデント': { value: 'アラート' },
		'作業期限': { type: 'DATE', value: dueDate },
		'内容': { value: event.value }
	};

	request({
		method: 'POST',
		url: "https://" + SUBDOMAIN + "/k/v1/record.json",
		headers: {
			'X-Cybozu-Authorization': '<<Auth>>',
			'Authorization': 'Basic <<Auth>>',
			'Content-Type': 'application/json'
		},
		json: {
			'app': APP_ID,
			'record': record
        }
	}, function(err, response, body) {
		if (err) {
			consle.log("err : " + util.inspect(err));
		}
		if (response.statusCode === 200) {
			console.log('RESULT: ');
			context.succeed();
		} else {
			console.log("response error: " + response.statusCode + ", " + err);
			console.log("response error: " + body.message);
		}
	});
};
