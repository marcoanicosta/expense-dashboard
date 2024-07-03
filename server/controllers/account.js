const AccountSchema = require("../models/accountsModel");



exports.addAccount = async (req, res) => {
        const { account_name, balance, type, } = req.body;

        const Account = AccountSchema({
            account_name, 
            balance,
            type, 
        }); 

        try {
            // validations
            if (!account_name || !type) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (balance <= 0 || !balance === "number") {
                return res.status(400).json({ message: 'Balance must be a positive number' });
            }
            await Account.save(); // save the data to the database
            res.status(200).json({ message: 'Account added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }

exports.getAccount = async (req, res) => { 
    try {
        const accounts = await AccountSchema.find().sort({ createdAt: -1 }); //sort the data in descending order
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

exports.deleteAccount = async (req, res) => {
    const {id} = req.params; // get the id from the request parameters
    console.log(id)
    AccountSchema.findByIdAndDelete(id)
        .then((account) => {
            res.status(200).json({ message: 'Account deleted successfully' });
        }) // find the data by id and delete it
        .catch ((error) => {
            res.status(500).json({ message: 'Server Error', error });
        });
}