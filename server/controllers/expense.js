const ExpenseSchema = require("../models/ExpenseModel");



exports.addExpense = async (req, res) => {
        const { title, amount, type, date, category, description } = req.body;

        const Expense = ExpenseSchema({
            title,
            amount,
            type,
            date,
            category,
            description
        }); // create a new instance of the ExpenseSchema

        try {
            // validations
            if (!title || !date || !category || !description) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (amount <= 0 || !amount === "number") {
                return res.status(400).json({ message: 'Amount must be a positive number' });
            }
            await Expense.save(); // save the data to the database
            res.status(200).json({ message: 'Expense added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }

exports.getExpense = async (req, res) => { 
    try {
        const expenses = await ExpenseSchema.find().sort({ createdAt: -1 }); //sort the data in descending order
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