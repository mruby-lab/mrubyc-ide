
// sleep機能
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );


// シリアルポートへ接続
async function serial_connect_onclick() {
    try {
        const baudRate = 19200
	
        textarea = document.getElementById('outputArea');
        port = await navigator.serial.requestPort();

        keepReading = true;

        await port.open({
            baudRate: baudRate,     // ボーレートの設定 
            dataBits: 8,            // 1文字あたりのデータビット数を8にする
            stopBits: 1,            // ストップビットを1ビットに設定する
            parity: 'none',         // /パリティビットは送信しない設定にする
            flowControl: 'none'     // ハードウェアフロー制御を行わない
        }).catch(err => console.log(err));

        textarea.value = "Connected serial port. \n" + baudRate + "\n";
        textarea.scrollTop = textarea.scrollHeight;

	// ボタンをdisabledにする
	document.getElementById('serial_connect_onclick').disabled = true
	document.getElementById('serial_disconnect_onclick').disabled = false

        console.log("Connected serial port.");
        await readUntilClosed() ;
        
    } catch (error) {
        textarea.value += "Error: Open " + error + "\n";
        textarea.scrollTop = textarea.scrollHeight;

        console.log("Serial port open error.");
        console.log(error);
    }
}

// シリアルポートから読み取り //
async function readUntilClosed() {
    while (port.readable && keepReading) {
        reader = port.readable.getReader();
        try {
            while (true) {
		// シリアルポートからデータを受信する
                const { value, done } = await reader.read();
                if (done) {
                    textarea.value += "Canceled\n";
                    textarea.scrollTop = textarea.scrollHeight;
                    console.log("Canceled");
                    break;
                }
                if (value){
                    const inputValue = new TextDecoder().decode(value);
		    // シリアルポートから受信したデータをテキストエリアに表示する
                    textarea.value += inputValue;
                    textarea.scrollTop = textarea.scrollHeight;
                    console.log("receive:" + inputValue);
                }
            }
        } catch (error) {
            textarea.value += "Error: Read " + error + "\n";
            textarea.scrollTop = textarea.scrollHeight;
            console.log("Serial port read error.");
            console.log(error);
        } finally {
            reader.releaseLock();   
        }
    }
    await port.close()
    textarea.value += "port closed\n";
    textarea.scrollTop = textarea.scrollHeight;
    console.log("port closed");
}


// 切断ボタン //
async function serial_disconnect_onclick() {
    // ボタンをdisabledにする
    document.getElementById('serial_connect_onclick').disabled = false
    document.getElementById('serial_disconnect_onclick').disabled = true

    keepReading = false;
    reader.cancel();
}


// 書き込みボタン
async function write_bytecode_onclick() {
    // バイトコード作成（コンパイル）
    // ファイルサイズ
    // 書き込み
    const writer = port.writable.getWriter()
    const waitTime = 200
    const encoder = new TextEncoder();
    // シリアルポートに\r\nを送信する
    console.log("send \r\n");
    await writer.write(encoder.encode('\r\n'));
    await writer.write(encoder.encode('\r\n'));
    await sleep(waitTime);

    // ファイルのクリア
    console.log("send clear");
    await writer.write(encoder.encode("clear \r\n"));
    await sleep(waitTime);

    writer.releaseLock();
    
}
