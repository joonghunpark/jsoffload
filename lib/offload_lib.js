// This library's |remoteExecution| API call is generated
// from the original js source file which user want to transform,
// by execute "node_modules/.bin/babel src/offload_babel_plugin.js"
// at the root of this project.

var xhr = new XMLHttpRequest();

function remoteExecution(func_obj, arguments) {
	xhr.open('POST', "http://10.113.165.164:8080/api/offload_function", false);
	xhr.setRequestHeader("Content-Type", "application/json");

	var data = {
		exec_statement : ''
	}
	var func_as_str = func_obj.toString();

	// The function name genarated by
	// Babel path.scope.generateUidIdentifierBasedOnNode(path.node.id);
	var exec_func_name = func_obj.name;

	var exec_statement = func_as_str + ";" + exec_func_name + "." + "call(" + "null," + arguments + ");"
	console.log("exec_statement: " + exec_statement);
	data.exec_statement = exec_statement;
	console.log(JSON.stringify(data));
	xhr.send(JSON.stringify(data));
	var json_ret = JSON.parse(xhr.responseText);
	console.log("json_ret.ret: " + json_ret.ret);
	return json_ret.ret;
}
