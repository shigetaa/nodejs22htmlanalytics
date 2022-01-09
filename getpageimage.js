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