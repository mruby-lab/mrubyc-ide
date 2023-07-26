
var ble = new BlueJelly()

// SenStick関連の設定
var SCAN_UUID            = '00000000-0000-0000-0000-000000000000'
var BATTERY_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
var BATTERY_CHAR_UUID    = '00002a19-0000-1000-8000-00805f9b34fb'
var MRUBY_SERVICE_UUID   = 'f0001523-0451-4000-b000-000000000000'
var MRUBY_CHAR_UUID      = 'f0001525-0451-4000-b000-000000000000'

// ページを表示した際の設定などを行う
const page_load = () => {
    //UUIDの設定
    ble.setUUID("battery", BATTERY_SERVICE_UUID, BATTERY_CHAR_UUID) 
    ble.setUUID("mrubyc", MRUBY_SERVICE_UUID, MRUBY_CHAR_UUID)
}

// 送信するバイト列を管理する
// bytecode: バイトコード列
// seq: 次に転送するシーケンス番号（seq>=0で転送中）
// num_seq: シーケンスの数
var transfer_data = { bytecode: null, seq: -1 , end_seq: -1 }

// 転送時のウェイト(ms)
var TRANSFER_WAIT_MS = 10

// BLEスキャン時の onScan イベントハンドラ
//　選択したデバイス名を表示する
ble.onScan = (deviceName) => {
    document.getElementById('device_name').innerHTML = deviceName
    document.getElementById('device_status').innerHTML = '接続中...'
}


// [scan & connect] ボタン
// 接続がされると、onConnectGATT が呼ばれる
const scan_onclick = () => {
    ble.scan('mrubyc').then( () => {
        return ble.connectGATT('mrubyc')
    }).catch( error => {
        console.log('error in scan')
        this.onError(error)
    })
}

// GATT接続した
ble.onConnectGATT = (deviceName) => {
    document.getElementById('device_status').innerHTML = '接続済'
}


// [disconnect] ボタン
// 切断されると、onDisconnect が呼ばれる
const disconnect_onclick = () => {
    ble.reset()
}


//　切断処理
ble.onDisconnect = (deviceName) => {
    document.getElementById('device_status').innerHTML = 'Disconnected'
}

// 転送中のプログレス表示
const transferProgress = (val) => {
    document.getElementById('transfer_progress').innerHTML = '転送中' + val + ' %'
}

// ドラッグ中
const handleDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

// ドロップした
const handleFileSelect = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    
    var files = evt.dataTransfer.files; 

    var file_name = ""
    mrb_files = [];
    for( file of files ){
	mrb_files.push(file)
	console.log(file)
	if( file_name != "" ) file_name += ", "
	file_name += file.name
    }

    var mrb_files_text  = document.getElementById('mrb_files_text');
    mrb_files_text.innerHTML = file_name
}


// mrbを分割して 16バイト分を転送する
// 転送完了時には、コマンド 0x07 で実行させる
const transfer_mrb16 = () => {
    seq = transfer_data['seq']
    if( seq < 0 ) return
    if( seq < transfer_data['end_seq'] ){
	// 転送途中
	cmd = [0x06,
	       seq/256|0, seq%256,
	       0, 0, 0, 0, 0, 0, 0, 0,
	       0, 0, 0, 0, 0, 0, 0, 0
	      ]
	transfer_data['seq'] = seq+1
	// バイトコードをコピー
	var bytecode = new Uint8Array(transfer_data['bytecode'])
	for( var i=0 ; i<16 ; i++ ){
	    if( seq*16+i < bytecode.byteLength ){
		cmd[i+3] = bytecode[seq * 16 + i]
	    }
	}
	console.log('seq=', seq)
	ble.write('mrubyc', cmd).then( () => {
	    transferProgress( 100*seq/transfer_data['end_seq'] | 0 )
	})
    } else {
	// 転送完了＆実行
	transfer_data['seq'] = -1
	cmd = [0x07]
	console.log('cmd 0x07')
	// パスワードコピー
	var my_password = document.getElementById('password').value
	var len = my_password.length
	if( len > 16 ) len = 16;
	for( i=0 ; i<len ; i++ ){
		cmd.push(my_password.charCodeAt(i));
	}
	cmd.push(0);  // ゼロターミネート
	// コマンド送信
   	ble.write("mrubyc", cmd).then(() => {
	   transferProgress(100)
	   return ble.read("mrubyc")
   	}).then((data) => {
	   if( data.getUint8(0) == 1 ){
		   document.getElementById('transfer_result_text').innerHTML = 'プログラムを転送しました'
	    } else {
		   document.getElementById('transfer_result_text').innerHTML = 'プログラムを転送できませんでした'
		}
	})
	}
}


// BLE書き込み時の onWrite イベントハンドラ
// バイトコード転送の際には、書き込みが連続するので、
// 書き込み完了を確認する必要がある
ble.onWrite = (deviceName) => {
    if( deviceName == 'mrubyc' ){
	if( transfer_data['seq'] < 0 ) return
	//	transfer_mrb16()
	window.setTimeout(transfer_mrb16, TRANSFER_WAIT_MS);
    }
}


// BLEからデータを取り出す
ble.onRead = (data,deviceName) => {
}


// [Transfer] ボタン
const transfer_onclick = () => {
	// mrubyコードを取得してコンパイルする
	editor.save()
	// compile
	const fd = new FormData()
	let data = []
	fd.append("program", document.getElementById('program').value)
	fd.append("version", "2.0.1")
	fd.append("name", "mruby_prgram")
//	const compile_url = "https://localhost:4567/compile"
	const compile_url = "https://mrubyc-ide.ddns.net/compile"
	// コンパイルのリクエスト
	fetch(compile_url, {method:'POST', body:fd, mode:"cors" })
	.then( res => res.body.getReader() )
	.then( reader => {
		function readChunk({done, value}) {
			if(done) {
				transfer_data.bytecode = data[0]
				transfer_data.seq = 0
				transfer_data.end_seq = (data[0].byteLength+15) / 16 | 0
				console.log("trans", transfer_data)
				// onWriteイベント発生
				ble.write("mrubyc", [0x00])
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
const load_sample1 = () => {
	const code = "while true do\r  led 1\r  sleep 1\r  led 0\r  sleep 1\rend"
	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}

// サンプルプログラム
// 温度によってLEDを制御する
const load_sample2 = () => {
	const code = `sensor = SenStickIF.new([:temperature])
while true do
  t = sensor.get(:temperature)
  if t>30 then
	led 1
  else
	led 0
  end
  sleep 0.1
end
`

	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}

// サンプルプログラム
// 明るさが変化するとLEDが点滅する
const load_sample3 = () => {
	const code = `sensor = SenStickIF.new([:brightness])

old_value = sensor.get(:brightness)
while true do
  new_value = sensor.get(:brightness)
  if (new_value-old_value).abs > 50 then
	led 1
	sleep 0.5
  else
	led 0
	sleep 0.1
  end
  old_value = new_value
end
`

	var doc = editor.getDoc()
	doc.setValue(code)
	editor.clearHistory()
}
