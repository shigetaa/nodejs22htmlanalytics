# HTMLの解析

HTMLページのリンクと画像の抽出

## スクレイピングしよう

Node.jsを使って、スクレイピングをするのに便利なのが「cheerio-httpcli」というモジュールです。
このモジュールを使うと、ファイルを手軽にダウンロードできるだけではなく、jQuery のように要素を取り出すことが出来るのです。
また、Webページの文字コードも自動判定して読み込んでくれます。
まずは、Node.jsのパッケージマネージャーである npm でモジュールをインストールしてみます。

```bash
npm i cheerio-httpcli
```

## HTML ファイルのリンクを抽出してみます

cheerio-httpcli モジュールの特徴として、WebからHTMLを取得後、内容を解析して、CSSセレクタで任意の要素を検索出来るという機能があります。
そこで、cheerio-httpcli モジュールでHTMLからリンクされているURLの一覧を表示する簡単なプログラムを getpage.js と言うファイル名で作成してみます。

```javascript
var client = require('cheerio-httpcli');
var URL = require('url');

var url = "http://www.aozora.gr.jp/index_pages/person81.html";
var param = {};
client.fetch(url, param, function (err, $, res) {
 if (err) { console.log("Error:", err); return; }
 // リンクを抽出して表示
 $("a").each(function (idx) {
  var text = $(this).text();
  var href = $(this).attr('href');
  if (!href) { return; }
  // 相対パスを絶対パスに直す
  var href2 = URL.resolve(url, href);
  console.log(text + ":" + href);
  console.log("  => " + href2);
 });
});
```

以下のコマンドを実行するとリンク一覧が表示されます。

```bash
node getpage.js
```

## request モジュールをインストール

次に画像をダウンロードを行う際に、便利なモジュールとして、request モジュールをインストールしてみます

```bash
npm i request
```

## 画像ファイルを抽出してみます

上記の技術を流用してリンクされている画像をすべてダウンロードするプログラムを getpageimage.js と言うファイル名で作成してみます。

```javascript
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var URL = require('url');
// ダウンロード保存先ディレクトリ
var savedir = __dirname + "/img";
if (!fs.existsSync(savedir)) {
 fs.mkdirSync(savedir);
}
// HTMLファイルを指定
var url = encodeURI("http://ja.wikipedia.org/wiki/イヌ");
var param = {};
client.fetch(url, param, function (err, $, res) {
 if (err) { console.log("Error:", err); return; }
 // リンクを抽出して表示
 $("img").each(function (idx) {
  var src = $(this).attr('src');
  // 相対パスを絶対パスに変換
  src = URL.resolve(url, src);
  // 保存用のファイル名を作成
  var fname = URL.parse(src).pathname;
  fname = savedir + "/" + fname.replace(/[^a-zA-Z0-9\.]+/g, '_');
  // ダウンロード
  request(src).pipe(fs.createWriteStream(fname));
 });
});
```

以下のコマンドを実行すると画像をすべてダウンロードします

```bash
node getpageimage.js
```
