module.exports = function (RED) {

    function ADC_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function (msg) {

            if (node.targetPort < 0 || isNaN(node.targetPort)) {
                throw new Error("Pin�ԍ�������������܂���B������Pin�ԍ�����͂��ĉ������B");

            } else if (node.targetPort == "") {
                throw new Error("Pin�ԍ����ݒ肳��Ă��܂���BPin�ԍ���ݒ肵�ĉ������B");

            }
        });
    }
    RED.nodes.registerType("ADC", ADC_Node);
}