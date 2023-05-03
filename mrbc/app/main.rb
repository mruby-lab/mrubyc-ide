require 'sinatra'
require 'webrick'
require 'json'

set :bind, '0.0.0.0'

get '/' do
  "working..."
end

# TODO: バージョン情報を返す機能を実装する
get '/versions' do
    content_type :json
    a = ["3.2.0"]
    a.to_json
end

# TODO: コンパイル部分を実装する
post '/compile' do
end

