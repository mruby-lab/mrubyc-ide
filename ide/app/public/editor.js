//コード保存用の配列(json)の初期化
function firstscript(){
  var sel = document.getElementById("sel");
  var JsonProgramArray = sessionStorage.getItem('programarray');
  var JsonNameArray = sessionStorage.getItem('namearray');

  if(JsonProgramArray == null){
    var ProgramArray = [];
    ProgramArray[0] = document.getElementById('program').value;
    JsonProgramArray = JSON.stringify(ProgramArray);
    sessionStorage.setItem('programarray', JsonProgramArray);

    var NameArray = [];
    NameArray[0] = sel[0].text;
    JsonNameArray = JSON.stringify(NameArray);
    sessionStorage.setItem('namearray', JsonNameArray);
    //alert('初期化完了');

  } else {
    var ProgramArray = JSON.parse(JsonProgramArray);
    var NameArray = JSON.parse(JsonNameArray);
    var name = NameArray[0];
    var p = ProgramArray[0];

    sel[0].text = name;
    var doc = editor.getDoc();
    doc.setValue(p);
    editor.clearHistory();
    editor.save();

    for(let i=1; ProgramArray[i]!=null; i++){
      name = NameArray[i];
      sel.options[i] = new Option(name, i);
    }
    //alert('初期化なし');
  }
};

//リストボック選択時、現在のプログラムデータを配列に保存
function selectclick(){
  //現在選択中のindexを参照し、編集中のプログラムを配列に保存
  editor.save();
  ProgramArraysave();
};

//リストボックス変更時、編集エリア(CodeMirror)のデータを書き換える
function selectchange(){
  //選択したselectのindexをとる
  var sel = document.getElementById("sel");
  var idx = sel.selectedIndex;

  //indexから選択先のプログラムデータを配列からcodemirrorに表示、saveでtextareaに反映
  var JsonProgramArray = sessionStorage.getItem('programarray');
  var ProgramArray = JSON.parse(JsonProgramArray);
  var p = ProgramArray[idx];
  if(p == null){
    p = '';
  }
  var doc = editor.getDoc();
  doc.setValue(p);
  editor.clearHistory();
  editor.save();
};

//選択中であるCodeMirror上のプログラムを配列に保存
function ProgramArraysave(){
  editor.save();
  var sel = document.getElementById("sel");
  var idx = sel.selectedIndex;
  var code = document.getElementById('program').value;

  var JsonProgramArray = sessionStorage.getItem('programarray');
  var ProgramArray = JSON.parse(JsonProgramArray);
  ProgramArray[idx] = code;
  JsonProgramArray = JSON.stringify(ProgramArray);
  sessionStorage.setItem('programarray', JsonProgramArray);
};

//プログラムの追加
function Addevent(){
  //リストボックス要素の追加
  var sel = document.getElementById("sel");
  var selnum = document.getElementById("sel").length;
  selnum++;
  var basename = document.querySelector("#name").value;
  var addname = basename + '_' + selnum;
  sel.options[sel.options.length] = new Option(addname , selnum);

  //保存先の配列要素の追加
  var JsonProgramArray = sessionStorage.getItem('programarray');
  var ProgramArray = JSON.parse(JsonProgramArray);
  ProgramArray[selnum - 1] = '';//selnumは配列のindexよりも1大きい（indexは0から）
  JsonProgramArray = JSON.stringify(ProgramArray);
  sessionStorage.setItem('programarray', JsonProgramArray);

  var JsonNameArray = sessionStorage.getItem('namearray');
  var NameArray = JSON.parse(JsonNameArray);
  NameArray[selnum - 1] = addname;
  JsonNameArray = JSON.stringify(NameArray);
  sessionStorage.setItem('namearray', JsonNameArray);
};

//プログラムの削除
function Delevent(){
  var cnt = document.getElementById("sel").length;
  if(cnt <= 1){
    alert('これ以上削除出来ません');
    return;
  }
  //リストボックスの削除
  var sel = document.getElementById("sel");
  var idx = sel.selectedIndex;
  sel.remove(idx);

  //配列の要素削除＆詰め直し処理
  var JsonProgramArray = sessionStorage.getItem('programarray');
  var ProgramArray = JSON.parse(JsonProgramArray);
  ProgramArray.splice(idx, 1);
  JsonProgramArray = JSON.stringify(ProgramArray);
  sessionStorage.setItem('programarray', JsonProgramArray);

  var JsonNameArray = sessionStorage.getItem('namearray');
  var NameArray = JSON.parse(JsonNameArray);
  NameArray.splice(idx, 1);
  JsonNameArray = JSON.stringify(NameArray);
  sessionStorage.setItem('namearray', JsonNameArray);

  //削除後CodeMirrorに別の保存中のプログラムを表示
  idx = idx -1;
  if(idx < 0){
    idx = 0;
  }
  sel.options[idx].selected = true;
  selectchange();
};

//リストボックスに表示されるプログラム名の変更
function Rename(){
  var sel = document.getElementById("sel");
  var idx = sel.selectedIndex;
  var rename = document.getElementById('rename');

  if(rename.value == null || rename.value == ''){
    var name = document.getElementById('name').value;
    rename.value = name + '_' + (idx + 1);
  }

  var JsonNameArray = sessionStorage.getItem('namearray');
  var NameArray = JSON.parse(JsonNameArray);
  NameArray[idx] = rename.value;
  JsonNameArray = JSON.stringify(NameArray);
  sessionStorage.setItem('namearray', JsonNameArray);

  sel[idx].text = rename.value;
  rename.value = '';
};

//コンパイル時隠しフィールドに配列データ(json文字列)とプログラム数をセット
function compileevent(){
  selectclick(); //保存処理
  var JsonProgramArray = sessionStorage.getItem('programarray');
  var cnt = document.getElementById("sel").length;

  var programs = document.getElementById('programs');
  var n = document.getElementById('n_programs');

  programs.value = JsonProgramArray;
  n.value = cnt;
};

//Textareaの内容を保存
function save(){
    editor.save();
    ProgramArraysave();

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

    ProgramArraysave();
  };
  
  // ファイル読み込みエラー時の処理
  reader.onerror = () => {
    alert('ファイル読み込みエラー');
  };
};
  