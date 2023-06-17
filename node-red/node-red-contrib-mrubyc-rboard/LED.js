module.exports = function(RED) {
    
    function LED_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        
        this.targetPort = config.targetPort;
        this.onBoardLED = config.onBoardLED;
        



        node.on('input', function () {

            if (node.targetPort < 0 || isNaN(node.targetPort)) {
                throw new Error("Pin番号が正しくありません。正しいPin番号を入力して下さい。");

            } else if (node.onBoardLED == "" && node.targetPort == "") {
                throw new Error("オンボードLED、またはPin番号が設定されていません。オンボードLED、またはPin番号を設定して下さい。");

            }         
           

         });


        

        /*node.on('input', function (msg) {
            var msg;

            if (node.targetPort != "" && node.onBoardLED != "0") {
                msg = "「ポート番号」と「オンボードLED番号」の両方が設定されています。どちらかのみ設定してください。";
            } else if (node.targetPort != "") {
                msg = "ポート番号：" + node.targetPort + "番が点灯します";
            } else if (node.targetPort == "0") {
                msg = "Pin番号が正しくありません。正しいPin番号を設定してください。";
            } else if (node.onBoardLED != "0")                 
                msg = "オンボードLEDが「" + node.onBoardLED + "」の2進数形式で点灯します";
            } else {
                msg = "LEDノードが機能しません"
            }


            node.send(msg);
        });
        */

     
    }

    RED.nodes.registerType("LED",LED_Node);
}