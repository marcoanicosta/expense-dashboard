const Item = require('../models/itemModel');
const Expense = require('../models/expenseModel');

exports.addItem = async (req, res) => {
    const { item_name, price, due_date, instalment } = req.body;


    let item = new Item({
        item_name,
        price,
        due_date,
        instalment
    });

    try {
        // validations
        if (!item_name || !price ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await item.save(); // save the data to the database
        res.status(200).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await Expense.deleteMany({ item: id });
        await Item.findByIdAndDelete(id);

        res.status(200).json({ message: 'Item and associated transactions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}


async function addExpense(itemId, expenseData) {
    // Create and save the new expense
    const expense = new Expense(expenseData);
    await expense.save();

    // Find the item and add the expense to its expenses array
    const item = await Item.findById(itemId);
    item.expenses.push(expense._id);
    await item.save();

    // Update the item's completion date if necessary
    await item.updateCompletionDate();
}