exports.__esModule = true;

var fs = require('fs');

var offload_config_json = { global_vars : [], };

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
              if (path.scope.block.type == "Program" && path.parent.type == "VariableDeclarator") {
                offload_config_json.global_vars.push(path.node.name);
                fs.writeFileSync("offload_config.json", JSON.stringify(offload_config_json), (err) =>
                    { console.log("error occured.")}
                );
              }
            },
            FunctionDeclaration(path) {
                let tclength;
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
                    }
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
