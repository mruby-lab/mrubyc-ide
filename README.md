# mrubyc-ide

- mruby/c のプログラミング環境
- RBoardを対象とする
    - RBoardへの書き込みはUSBシリアルを使う

## 動かし方

1. リポジトリをクローンする<br>
    `git clone https://github.com/nodered-mrubyc/mrubyc-ide.git`

1. dockerコンテナをビルドする<br>
    `docker-compose build`

1. dockerコンテナを起動する<br>
    `docker-compose up`

## 使い方

- mrubyソースコードを入力して、バイトコードを出力したい<br>
    `http://localhost/editor`


## 資料

- [コンテナ、APIについて](api.md)

