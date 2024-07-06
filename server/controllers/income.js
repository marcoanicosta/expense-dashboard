const Accounts = require('../models/accountsModel'); // Adjust the path as necessary
const Income = require('../models/incomeModel'); // Adjust the path as necessary


// TODO: v1
exports.addIncome = async (req, res) => {
    const { title, amount, type, date, category, description, accountId, recurrence } = req.body;

    const income = new Income({
        title,
        amount,
        type,
        date,
        category,
        description,
        account: accountId,
        recurrence: recurrence ? {
            frequency: recurrence.frequency,
            startDate: recurrence.startDate,
            endDate: recurrence.endDate || null
        } : undefined
    }); // create a new instance of the Income model

    try {
        // validations
        if (!title || !date || !category || !description || !accountId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (amount < 0 || typeof amount !== "number") {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const savedIncome = await income.save(); // save the data to the database

        // Find the account and update it with the new income
        const account = await Accounts.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
        await account.updateBalanceAfterAddingIncome(savedIncome._id);

        res.status(200).json({ message: 'Income added successfully', income: savedIncome });
    } catch (error) {
        console.error('Server Error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getIncome = async (req, res) => { 
    try {
        const incomes = await Income.find().sort({ createdAt: -1 }); // Sort the data in descending order
        res.status(200).json(incomes);
    } catch (error) {
        console.error('Server Error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
}


exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    console.log(id, "MY ID 🚨");

    try {
        // Find the income to be deleted
        const income = await Income.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Find the account associated with this income
        const account = await Accounts.findById(income.account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Delete the income
        await Income.findByIdAndDelete(id);

        // Remove the income from the account's incomes array
        account.incomes = account.incomes.filter(incomeId => incomeId.toString() !== id);

        // Update the account's balance
        await account.updateBalanceAfterRemovingIncome(id); // Ensure this method exists and works as expected

        res.status(200).json({ message: 'Income deleted and account updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};





    //TODO: v2
// exports.addIncome = async (req, res) => {
//     const { title, amount, type, date, category, description, accountId } = req.body;

//     const income = new Income({
//         title,
//         amount,
//         type,
//         date,
//         category,
//         description,
//         account: accountId
//     });

//     try {
//         // Validations
//         if (!title || !date || !category || !description || !accountId) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }
//         if (amount <= 0 || typeof amount !== 'number') {
//             return res.status(400).json({ message: 'Amount must be a positive number' });
//         }

//         // Save the new income
//         const savedIncome = await income.save();

//         // Find the account and update it with the new income
//         const account = await Account.findById(accountId);
//         if (!account) {
//             return res.status(404).json({ message: 'Account not found' });
//         }

//         // Update the account balance
//         await account.updateBalanceAfterAddingIncome(savedIncome._id);

//         res.status(200).json({ message: 'Income added successfully', income: savedIncome });
//     } catch (error) {
//         console.error('Server Error:', error); // Log the error for debugging
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


///OLD 

// exports.deleteIncome = async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log(id, "MY ID 🚨");
        
//         const income = await Income.findByIdAndDelete(id);
//         console.log(id)

//         const account = await Account.findOne({ incomes: id });
//         if (account) {
//             await account.updateBalanceAfterRemovingIncome(id);
//         }

//         res.status(200).json({ message: 'Income deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//     // const {id} = req.params; // get the id from the request parameters
//     // console.log(id)
//     // Income.findByIdAndDelete(id)
//     //     .then((income) => {
//     //         res.status(200).json({ message: 'Income deleted successfully' });
//     //     }) // find the data by id and delete it
//     //     .catch ((error) => {
//     //         res.status(500).json({ message: 'Server Error', error });
//     //     });
// }
