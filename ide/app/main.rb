require 'sinatra'
require 'webrick'
require 'json'

set :bind, '0.0.0.0'

get '/' do
  "It works."
end


# エディタ
get "/editor" do
  @writer = :download
  @writer_name = :download
  @writer_action = "/compile"
  erb :editor
end
  

get "/editor/:writer" do
  case params['writer']
  when 'ble' then
    @writer = :ble
    @writer_name = "BLE"
    @writer_action = "/send_ble"
  when 'senstick' then
    @writer = :ble
    @writer_name = "SenStick"
    @writer_action = "/send_ble"
  else
    @writer = :download
    @writer_name = :download
    @writer_action = "/compile"
  end
  erb :editor
end
 

# コンパイル＆ダウンロードの処理
# mrbcコンテナのサービスを使う
post "/compile" do
  "/compile"
end


# BLE転送の処理
post "/send_ble" do
  "/send_ble"
end

