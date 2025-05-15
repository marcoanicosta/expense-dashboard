const Item = require('../models/itemModel');
const Expense = require('../models/expenseModel');
const mongoose = require('mongoose');
const Account = require('../models/accountsModel');


exports.addItem = async (req, res) => {
    const { item_name, price, due_date, instalments, account, type, fuelType, litres, location, carName } = req.body;

    // only include fuelType when it's nonempty
    const safeFuelType   = type === 'fuel' && fuelType   ? fuelType   : undefined;
    const safeLitres     = type === 'fuel'               ? (parseFloat(litres) || 0) : 0;
    const safeLocation   = type === 'fuel' && location   ? location   : '';
    const safeCarName    = type === 'fuel' && carName    ? carName    : '';

    let item = new Item({
        item_name,
        price,
        due_date,
        instalments,
        account,
        type,
        // only include fuelType when defined
        ...(safeFuelType !== undefined && { fuelType: safeFuelType }),
        litres:   safeLitres,
        location: safeLocation,
        carName:  safeCarName
    });

    try {
        if (!item_name || price == null || isNaN(price)) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        await item.save();

        // Auto-generate expense if account is linked
        if (account && !item.expenses.length) {
            const expense = new Expense({
                title: item.item_name,
                amount: item.price,
                account: item.account,
                item: item._id
            });
            await expense.save();
            item.expenses.push(expense._id);
            await item.save();
        }

        res.status(200).json({ message: 'Item added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



exports.assignAccountToItem = async (req, res) => {
    const { itemId }    = req.params;
    const { accountId } = req.body;
  
    try {
      const item = await Item.findById(itemId);
      if (!item) return res.status(404).json({ message: 'Item not found' });
  
      if (!item.account) {
        item.account = accountId;
  
        if (!item.expenses.length) {
          console.log('✅  Item before creating expense:', item.toObject());
          const newExpense = new Expense({
            title: item.item_name,
            amount: item.price,
            account: accountId,
            item:    item._id
          });
          await newExpense.save();
          console.log('✅  Expense created:', newExpense.toObject());
  
          item.expenses.push(newExpense._id);
        }
  
        await item.save();
  
        // now update the account’s own expense list & balance
        const account = await Account.findById(accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        await account.updateBalanceAfterAddingExpense(item.expenses[item.expenses.length-1]);
      }
  
      return res.status(200).json({ message: 'Account assigned to item successfully' });
    } catch (error) {
      console.error('❌  Error assigning account:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  exports.getItems = async (req, res) => {
    try {
      // 1) load all items
      let items = await Item.find();
  
      // 2) for each item, recalc completionDate (and save back if changed)
      await Promise.all(
        items.map(item => item.updateCompletionDate())
      );
  
      // 3) fetch them again so the response includes the new completionDate
      items = await Item.find();
      res.status(200).json(items);
    } catch (error) {
      console.error('Error in getItems:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

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