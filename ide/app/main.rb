require 'sinatra'
require 'webrick'
require 'json'
require 'uri'
require 'net/http'
require 'webrick/https'

set :server_settings,
    SSLEnable: true,
    SSLCertName: [['CN', WEBrick::Utils.getservername]]


#$api = 'http://host.docker.internal:4566'
#上記URLは開発環境用
$api = 'https://mrubyc-ide.ddns.net:4566'

set :bind, '0.0.0.0'
set :port, 4567

get '/' do
  "It works."
end


# mrbcのバージョン情報
def get_version
  uri = URI("#{$api}/versions")
  http = Net::HTTP.new(uri)
  http.use_ssl = true
  res = http.get_response(uri)
  return JSON.parse(res.body)
end


# エディタ
get "/editor" do
  @versions = get_version
  @writer = :download
  @writer_name = :download
  @writer_action = "/compile"
  @default_mrbc = @versions[-1]
  erb :editor
end
  

get "/editor/:writer" do
  case params['writer'].downcase
  when 'ble' then
    @versions = get_version
    @writer = :ble
    @writer_name = "BLE"
    @writer_action = "/send_ble"
    @default_mrbc = @versions[-1]
    erb :editor
  when 'senstick' then
#    @writer = :ble
#    @writer_name = "SenStick"
#    @writer_action = "/send_ble"
#    @default_mrbc = "2.0.1"
    erb :senstick_editor
  else
    @versions = get_version
    @writer = :download
    @writer_name = :download
    @writer_action = "/compile"
    @default_mrbc = @versions[-1]
    erb :editor
  end
end
 

# コンパイル＆ダウンロードの処理
# mrbcコンテナのサービスを使う
post "/compile" do
  uri = URI("#{$api}/compile")
  http = Net::HTTP.new(uri)
  http.use_ssl = true
  res = http.post_form('version' => @params['version'],
                        'program' => @params['program'],
                            'name' => @params['name'])
  content_type 'application/octet-stream'
  headers "Content-Disposition" => "attachment;filename=\"#{@params['name']}.mrb\""
  res.body
end

