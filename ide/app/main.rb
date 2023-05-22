require 'sinatra'
require 'webrick'
require 'json'

set :bind, '0.0.0.0'

get '/' do
  "It works."
end


# エディタ
get "/editor" do
  erb :editor
end
 
