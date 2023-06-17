FROM nodered/node-red:latest


COPY node-red-contrib-mrubyc-rboard ./node-red-contrib-mrubyc-rboard

RUN npm install ./node-red-contrib-mrubyc-rboard


#COPY node-red-contrib-original ./node-red-contrib-original

#RUN npm install ./node-red-contrib-original


#ノード整理

#common
RUN rm ./node_modules/@node-red/nodes/core/common/05-junction.html
RUN rm ./node_modules/@node-red/nodes/core/common/05-junction.js

RUN rm ./node_modules/@node-red/nodes/core/common/25-catch.html
RUN rm ./node_modules/@node-red/nodes/core/common/25-catch.js

RUN rm ./node_modules/@node-red/nodes/core/common/25-status.html
RUN rm ./node_modules/@node-red/nodes/core/common/25-status.js

RUN rm ./node_modules/@node-red/nodes/core/common/60-link.html
RUN rm ./node_modules/@node-red/nodes/core/common/60-link.js

RUN rm ./node_modules/@node-red/nodes/core/common/98-unknown.html
RUN rm ./node_modules/@node-red/nodes/core/common/98-unknown.js


#function
RUN rm ./node_modules/@node-red/nodes/core/function/16-range.html
RUN rm ./node_modules/@node-red/nodes/core/function/16-range.js

RUN rm ./node_modules/@node-red/nodes/core/function/89-trigger.html
RUN rm ./node_modules/@node-red/nodes/core/function/89-trigger.js

RUN rm ./node_modules/@node-red/nodes/core/function/90-exec.html
RUN rm ./node_modules/@node-red/nodes/core/function/90-exec.js

RUN rm ./node_modules/@node-red/nodes/core/function/rbe.html
RUN rm ./node_modules/@node-red/nodes/core/function/rbe.js


#network
RUN rm ./node_modules/@node-red/nodes/core/network/05-tls.html
RUN rm ./node_modules/@node-red/nodes/core/network/05-tls.js

RUN rm ./node_modules/@node-red/nodes/core/network/06-httpproxy.html
RUN rm ./node_modules/@node-red/nodes/core/network/06-httpproxy.js

RUN rm ./node_modules/@node-red/nodes/core/network/10-mqtt.html
RUN rm ./node_modules/@node-red/nodes/core/network/10-mqtt.js

RUN rm ./node_modules/@node-red/nodes/core/network/21-httpin.html
RUN rm ./node_modules/@node-red/nodes/core/network/21-httpin.js

RUN rm ./node_modules/@node-red/nodes/core/network/21-httprequest.html
RUN rm ./node_modules/@node-red/nodes/core/network/21-httprequest.js

RUN rm ./node_modules/@node-red/nodes/core/network/22-websocket.html
RUN rm ./node_modules/@node-red/nodes/core/network/22-websocket.js

RUN rm ./node_modules/@node-red/nodes/core/network/31-tcpin.html
RUN rm ./node_modules/@node-red/nodes/core/network/31-tcpin.js

RUN rm ./node_modules/@node-red/nodes/core/network/32-udp.html
RUN rm ./node_modules/@node-red/nodes/core/network/32-udp.js


#parsers
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-CSV.html
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-CSV.js

RUN rm ./node_modules/@node-red/nodes/core/parsers/70-HTML.html
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-HTML.js

RUN rm ./node_modules/@node-red/nodes/core/parsers/70-JSON.html
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-JSON.js

RUN rm ./node_modules/@node-red/nodes/core/parsers/70-XML.html
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-XML.js

RUN rm ./node_modules/@node-red/nodes/core/parsers/70-YAML.html
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-YAML.js


#sequence
#RUN rm -R ./node_modules/@node-red/nodes/core/sequence

RUN rm ./node_modules/@node-red/nodes/core/sequence/17-split.html
RUN rm ./node_modules/@node-red/nodes/core/sequence/17-split.js

RUN rm ./node_modules/@node-red/nodes/core/sequence/18-sort.html
RUN rm ./node_modules/@node-red/nodes/core/sequence/18-sort.js

RUN rm ./node_modules/@node-red/nodes/core/sequence/19-batch.html
RUN rm ./node_modules/@node-red/nodes/core/sequence/19-batch.js


#storage
#RUN rm ./node_modules/@node-red/nodes/core/storage/