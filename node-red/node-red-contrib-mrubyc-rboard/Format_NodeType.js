module.exports = function(RED) {
    
    function FormatNodeType_Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {


        });
    }
    RED.nodes.registerType("FormatNodeType",FormatNodeType_Node);
}