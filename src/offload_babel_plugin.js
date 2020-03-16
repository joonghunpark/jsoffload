exports.__esModule = true;

exports.default = function(_ref) {
    var t = _ref.types;
    return {
        visitor: {
            Identifier(path) {
              console.log(path.node.name);
            },
            FunctionDeclaration(path) {
                    console.log("trailingcomments");
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
