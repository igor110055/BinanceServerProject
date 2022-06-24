var tradeFunc = require('./trade');
var transactionSchema = require('../Schema/transaction.schema');
var getData = require('./getData');



module.exports.transactionProcess = async (symbol1, symbol1Price, symbol2, symbol2Price, minQty, quoteAsset1, quoteAsset2) => {
    try {

        if (symbol1Price < symbol2Price) {

            await symbol1TrxSave(symbol1, symbol1Price, symbol2, symbol2Price, minQty, quoteAsset1, quoteAsset2);

        } else {

            await symbol2TrxSave(symbol1, symbol1Price, symbol2, symbol2Price, minQty, quoteAsset1, quoteAsset2);
        }
    } catch (err) {

        console.log('Transaction error', err, minQty);

    }
}




const symbol1TrxSave = async (symbol1, symbol1Price, symbol2, symbol2Price, minQty, quoteAsset1) => {

    //console.log('Symbol1', symbol1, 'Symbol2', symbol2, 'quoteAsset1', quoteAsset1, 'quoteAsset2', quoteAsset2)

    let userAsset = await getData.getAssets(quoteAsset1);

    if (userAsset >= minQty) {

        let buyResult = await tradeFunc.buy(symbol1, minQty);

        if (buyResult.status !== 0) {

            console.log('buy', symbol1, buyResult.response.status);

            console.log('......................');

            if (buyResult.response.status == 'FILLED') {

                let sellResult = await tradeFunc.sell(symbol2, minQty);

                if (sellResult.status !== 0) {

                    console.log('sell', symbol2, sellResult.response.status);

                    let trx = new transactionSchema.Transaction({
                        buyAsset: symbol1,
                        sellAsset: symbol2,
                        buyPrice: symbol1Price,
                        sellPrice: symbol2Price,
                        quantity: minQty,
                        buyOrderId: buyResult.response.orderId,
                        sellOrderId: sellResult.response.orderId,
                        buyTradeId: buyResult.response.fills[0].tradeId,
                        sellTradeId: sellResult.response.fills[0].tradeId,
                        transactionTime: sellResult.response.transactTime,
                        status: sellResult.response.status
                    });

                    await trx.save();
                } else {
                    let trx = new transactionSchema.Transaction({
                        buyAsset: symbol1,
                        sellAsset: symbol2,
                        buyPrice: symbol1Price,
                        sellPrice: symbol2Price,
                        quantity: minQty,
                        buyOrderId: 0,
                        sellOrderId: 0,
                        buyTradeId: 0,
                        sellTradeId: 0,
                        transactionTime: 0,
                        status: sellResult.response
                    });

                    await trx.save();
                }
                console.log('......................');

            }
        } else {

            let trx = new transactionSchema.Transaction({
                buyAsset: symbol1,
                sellAsset: symbol2,
                buyPrice: symbol1Price,
                sellPrice: symbol2Price,
                quantity: minQty,
                buyOrderId: 0,
                sellOrderId: 0,
                buyTradeId: 0,
                sellTradeId: 0,
                transactionTime: 0,
                status: buyResult.response
            });

            await trx.save();
        }

    } else {
        console.log('Insufficient Asset : ', quoteAsset1);

        let trx = new transactionSchema.Transaction({
            buyAsset: symbol1,
            sellAsset: symbol2,
            buyPrice: symbol1Price,
            sellPrice: symbol2Price,
            quantity: minQty,
            buyOrderId: 0,
            sellOrderId: 0,
            buyTradeId: 0,
            sellTradeId: 0,
            transactionTime: 0,
            status: `Insufficient Asset ${quoteAsset1}`
        });

        await trx.save();

        console.log('......................');
    }
}






const symbol2TrxSave = async (symbol1, symbol1Price, symbol2, symbol2Price, minQty, quoteAsset2) => {
    let userAsset = await getData.getAssets(quoteAsset2);

    //console.log('Symbol1', symbol1, 'Symbol2', symbol2, 'quoteAsset1', quoteAsset1, 'quoteAsset2', quoteAsset2)

    if (userAsset >= minQty) {
        let buyResult = await tradeFunc.buy(symbol2, minQty);

        if (buyResult.status !== 0) {

            console.log('buy', symbol2, buyResult.response.status);

            console.log('......................');

            if (buyResult.response.status == 'FILLED') {

                let sellResult = await tradeFunc.sell(symbol1, minQty);

                if (sellResult.status !== 0) {

                    console.log('sell', symbol1, sellResult.response.status);

                    let trx = new transactionSchema.Transaction({
                        buyAsset: symbol2,
                        sellAsset: symbol1,
                        buyPrice: symbol2Price,
                        sellPrice: symbol1Price,
                        quantity: minQty,
                        buyOrderId: buyResult.response.orderId,
                        sellOrderId: sellResult.response.orderId,
                        buyTradeId: buyResult.response.fills[0].tradeId,
                        sellTradeId: sellResult.response.fills[0].tradeId,
                        transactionTime: sellResult.response.transactTime,
                        status: sellResult.response.status
                    });

                    await trx.save();

                } else {
                    let trx = new transactionSchema.Transaction({
                        buyAsset: symbol2,
                        sellAsset: symbol1,
                        buyPrice: symbol2Price,
                        sellPrice: symbol1Price,
                        quantity: minQty,
                        buyOrderId: 0,
                        sellOrderId: 0,
                        buyTradeId: 0,
                        sellTradeId: 0,
                        transactionTime: 0,
                        status: sellResult.response
                    });

                    await trx.save();
                }

                console.log('......................');

            }
        } else {
            let trx = new transactionSchema.Transaction({
                buyAsset: symbol2,
                sellAsset: symbol1,
                buyPrice: symbol2Price,
                sellPrice: symbol1Price,
                quantity: minQty,
                buyOrderId: 0,
                sellOrderId: 0,
                buyTradeId: 0,
                sellTradeId: 0,
                transactionTime: 0,
                status: sellResult.response
            });

            await trx.save();
        }
    } else {
        console.log('Insufficient Asset : ', quoteAsset2);

        let trx = new transactionSchema.Transaction({
            buyAsset: symbol2,
            sellAsset: symbol1,
            buyPrice: symbol2Price,
            sellPrice: symbol1Price,
            quantity: minQty,
            buyOrderId: 0,
            sellOrderId: 0,
            buyTradeId: 0,
            sellTradeId: 0,
            transactionTime: 0,
            status: `Insufficient Asset ${quoteAsset2}`
        });

        await trx.save();

        console.log('......................');
    }
}
