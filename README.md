# switchbot-gas

Google Apps Script (GAS) にてSwitchBotデバイスの情報を取得し、Google Sheets に情報を蓄積する。現状では以下を実現する。

* SwitchBot API v1.1 を利用し、保有する温湿度計のデバイスIDを取得
* 各室温時計のステータスを取得し、指定の Google Sheets へ入力
* 各プラグミニのステータスを取得し、指定の Google Sheets へ入力

## Script Property

GASプロジェクトの`プロジェクトの設定`内の`スクリプト プロパティ`にて以下を設定する

| プロパティ | 値 |
| ---- | ---- |
| SWITCHBOT_TOKEN | SwitchBotのトークン |
| SWITCHBOT_SECRET | SwitchBotのシークレット |
| GOOGLE_SHEETS_ID | 入力先となる Google Sheets のID |
| GOOGLE_SHEETS_NAME | 入力先となる Google Sheets のシート名 |

* デバイス毎に以下の命名規則で入力シート名を識別する
* 本GAS実行前に以下命名基礎に基づくシートを事前に作成する
  * 湿温度計：`GOOGLE_SHEETS_NAME` + "_Meter"
  * プラグミニ：`GOOGLE_SHEETS_NAME` + "_PlugMini"

### SwitchBotプロパティの値の取得

* SwitchBotアプリにてログイン
* アプリ内の`プロフィール`から`設定`を押下
* `開発者向けオプション`を押下
  * 表示されていない場合、`アプリバージョン`を複数回押下
* `開発者向けオプション`内のトークンとシークレットを確認

### Google Sheetsプロパティの値の取得

* 入力先となる Google Sheets を開く
* URLを確認し`https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=0`の規則に基づきIDを確認
  * 参考：[公式ドキュメント](https://developers.google.com/sheets/api/guides/concepts?hl=ja)

### GASトリガー設定

* GASプロジェクトの`トリガー`から`トリガーを追加`を押下
* `実行する関数を選択`にて実行したい関数を設定
* `イベントのソースを選択`にて`時間主導型`を選択
* `時間ベースのトリガーのタイプを選択`と`時間の間隔を選択（時間）`を好みの設定で選択して`保存`を押下