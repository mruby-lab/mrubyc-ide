//Textareaの内容を保存
function save(){
    editor.save();
    var code = document.getElementById('program').value;
    var name = document.getElementById('name').value;
    if(!name){
      name = 'Unnamed';
    }
    if(!code){
      alert('コードが入力されていません');
      return;
    }
  
    var blob = new Blob([code], {type: 'text/plain'});
  
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.rb';
    a.click();
  };
  
  //ファイル選択機能
  const selectFile = () => {
    // FileListオブジェクト取得
    const selectFiles = document.querySelector("#select-file").files;
  
    // Fileオブジェクト取得
    const file = selectFiles[0];
  
    // FileReaderオブジェクト取得
    const reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = () => {
      editor.toTextArea(); //元のエディタを消す
      document.querySelector("#name").value = file.name;
      document.querySelector("#program").value = reader.result;
      editor = CodeMirror.fromTextArea(document.getElementById("program"), {
        mode: "ruby",
        lineNumbers: true,
        theme: 'base16-dark'
      });
      editor.setSize("60%", "60%");
      editor.save();
    };
  
    // ファイル読み込みエラー時の処理
    reader.onerror = () => {
      alert('ファイル読み込みエラー');
    };
  };
  