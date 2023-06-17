FROM nodered/node-red:latest


COPY node-red-contrib-mrubyc-rboard ./node-red-contrib-mrubyc-rboard

RUN npm install ./node-red-contrib-mrubyc-rboard


#COPY node-red-contrib-original ./node-red-contrib-original

#RUN npm install ./node-red-contrib-original


#ノード整理

#common
RUN rm ./node_modules/@node-red/nodes/core/common/05-junction.html \
    ./node_modules/@node-red/nodes/core/common/05-junction.js \
    ./node_modules/@node-red/nodes/core/common/25-catch.html \
    ./node_modules/@node-red/nodes/core/common/25-catch.js \
    ./node_modules/@node-red/nodes/core/common/25-status.html \
    ./node_modules/@node-red/nodes/core/common/25-status.js \
    ./node_modules/@node-red/nodes/core/common/60-link.html \
    ./node_modules/@node-red/nodes/core/common/60-link.js \
    ./node_modules/@node-red/nodes/core/common/98-unknown.html \
    ./node_modules/@node-red/nodes/core/common/98-unknown.js

#function
RUN rm ./node_modules/@node-red/nodes/core/function/16-range.html \
    ./node_modules/@node-red/nodes/core/function/16-range.js \
    ./node_modules/@node-red/nodes/core/function/89-trigger.html \
    ./node_modules/@node-red/nodes/core/function/89-trigger.js \
    ./node_modules/@node-red/nodes/core/function/90-exec.html \
    ./node_modules/@node-red/nodes/core/function/90-exec.js \
    ./node_modules/@node-red/nodes/core/function/rbe.html \
    ./node_modules/@node-red/nodes/core/function/rbe.js

#network
RUN rm ./node_modules/@node-red/nodes/core/network/05-tls.html \
    ./node_modules/@node-red/nodes/core/network/05-tls.js \
    ./node_modules/@node-red/nodes/core/network/06-httpproxy.html \
    ./node_modules/@node-red/nodes/core/network/06-httpproxy.js \
    ./node_modules/@node-red/nodes/core/network/10-mqtt.html \
    ./node_modules/@node-red/nodes/core/network/10-mqtt.js \
    ./node_modules/@node-red/nodes/core/network/21-httpin.html \
    ./node_modules/@node-red/nodes/core/network/21-httpin.js \
    ./node_modules/@node-red/nodes/core/network/21-httprequest.html \
    ./node_modules/@node-red/nodes/core/network/21-httprequest.js \
    ./node_modules/@node-red/nodes/core/network/22-websocket.html \
    ./node_modules/@node-red/nodes/core/network/22-websocket.js \
    ./node_modules/@node-red/nodes/core/network/31-tcpin.html \
    ./node_modules/@node-red/nodes/core/network/31-tcpin.js \
    ./node_modules/@node-red/nodes/core/network/32-udp.html \
    ./node_modules/@node-red/nodes/core/network/32-udp.js

#parsers
RUN rm ./node_modules/@node-red/nodes/core/parsers/70-CSV.html \
    ./node_modules/@node-red/nodes/core/parsers/70-CSV.js \
    ./node_modules/@node-red/nodes/core/parsers/70-HTML.html \
    ./node_modules/@node-red/nodes/core/parsers/70-HTML.js \
    ./node_modules/@node-red/nodes/core/parsers/70-JSON.html \
    ./node_modules/@node-red/nodes/core/parsers/70-JSON.js \
    ./node_modules/@node-red/nodes/core/parsers/70-XML.html \
    ./node_modules/@node-red/nodes/core/parsers/70-XML.js \
    ./node_modules/@node-red/nodes/core/parsers/70-YAML.html \
    ./node_modules/@node-red/nodes/core/parsers/70-YAML.js

#sequence
#RUN rm -R ./node_modules/@node-red/nodes/core/sequence

RUN rm ./node_modules/@node-red/nodes/core/sequence/17-split.html \
    ./node_modules/@node-red/nodes/core/sequence/17-split.js \
    ./node_modules/@node-red/nodes/core/sequence/18-sort.html \
    ./node_modules/@node-red/nodes/core/sequence/18-sort.js \
    ./node_modules/@node-red/nodes/core/sequence/19-batch.html \
    ./node_modules/@node-red/nodes/core/sequence/19-batch.js

#storage
#RUN rm ./node_modules/@node-red/nodes/core/storage/


