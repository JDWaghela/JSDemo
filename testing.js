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

//Get pricing details of the products
function GetPricingData(basketProducts,products) {
   const subTotal = GetTotal(basketProducts, 'derivedPriceWithSubTotal');
   const totalTax = GetTotal(basketProducts, 'derivedTax');
   const promoDiscount = GetTotalPromoDiscount(basketProducts);
   const freeProductsPromo=GetTotalFreePromoDiscount(products?.freeProducts);
   let contractualDiscount = GetTotal(basketProducts, "contractualDiscount");
   let result={subTotal,
               totalTax,
               contractualDiscount,
               totalPromoDiscount: promoDiscount + freeProductsPromo
              }
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

//Get total promo discounts on all the products in cart.
function GetTotalPromoDiscount(basketProducts){
  var total = 0;
  if (basketProducts.length > 0) {
    const fixed = basketProducts.reduce(
      (prev, curr) =>
        parseFloat(prev) + parseFloat(curr?.derivedPromoDiscount?.fixed),
      0
    );
    const buyXGetY = basketProducts.reduce(
      (prev, curr) =>
        parseFloat(prev) + parseFloat(curr?.derivedPromoDiscount?.buyXGetY),
      0
    );

    total = fixed + buyXGetY;
  }
  return total;
};

function GetTotalFreePromoDiscount(freeProducts) {
  let freeProductsTotal = 0;
  if (freeProducts?.length > 0) {
    freeProductsTotal = freeProducts.reduce(
      (prev, curr) =>
        parseFloat(prev) +
        parseFloat(curr?.product?.price?.basePrice * curr?.freeProductQty),
      0
    );
  }
  return freeProductsTotal;
};
  
function sendData(data) {
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
