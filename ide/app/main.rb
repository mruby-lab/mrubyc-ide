require 'sinatra'
require 'webrick'
require 'json'
require 'tempfile'
require 'open3'
require 'uri'
require 'net/http'
require 'webrick/https'
require 'openssl'


if File.exist?("fullchain.pem") then  
  # SSLキーあり
  set :server_settings,
    SSLEnable: true,
    SSLCertificate: OpenSSL::X509::Certificate.new File.read 'fullchain.pem'
    SSLPrivateKey: OpenSSL::PKey::RSA.new File.read 'privkey.pem'
    # 旧キー
    # SSLCertificate: OpenSSL::X509::Certificate.new(File.open("certificate.crt").read),
    # SSLPrivateKey: OpenSSL::PKey::RSA.new(File.open("private.key").read)
  else
  # オレオレ認証
  set :server_settings,
    SSLEnable: true,
    SSLCertName: [['CN', WEBrick::Utils.getservername]],
    SSLVerifyClient: OpenSSL::SSL::VERIFY_NONE
end

set :bind, '0.0.0.0'
set :port, 4567

# キャッシュを禁止する
after do
  cache_control :no_cache
end

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
  elsif @writer_name == 'rboard' then
    # RBoard用エディタ
    erb :rboard_editor
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

  programs = params[:programs]
  n_programs = params[:n_programs]
  
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

  # .rb ファイルを作成する
  mrbfiles = []
  n_programs.to_i.times do |i|
    Tempfile.create([name, ".rb"]) do |fp|
      fp.puts programs[i]
      fp.rewind

      # .rb ファイルのコンパイル
      cpcmd = "#{mrbc_path} #{fp.path}"
      puts cpcmd
      @cpr, @cpe, @cps = Open3.capture3(cpcmd)
      #cpr:標準出力, cpe:標準エラー, cps:プロセス終了ステータス
    
      if @cpe.empty? then
        mrbpath = fp.path.gsub(/\.rb/, ".mrb")
        mrbfiles << fp.path
      else
        puts "Error"
        erb :error
      end
    end

  end

p mrbfiles  
end
