// globalController.js
const { getUpcomingRecurringTransactions, getNextOccurrence } = require('../utils/utils');

exports.getUpcomingTransactions = async (req, res) => {
    try {
        const { upcomingIncomes, upcomingExpenses } = await getUpcomingRecurringTransactions();
        res.status(200).json({ upcomingIncomes, upcomingExpenses });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};