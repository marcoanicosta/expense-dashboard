const IncomeSchema = require("../models/incomeModel");



exports.addIncome = async (req, res) => {
        const { title, amount, type, date, category, description } = req.body;

        const income = IncomeSchema({
            title,
            amount,
            type,
            date,
            category,
            description
        }); // create a new instance of the IncomeSchema

        try {
            // validations
            if (!title || !date || !category || !description) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (amount <= 0 || !amount === "number") {
                return res.status(400).json({ message: 'Amount must be a positive number' });
            }
            await income.save(); // save the data to the database
            res.status(209).json({ message: 'Income added successfully' });
        } catch (error) {
            
        }
    }