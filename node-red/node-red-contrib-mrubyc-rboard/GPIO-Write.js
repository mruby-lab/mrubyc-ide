module.exports = function(RED) {
    
    function GPIO_Write_Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {

            
        });
    }
    RED.nodes.registerType("GPIO-Write",GPIO_Write_Node);
}