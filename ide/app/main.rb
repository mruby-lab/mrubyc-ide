require 'sinatra'
require 'webrick'
require 'json'
require 'tempfile'
require 'open3'
require 'uri'
require 'net/http'
require 'webrick'
require 'webrick/https'
require 'openssl'

if File.exist?("/root/fullchain.pem") then
  # 証明書
  options = {
    :SSLEnable => true,
    :SSLCertificate => OpenSSL::X509::Certificate.new(File.open("/root/fullchain.pem")),
    :SSLPrivateKey => OpenSSL::PKey::EC.new(File.read("/root/privkey.pem")),
  }
  set :port, 4567
  set :environment, :production
  set :bind, '0.0.0.0'
  set :server_settings, options
else
  # オレオレ認証
  options = {
    SSLEnable: true,
    SSLCertName: [['CN', WEBrick::Utils.getservername]],
    SSLVerifyClient: OpenSSL::SSL::VERIFY_NONE
  }

  set :port, 4567
  set :bind, '0.0.0.0'
  set :environment, :production
  set :bind, '0.0.0.0'
  set :server_settings, options
end

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
#  p params
  
  name = params[:name]
  program = params[:program]
  version = params[:version]
  if params.has_key?(:programs) then
    programs = JSON.parse(params[:programs])
    n_programs = params[:n_programs]
  else 
    # 旧paramsへの対応
    programs = [program]
    n_programs = "1"
  end

  mrbc_path = ""
  if version=="3.2.0" then
    mrbc_path = "/root/mrbc3.2.0"
  elsif version=="2.0.1" then
    mrbc_path = "/root/mrbc2.0.1"
  else
    mrbc_path = "/root/mrbc3.2.0"    # デフォルトのコンパイラ
  end
  
  # プログラム名が指定されなかった場合
  if name=="" then
    name = "default"
  end
  # .rb ファイルを作成する
  mrbfiles = []
  @errormsg = []
 
  n_programs.to_i.times do |i|
    fp = Tempfile.create([name, ".rb"])
    fp.puts programs[i]
    fp.rewind

    # .rb ファイルのコンパイル
    cpcmd = "#{mrbc_path} #{fp.path}"
    puts cpcmd
    @cpr, @cpe, @cps = Open3.capture3(cpcmd)
    #cpr:標準出力, cpe:標準エラー, cps:プロセス終了ステータス
    
    if @cpe.empty? then
      mrbpath = fp.path.gsub(/\.rb/, ".mrb")
      mrbfiles << mrbpath
    else
      puts "Error: #{@cpe}"
      @errormsg[i] = @cpe
      #erb :error
    end
  end

  p mrbfiles

  if @errormsg.size != 0 then
    erb :error
  elsif mrbfiles.size == 1 then
    send_file mrbfiles[0], {:type => 'application/octet-stream', :filename => "#{name}.mrb"}
  else
    # 複数ファイルを結合する
    mrbsize = []
    fp = Tempfile.create([name, ".mrb"], binmode: true)
    8.times do
      fp.write("\0")
    end
    # mrbファイルを結合する
    mrbfiles.each_with_index do |file, i|
      if file then
        File.open(file, binmode: true) do |mrb|
          mrbsize[i] = mrb.size
          fp.write mrb.read
        end
      end
    end
    mrbsize.each_with_index do |size, i| 
      fp.pos = i*2
      fp.write size%256
      fp.write size/256
    end
    # ファイルを送信する
    send_file fp.path, {:type => 'application/octet-stream', :filename => "#{name}.mrb"}
  end
end
