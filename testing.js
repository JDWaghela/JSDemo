function convertToFixed(value, precision = 0) {
    if (typeof value === "number") {
        return value.toFixed(precision);
    }
    return Number(value)?.toFixed(precision);
};

//Get pricing details of the products
function GetPricingData(basketProducts, products) {
    const subTotal = GetTotal(basketProducts, 'derivedPriceWithSubTotal');
    const totalTaxValue = GetTotal(basketProducts, 'derivedTax');
    const promoDiscount = GetTotalPromoDiscount(basketProducts);
    const freeProductsPromo = GetTotalFreePromoDiscount(products?.freeProducts);
    let contractualDiscount = GetTotal(basketProducts, "contractualDiscount");
    const totalPromoDiscount = promoDiscount + freeProductsPromo;
    const totalSave = totalPromoDiscount + contractualDiscount;
    const subTotalValue = subTotal + freeProductsPromo;
    const netAmount = subTotalValue - totalPromoDiscount - contractualDiscount;
    const finalValue = subTotalValue + totalTaxValue - totalSave;
    const finalAmount = convertToFixed(finalValue, 0);

    let result = {
        subTotalValue,
        totalTaxValue,
        contractualDiscount,
        totalPromoDiscount,
        totalSave,
        netAmount,
        finalAmount,
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
function GetTotalPromoDiscount(basketProducts) {
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


// Create order from  cart products, and customer details. this method will return order request...................

function GetOrderPricingData(cartProducts,customer,currentStore,deliveryEstimateDeliveryDate) {
  const requestCartItems = GetRequestCartItem(cartProducts);
  const subTotalValue = GetTotal(requestCartItems, "subTotal");
  const taxAmountValue = GetTotal(requestCartItems, "tax");
  const subTotal = convertToFixed(subTotalValue, 2);
  const taxAmount = convertToFixed(taxAmountValue, 2);
  const totalDiscount = GetTotal(requestCartItems, "discountedPrice");
  const totalPriceValue = +subTotal + +taxAmount - +totalDiscount;
  const totalPrice = convertToFixed(totalPriceValue, 0);
//   const userAddress = GetUserAddress(customer, currentStore);
//   const todayDate = GetCurrentDateInServerFormat();

    let result = {
    orderType: 'ZOR',
    orderDate: new Date(),
    subtotal: subTotal,
    productDiscounts: totalDiscount,
    totalTax: taxAmount,
    totalPrice: totalPrice,
//     billingAddress: userAddress,
    browserCart: true,
    cartItems: requestCartItems,
        estimatedDeliveryDate: deliveryEstimateDeliveryDate
    }
    sendData(result);
}


// Get cart item in request format from cart Products.
function GetRequestCartItem(cartProducts) {
  const cartItems = cartProducts?.cartproducts?.map((cartProduct) => {
    const subTotal = parseFloat(cartProduct?.derivedPrice ?? 0);
    const tax = parseFloat(cartProduct?.derivedTax ?? 0);
    const discountedPrice = cartProduct?.contractualDiscount;
    const priceAfterDiscount = +subTotal + +tax - +discountedPrice;
    const finalPrice = roundOfNumberPrecisely(priceAfterDiscount);
    const saleUoms = {
      saleUomsName: cartProduct?.product?.saleUomsName,
      saleUomsCode: cartProduct?.product?.saleUomsCode,
    };
    return {
      id: cartProduct?.id,
      externalId: cartProduct?.product?.externalId ?? "",
      categoryId: cartProduct?.product?.categoryId,
      isPromotional: false,
      baseUOM: cartProduct?.product?.baseUOM,
      saleUoms: saleUoms,
      conversionMulitplierToBase:
        cartProduct?.product?.conversionMultiplierToBase,
      quantity: cartProduct?.quantity,
      basePrice: cartProduct?.product.basePrice,
      finalPrice: finalPrice,
      subTotal: subTotal,
      tax: tax,
      discountedPrice: discountedPrice,
    };
  });
    
function roundOfNumberPrecisely(num){
  return Math.round(num * 1000000) / 1000000;
};
    
function sendData(data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
