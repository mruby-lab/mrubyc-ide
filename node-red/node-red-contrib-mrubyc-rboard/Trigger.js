module.exports = function (RED) {

    function Trigger_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function (msg) {


        });
    }
    RED.nodes.registerType("Trigger", Trigger_Node);
}