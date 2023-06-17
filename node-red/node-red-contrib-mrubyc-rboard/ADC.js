module.exports = function (RED) {

    function ADC_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function (msg) {

            if (node.targetPort < 0 || isNaN(node.targetPort)) {
                throw new Error("Pin番号が正しくありません。正しいPin番号を入力して下さい。");

            } else if (node.targetPort == "") {
                throw new Error("Pin番号が設定されていません。Pin番号を設定して下さい。");

            }
        });
    }
    RED.nodes.registerType("ADC", ADC_Node);
}