module.exports = function(RED) {
    
    function GPIO_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        
        this.targetPort = config.targetPort;
        



        node.on('input', function () {

            if (node.targetPort < 0 || isNaN(node.targetPort)) {
                throw new Error("Pin番号が正しくありません。正しいPin番号を入力して下さい。");

            }
         });


    }

    RED.nodes.registerType("GPIO",GPIO_Node);
}