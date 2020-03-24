var express = require('express');
var body_parser = require('body-parser');

const app = express();
app.use(body_parser.urlencoded({extended: true}));
app.use(body_parser.json());

app.get('/', (req, res) => {
    res.send('Main page response/');
})

app.listen(8080, () => { console.log("server is listening on port 8080."); });

app.post('/api/offload_function', (req, res) => {
    console.log(req.body.exec_statement);
    var exec_ret = eval(req.body.exec_statement);
    var json_ret = { ret: '' }
    json_ret.ret = exec_ret;
    return res.status(200).json(json_ret);
})