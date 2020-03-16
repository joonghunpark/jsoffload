var express = require('express');
var body_parser = require('body-parser');

const app = express();
app.use(body_parser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/', (req, res) => {
	res.send('Main page response/');
})

app.post('/api/offload_function', (req, res) => {
	var json = JSON.parse(req.body);
	var exec_ret = eval(json.exec_statement);
	var json_ret = { ret: '' }
	json_ret.ret = exec_ret;
	return res.status(200).json(json_ret);
})