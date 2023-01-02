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
  if (key) {
    var total;
    if (products.length > 0) {
      total = products.reduce(
        (prev, curr) =>
          parseFloat(prev) + parseFloat(curr[key] ? curr[key] : 0),
        0,
      );
    }
    return total;
  } else {
    return 0;
  }
}

//Get total of specific key from an array. Note:- pass key in String format!
function GetTotalValue(products, key) {
  let result=0;
  let key1=key.toString();
  if (key1 && products?.length > 0) {
      result = products.reduce(
        (prev, curr) =>
          parseFloat(prev) + parseFloat(curr[key1] ? curr[key1] : 0),
        0,
      );
  }
  sendData(result);
}

function sendData(data) {
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
