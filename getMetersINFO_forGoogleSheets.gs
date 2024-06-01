// デバイスリストの中から温湿度計のデバイスIDを取得
function getMetersList(){
  const responseJson = getDevicesList()
  const metersList = [];

  try {
    for(i=0; i<responseJson['body']['deviceList'].length; i++){
      if (responseJson['body']['deviceList'][i]["deviceType"] == "Meter"){
        metersList.push(responseJson['body']['deviceList'][i].deviceId); 
      }
    }
  } catch(e) {
    console.log("Error getMetersList: \n",e);
    console.log("responseJson : ", responseJson);
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