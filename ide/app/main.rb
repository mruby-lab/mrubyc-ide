require 'sinatra'
require 'webrick'
require 'json'
require 'rest-client'

# $api = 'http://localhost:4566'
$api = 'http://http://mrubyc-ide.ddns.net:4566'

set :bind, '0.0.0.0'
set :port, 4567

get '/' do
  "It works."
end


# mrbcのバージョン情報
def get_version
  res = RestClient.get("#{$api}/versions")
  return JSON.parse(res.body)
end


# エディタ
get "/editor" do
  @versions = get_version
  p @versions
  @writer = :download
  @writer_name = :download
  @writer_action = "/compile"
  @default_mrbc = @versions[-1]
  erb :editor
end
  

get "/editor/:writer" do
  @versions = get_version
  case params['writer']
  when 'ble' then
    @writer = :ble
    @writer_name = "BLE"
    @writer_action = "/send_ble"
    @default_mrbc = @versions[-1]
  when 'senstick' then
    @writer = :ble
    @writer_name = "SenStick"
    @writer_action = "/send_ble"
    @default_mrbc = "2.0.1"
  else
    @writer = :download
    @writer_name = :download
    @writer_action = "/compile"
    @default_mrbc = @versions[-1]
  end
  erb :editor
end
 

# コンパイル＆ダウンロードの処理
# mrbcコンテナのサービスを使う
post "/compile" do
  body = { version: @params['version'],
           program: @params['program'],
           name: @params['name'] }
  res = RestClient.post("#{$api}/compile", body)
  puts res
end


# BLE転送の処理
post "/send_ble" do
  "/send_ble"
end

