
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
    editor.save()
    // compile
    const fd = new FormData()
    let data = []
    fd.append("program", document.getElementById('program').value)
    fd.append("version", "3.2.0")
    fd.append("name", "mruby_prgram")
    // const compile_url = "https://mrubyc-ide.ddns.net/compile"
    const compile_url = "https://localhost/compile"
    // コンパイルのリクエスト
    fetch(compile_url, {method:'POST', body:fd, mode:"cors" })
	.then( res => res.body.getReader() )
	.then( reader => {
	    async function readChunk({done, value}) {
		if(done) {
		    const transfer_data = data[0]
		    console.log("trans", transfer_data)
		    // バイトコード転送開始
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

		    // シリアルポートにファイルを書き込む準備
		    console.log("send write");
		    const file_size = transfer_data.byteLength
		    await writer.write(encoder.encode("write " + file_size + "\r\n"));
		    await sleep(waitTime);

		    // RBoardに.mrbファイルを転送
		    console.log("send binary file \r\n");
		    await writer.write(transfer_data);
		    await writer.write(encoder.encode("\r\n"));
		    await sleep(waitTime);
		    
		    // .mrbを実行する
		    console.log("execute \r\n");
		    await writer.write(encoder.encode("execute\r\n"));
		    await sleep(waitTime);
		    
		    writer.releaseLock();
		    return
		}
		data.push(value)
		reader.read().then(readChunk)
	    }
	    reader.read().then(readChunk)
	})
	.catch(err => {
	    console.error(err)
	})
}

// サンプルプログラム
// LEDを点滅させる
async function load_sample1() {
	const code = `led = GPIO.new(0)

while true do
  led.write 1
  sleep 0.5
  led.write 0
  sleep 0.5
end    
`
	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}

// サンプルプログラム
// LEDを点滅させる
async function load_sample2() {
	const code = `led0 = GPIO.new(0)
led1 = GPIO.new(1)

while true do
  led0.write 1
  led1.write 0
  sleep 1
  led0.write 0
  led1.write 1
  sleep 1
end    
`
	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}

async function load_sample3() {
	const code = `led1 = PWM.new(0)
led1.frequency 10000

while true do
  for i in 0..1023 do
    led1.duty i
    sleep 0.001
  end

  for i in 0..1023 do
    led1.duty 1023-i
    sleep 0.001
  end
end
`
	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}

