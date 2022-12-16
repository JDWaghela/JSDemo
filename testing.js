function calculateTotal(input1, input2) {
  let result = input1 + input2;
  let data = {type: 'calculateTotal', result};
  sendData(data);
}
function calculateVat(input1, input2) {
  let result = input1 + input2 + 10;
  let data = {type: 'calculateVat', result};
  sendData(data);
}

function sendData(data) {
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
