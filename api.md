# コンテナとAPI

## mrbcコンテナ

- 以下の mrubyコンパイラのAPIを提供している

|リクエスト|説明|
|---|---|
|GET /|動作確認のため|
|GET /versions|対応しているmrbcのバージョンを返す|
|POST /compile|ソースコードをコンパイルする|

## ideコンテナ

- mruby/cのエディタ、書き込みツールを提供する

