// デバイスリストの中から温湿度計のデバイスIDを取得
function getMeterList(){
  const responseJson = getDevicesList()
  const meterList = [];

  try {
    for(i=0; i<responseJson['body']['deviceList'].length; i++){
      if (responseJson['body']['deviceList'][i]["deviceType"] == "Meter"){
        meterList.push(responseJson['body']['deviceList'][i].deviceId); 
      }
    }
  } catch(e) {
    console.log("Error getMeterList: \n",e);
    console.log("responseJson : ", responseJson);
  }
  //meterList.forEach ((deviceID) => { console.log(deviceID) });
  return meterList;
}

// 温湿度計のステータスをGoogleSheetへ入力
function getMeterINFO(){
  const meterList = getMeterList();
  //デバイスの数だけデータの取得を繰り返し
  meterList.forEach ((deviceID) => {
    const response = UrlFetchApp.fetch(baseURL + "devices/" + deviceID + "/status", getOptions()); //温湿度計のステータスを取得
    const responseJson=JSON.parse(response.getContentText());
    //console.log("getMeterINFO.responseJson \n", responseJson)
    const temp = responseJson['body']['temperature']
    const rhumidity = responseJson['body']['humidity']
    const ahumidity = 217*(6.1078*10**(7.5*temp/(temp+237.3)))/(temp+273.15)*rhumidity/100 //絶対湿度（g/m^3)を算出
    //シート取得
    const spreadsheet = SpreadsheetApp.openById(sheetId); 
    const sheet = spreadsheet.getSheetByName(sheetMeter);
    const date = new Date();
    //データ入力
    sheet.appendRow([
      date,
      deviceID,
      temp,
      rhumidity,
      ahumidity
      ]);
  });
}