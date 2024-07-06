const Expense = require("../models/ExpenseModel");
const Accounts = require("../models/accountsModel");



exports.addExpense = async (req, res) => {
    const { title, amount, type, date, category, description, accountId } = req.body;

    const expense = new Expense({
        title,
        amount,
        type,
        date,
        category,
        description,
        account: accountId
    }); // create a new instance of the ExpenseSchema

    try {
        // validations
        if (!title || !date || !category || !description || !accountId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount <= 0 || typeof amount !== "number") {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const savedExpense = await expense.save(); // save the data to the database
        const account = await Accounts.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
        await account.updateBalanceAfterAddingExpense(savedExpense._id);

        res.status(200).json({ message: 'Expense added successfully', expense: savedExpense});
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.getExpense = async (req, res) => { 
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 }); //sort the data in descending order
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}
exports.deleteExpense = async (req, res) => {
    const {id} = req.params; // get the id from the request parameters
    console.log(id)
    ExpenseSchema.findByIdAndDelete(id)
        .then((Expense) => {
            res.status(200).json({ message: 'Expense deleted successfully' });
        }) // find the data by id and delete it
        .catch ((error) => {
            res.status(500).json({ message: 'Server Error', error });
        });
}