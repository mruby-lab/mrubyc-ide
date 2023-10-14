require 'sinatra'
require 'webrick'

set :bind, '0.0.0.0'
set :port, 4567

get '/' do
    redirect 'https://mrubyc-ide.ddns.net'
end
  

# SSL Check
get '/.well-known/pki-validation/93874F27F46F4C52A224D3D4F121A684.txt' do
    "7B8CB73E95735DC8A596C350D4D8C329D5BF056018685C79F50AFD66A3CA3AC7\n"+
    "comodoca.com\n"+
    "c23c514a5950f5b\n"
end