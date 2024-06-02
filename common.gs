// SwitchBotAPI v1.1
const token = PropertiesService.getScriptProperties().getProperty("SWITCHBOT_TOKEN");
const secret = PropertiesService.getScriptProperties().getProperty("SWITCHBOT_SECRET");
const baseURL = "https://api.switch-bot.com/v1.1/";

// GoogleSheet
const sheetId = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_ID");
const sheetName = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_NAME");
const sheetMeter = sheetName.concat("_Meter");
const sheetPlugMini = sheetName.concat("_PlugMini");

// headersの生成
function getHeaders() {
  const t = Date.now().toString();
  const nonce = Utilities.getUuid();
  const data = token + t + nonce;
  const sign = Utilities.base64Encode(Utilities.computeHmacSha256Signature(data, secret)).toUpperCase();
  const headers = {
    "Authorization": token,
    "sign": sign,
    "nonce": nonce,
    "t": t,
  }
  return headers;
}

// optionsの生成
function getOptions() {
  const headers = getHeaders();
  const options = {
    method: "get",
    headers: headers,
    muteHttpExceptions: true,
  }
  return options;
}

// デバイスリストの取得
function getDevicesList(){
  try {
    const response = UrlFetchApp.fetch(baseURL + "devices", getOptions());
    //console.log("getDeviceList : response\n", response.getContentText());
    const responseJson = JSON.parse(response);
    return responseJson;
  } catch(e) {
    console.log("Error: \n",e)
    return;
  }
}

// GoogleSheetへ入力
function getINFO(){
  getMeterINFO();
  getPlugMiniINFO()
}