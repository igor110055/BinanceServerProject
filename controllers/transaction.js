var Transaction = require('../Schema/transaction.schema');

const getAllTransactions = async (req, res) => {
    const trxns = await Transaction.Transaction.find()
	res.send(trxns);
}

module.exports = {
    getAllTransactions,
}