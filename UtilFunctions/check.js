
module.exports.lotSizeCheck = (qty, minQtyGiven, stepSize,maxQtyGiven) => {

    let value = (qty - minQtyGiven) % stepSize;
    value = value.toFixed(1);

    if (value < 0.1 && qty >= minQtyGiven && qty <= maxQtyGiven) {
        return 1;
    } else {
        return 0;
    }
}
