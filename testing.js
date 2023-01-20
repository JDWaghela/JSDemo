function calculateTotal(input1, input2) {
    let result = input1 + input2;
    let data = {
        type: 'calculateTotal',
        result
    };
    sendData(data);
}

function calculateVat(input1, input2) {
    let result = input1 + input2 + 10;
    let data = {
        type: 'calculateVat',
        result
    };
    sendData(data);
}

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
    const requestCartItems = GetRequestCartItem(basketProducts);

    let result = {
        subTotalValue,
        totalTaxValue,
        contractualDiscount,
        totalPromoDiscount,
        totalSave,
        netAmount,
        finalAmount,
        requestCartItems
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

// Get cart item in request format from cart Products.
const GetRequestCartItem = (cartProducts) => {
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
    
    
//Get cart item in request format from cart Products.
const GetRequestCartItem = (cartProducts) => {
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

function sendData(data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
