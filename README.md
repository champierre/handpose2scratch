## サポートのお願い

Handpose2Scratchは2020年よりオープンソースかつ無料で提供しており、学校や各種プログラミング教室はじめさまざまな場所で利用されております。継続して開発を続けるためには、使っていただいている皆さまからの支援が必要です。<br />
[一杯のコーヒー](https://www.buymeacoffee.com/champierre)という形でサポートをいただけると大変ありがたく思います。

<a href="https://www.buymeacoffee.com/champierre"><img src="https://user-images.githubusercontent.com/10215/215533679-bb41b1a2-ba42-4eb6-9f9a-6d0bd67f3aaa.png"></a>

# Handpose2Scratch

Handpose2Scratchは、Webカメラのみで手や指のトラッキングができるScratch3向け拡張機能です。

MediaPipeとTensorFlow.jsが提供するhandposeパッケージを利用しています。背景にある技術を知りたい方は、"[Face and hand tracking in the browser with MediaPipe and TensorFlow.js](https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html)"を参照ください。

*他の言語で読む: [English](README.en.md), [日本語](README.md).*

## デモ動画

  <img src="images/handpose.gif" width="600" />

## 使用方法

- Chromeで https://stretch3.github.io/ (ほかのオリジナル拡張機能が使用できます)または https://champierre.github.io/handpose2scratch/ を開きます。
- 拡張機能一覧よりHandpose2Scratchを選びます。

## サンプルプロジェクト

https://github.com/champierre/handpose2scratch/raw/master/sample_projects/handpose.sb3

<img src="images/ja/sample_project.png" />

## ライセンス

Handpose2Scratchには [AGPL-3.0 license](./LICENSE) が適用されます。オープンソースで、誰でも自由に利用できます。授業やワークショップで使用でき、商用利用も認められています。あなたやあなたの生徒さんがHandpose2Scratchを使用して何か面白いプロジェクトを作成したときは、ぜひハッシュタグ #handpose2scratch を使用してSNSで共有するか、連絡先までお知らせください。以下の「活用例」に追加させていただきます。

## 活用例

- [Handpose2Scratch で手を握る/開く動作や指を立てた本数を検出・判別する](https://www.youtube.com/watch?v=jxgwA770qOQ)

## 推奨環境

- OS
  - Windows 8 (TBD)
  - Windows 10 (TBD)
  - MacOS
  - iOS
- Browser
  - Chrome
  - Safari(iOS)

Chrome の拡張機能を使用している場合に、正常に動作しないことがあるので、もしうまく動かないという場合には、[ゲストモード](https://support.google.com/chrome/answer/6130773?hl=ja)に切り替えてお試しください。

## 開発者向け

1. Setup LLK/scratch-gui on your computer.

  ```
  % git clone git@github.com:LLK/scratch-gui.git
  % cd scratch-gui
  % npm install
  ```

2. In scratch-gui folder, clone Handose2Scratch. You will have handpose2scratch folder under scratch-gui.

  ```
  % git clone git@github.com:champierre/handpose2scratch.git
  ```

3. Run the install script.

  ```
  % sh handpose2scratch/install.sh
  ```

4. Run Scratch, then go to http://localhost:8601/.

  ```
  % npm start
  ```
