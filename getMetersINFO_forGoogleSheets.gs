// SwitchBotAPI v1.1
const token = PropertiesService.getScriptProperties().getProperty("SWITCHBOT_TOKEN");
const secret = PropertiesService.getScriptProperties().getProperty("SWITCHBOT_SECRET");
const baseURL = "https://api.switch-bot.com/v1.1/";

// GoogleSheet
const sheetId = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_ID");
const sheetName = PropertiesService.getScriptProperties().getProperty("GOOGLE_SHEETS_NAME");

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

// デバイスリストの中から温湿度計のデバイスIDを取得
function getMetersList(){
  const responseJson = getDevicesList()
  const metersList = [];
  for(i=0; i<responseJson['body']['deviceList'].length; i++){
    if (responseJson['body']['deviceList'][i]["deviceType"] == "Meter"){
      metersList.push(responseJson['body']['deviceList'][i].deviceId); 
    }
  }
  //metersList.forEach ((deviceID) => { console.log(deviceID) });
  return metersList;
}

// 温湿度計のステータスをGoogleSheetへ入力
function getMetersINFO(){
  const metersList = getMetersList();
  //デバイスの数だけデータの取得を繰り返し
  metersList.forEach ((deviceID) => {
    //console.log("getMetersINFO.deviceID \n", deviceID)
    const response = UrlFetchApp.fetch(baseURL + "devices/" + deviceID + "/status", getOptions()); //温湿度計のステータスを取得
    //console.log("getMetersINFO.response \n", response)
    const responseJson=JSON.parse(response.getContentText());
    const temp = responseJson['body']['temperature']
    const rhumidity = responseJson['body']['humidity']
    const ahumidity = 217*(6.1078*10**(7.5*temp/(temp+237.3)))/(temp+273.15)*rhumidity/100 //絶対湿度（g/m^3)を算出
    //シート取得
    const spreadsheet = SpreadsheetApp.openById(sheetId); 
    const sheet = spreadsheet.getSheetByName(sheetName);
    const date = new Date();
    //データ入力
    sheet.appendRow([deviceID,date,temp,rhumidity,ahumidity]);
  });
}