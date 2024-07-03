const IncomeSchema = require("../models/incomeModel");
const AccountSchema = require("../models/accountsModel");



exports.addIncome = async (req, res) => {
        const { title, amount, type, date, category, description, accountId } = req.body;

        const Income = IncomeSchema({
            title,
            amount,
            type,
            date,
            category,
            description,
            account: accountId

        }); // create a new instance of the IncomeSchema

        try {
            // validations
            if (!title || !date || !category || !description || !accountId) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (amount <= 0 || !amount === "number") {
                return res.status(400).json({ message: 'Amount must be a positive number' });
            }
            //await Income.save(); 
            const savedIncome = await Income.save(); // save the data to the database

            // Find the account and update it with the new income
            const account = await AccountSchema.findById(accountId);
            account.incomes.push(savedIncome._id);
            await account.save();


            res.status(200).json({ message: 'Income added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }

exports.getIncome = async (req, res) => { 
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 }); //sort the data in descending order
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.deleteIncome = async (req, res) => {
    const {id} = req.params; // get the id from the request parameters
    console.log(id)
    IncomeSchema.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({ message: 'Income deleted successfully' });
        }) // find the data by id and delete it
        .catch ((error) => {
            res.status(500).json({ message: 'Server Error', error });
        });
}