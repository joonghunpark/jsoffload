exports.__esModule = true;

var fs = require('fs');

var offload_config_json = { functions : [] };

exports.default = function(_ref) {
    var t = _ref.types;
    return {
        visitor: {
            Identifier(path) {
              console.log("Identifier visitor");
              console.log("path.node.name: ");
              console.log(path.node.name);
              console.log("path.scope: ");
              console.log(path.scope);
              console.log("path.parent: ");
              console.log(path.parent);
            },
            FunctionDeclaration(path) {
                let tclength;
                let is_offloadable = true;
                let old_id = path.node.id;
                console.log("FunctionDeclaration path.node.name");
                console.log(path.node.name);
                console.log("FunctionDeclaration path.scope");
                console.log(path.scope);
                path.traverse({
                    ExpressionStatement(innerPath) {
                        if (innerPath.node.expression.type == "CallExpression")
                            is_offloadable = false;
                    }
                });
                path.node.body.body.forEach(elem =>
                    console.log("each elem is: " + JSON.stringify(elem)));
                if (path.node.leadingComments) {
                    tclength = path.node.leadingComments.length;
                    console.log(path.node.leadingComments[tclength - 1].value);
                    if (/<<offload>>/.test(path.node.leadingComments[tclength - 1].value)) {
                        const generated_id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
                        path.insertAfter(t.FunctionDeclaration(path.node.id, path.node.params,
                            t.BlockStatement([t.ExpressionStatement(
                                t.CallExpression(t.Identifier("remoteExecution"),
                                    [generated_id, t.ArrayExpression(path.node.params)]))],
                                        path.node.body.directives)));
                        path.node.id = generated_id;
                        is_offloadable = true;
                    }
                }

                if (path.scope.block.type == "Program")
                    is_offloadable = true;

                if (is_offloadable) {
                    let func_json = { id: "", globals: [] }
                    func_json.id = old_id.name;
                    var global_path = path.findParent((path) => (path.scope.block.type == "Program"));
                    console.log("global_path: " + global_path);
                    for (key in global_path.scope.bindings) {
                        func_json.globals.push(key);
                    }
                    console.log(func_json);
                    offload_config_json.functions.push(func_json);
                    console.log("offload_config_json.functions: " + JSON.stringify(offload_config_json.functions));
                    fs.writeFileSync("offload_config.json", JSON.stringify(offload_config_json), (err) =>
                        { console.log("error occured.")}
                    );
                }
            },
            CallExpression(path) {
                console.log("callee: ");
                console.log(path.node.callee);
                console.log("arguments: ");
                console.log(path.node.arguments);
            }
        }
    }
}
