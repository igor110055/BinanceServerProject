var Transaction = require('../Schema/transaction.schema');

const per_page = 10;

const getAllTransactions = async (req, res) => {
    let page = req.query.page;

    const trxns = await Transaction.Transaction.find()
        .limit(per_page * 1)
        .skip((page - 1) * per_page)
        .exec();

    res.send(trxns);
}

module.exports = {
    getAllTransactions,
}