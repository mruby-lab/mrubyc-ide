require 'sinatra'
require 'webrick'
require 'json'
require 'tempfile'
require 'open3'
require 'uri'
require 'net/http'
require 'webrick/https'

set :server_settings,
    SSLEnable: true,
    SSLCertName: [['CN', WEBrick::Utils.getservername]],
    SSLVerifyClient: OpenSSL::SSL::VERIFY_NONE

set :bind, '0.0.0.0'
set :port, 4567

get '/' do
  "It works."
end


# mrbcのバージョン情報
def get_version
  ["2.0.1", "3.2.0"]
end


# エディタ
get "/editor" do
  @versions = get_version
  @writer = :download
  @writer_name = "download"
  @writer_action = "/compile"
  @default_mrbc = @versions[-1]
  erb :editor
end
  

get "/editor/:writer" do
  @writer_name = params['writer'].downcase
  if @writer_name == 'senstick' then
    # SenStick用エディタ
    erb :senstick_editor
  else
    # 通常のエディタ
    @versions = get_version
    @writer = :download
    @writer_action = "/compile"
    @default_mrbc = @versions[-1]
    erb :editor
  end
end
 

# コンパイル＆ダウンロードの処理
post '/compile' do
  p params
  
  name = params[:name]
  program = params[:program]
  version = params[:version]
  
  mrbc_path = ""
  if version=="3.2.0" then
    mrbc_path = "/bin/mrbc3.2.0"
  elsif version=="2.0.1" then
    mrbc_path = "/bin/mrbc2.0.1"
  else
    mrbc_path = "/bin/mrbc3.2.0"    # デフォルトのコンパイラ
  end
  
  # プログラム名が指定されなかった場合
  if name=="" then
    name = "default"
  end
  
  Tempfile.create([name, '.rb']) do |f|
    #プログラムをtmpファイルに保存
    path = f.path
    fname = File.basename(path, '.*')
    f.puts program
    f.rewind
    
    #tmpファイルのコンパイル
    cpcmd = "#{mrbc_path} #{path}"
    puts cpcmd
    @cpr, @cpe, @cps = Open3.capture3(cpcmd)
    #cpr:標準出力, cpe:標準エラー, cps:プロセス終了ステータス
    
    if @cpe.empty? then
      mrbpath = "/tmp/#{fname}.mrb"
      send_file(mrbpath, filename: "#{name}.mrb") 
      
    else
      puts "Error"
      erb :error
    end
    
  end
end
