// デバイスリストの中からプラグミニのデバイスIDを取得
function getPlugMiniList(){
  const responseJson = getDevicesList()
  const plugMiniList = [];

  try {
    for(i=0; i<responseJson['body']['deviceList'].length; i++){
      if (responseJson['body']['deviceList'][i]["deviceType"] == "Plug Mini (JP)"){
        plugMiniList.push(responseJson['body']['deviceList'][i].deviceId); 
      }
    }
  } catch(e) {
    console.log("Error getPlugMiniList: \n",e);
    console.log("responseJson : ", responseJson);
  }
  //plugMiniList.forEach ((deviceID) => { console.log(deviceID) });
  return plugMiniList;
}

// プラグミニのステータスをGoogleSheetへ入力
function getPlugMiniINFO(){
  const plugMiniList = getPlugMiniList();
  //デバイスの数だけデータの取得を繰り返し
  plugMiniList.forEach ((deviceID) => {
    const response = UrlFetchApp.fetch(baseURL + "devices/" + deviceID + "/status", getOptions()); //プラグミニのステータスを取得
    const responseJson=JSON.parse(response.getContentText());
    //console.log("getPlugMiniINFO.responseJson \n", responseJson)
    //シート取得
    const spreadsheet = SpreadsheetApp.openById(sheetId); 
    const sheet = spreadsheet.getSheetByName(sheetName);
    const date = new Date();
    //データ入力
    sheet.appendRow([deviceID,date,responseJson['body']['power'],responseJson['body']['voltage'],responseJson['body']['weight'],responseJson['body']['electricityOfDay'],responseJson['body']['electricCurrent'],responseJson['body']['version']]);
  });
}