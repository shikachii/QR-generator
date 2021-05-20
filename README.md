# QR-generator
パソコンで閲覧しているページのURLをQRコードとして表示することでPC-スマホ間のURL共有を便利にするChrome拡張

QRコード生成は[JIX X 0510](https://www.jisc.go.jp/app/jis/general/GnrJISNumberNameSearchList?show&jisStdNo=X0510)に基づき、1から実装されています。

## いつ使うの？
パソコンでインターネットサーフィンしている際に「あっ！このページスマホで見たい！」といったことはありませんか？

QR-generatorは今あなたが見ているWebページのQRコードをすぐに生成して簡単にスマホにURLを共有できます！

(今ではChromeの標準機能となっていますが…)

## 導入方法
1. 好きなディレクトリにソースコードをダウンロードします
`$ git clone https://github.com/shikachii/QR-generator.git`

2. `chrome://extensions`に移動し、画面右上のデベロッパーモードを有効にします

3. 左上の`パッケージ化されていない拡張機能を読み込む`を押します

4. さっきダウンロードした`QR-generator`ディレクトリを選択して有効にします！

5. インストール完了！よいインターネットライフを！

## 使い方
1. QRコードを表示したいページで右クリック

2. `Convert to QR: page`を選択するとURLがQRコードになって表示
![QR-generator_ex](https://user-images.githubusercontent.com/16307592/119020097-cdb1fb00-b9d8-11eb-8693-42b94175f6d1.png)

3. 表示されたQRコードをスマホなどで読み取る
![QR-generator_qr](https://user-images.githubusercontent.com/16307592/119020729-8c6e1b00-b9d9-11eb-8967-b7cc3c43e017.png)

4. おめでとうございます！あなたのスマホに今あなたがパソコンで見ていたWebページが表示されています！

## うまく読み取れませんか？
現在いくつかのバグがあり、正しくQRコードが表示できない場合があります。
今後は[QRVisualizer](https://github.com/shikachii/QRVisualizer)で開発を進めますのでこちらもチェックしてください！

## 開発に協力したい！
ありがとうございます！
お気持ちはありがたいのですが現在QR-generatorは制作を停止し、React+Typescriptで書き直しをしています！
[QRVisualizer](https://github.com/shikachii/QRVisualizer)をご覧ください！

## ライセンス
MIT License
