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

function GetSubTotal(basketProducts) {
  let result = GetTotal(basketProducts, 'derivedPriceWithSubTotal');
  sendData(result);
}

//Get total of specific key from an array. Note:- pass key in String format!
function GetTotal(products, key) {
  let result=0;
  if (key && products?.length > 0) {
      result = products.reduce(
        (prev, curr) =>
          parseFloat(prev) + parseFloat(curr[key] ? curr[key] : 0),
        0,
      );
  }
  sendData(result);
}

function sendData(data) {
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
