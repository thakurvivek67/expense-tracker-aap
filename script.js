$(document).ready(function () {
    const expenseForm = $('#expense-form');
    const expenseList = $('#expenses-list');
    const totalExpenses = $('#total-expenses');
    const editExpenseBtn = $('#editExpenseBtn');
    const deleteExpenseBtn = $('#deleteExpenseBtn');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function updateExpenses() {
        expenseList.html('');
        let total = 0;
        expenses.forEach(function (expense, index) {
            const expenseItem = $(`<div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">${expense.category}</h5>
                    <p class="card-text">${expense.description}: ₹${expense.amount}</p>
                    <button class="btn btn-warning mr-2 edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                </div>
            </div>`);
            expenseList.append(expenseItem);
            total += parseInt(expense.amount);
        });
        totalExpenses.text('₹' + total);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function addExpense(category, description, amount) {
        expenses.push({ category, description, amount });
        updateExpenses();
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        updateExpenses();
    }

    function editExpense(index) {
        const expense = expenses[index];
        $('#category').val(expense.category);
        $('#description').val(expense.description);
        $('#amount').val(expense.amount);
        editExpenseBtn.prop('disabled', false);
        deleteExpenseBtn.prop('disabled', false);
        editExpenseBtn.off('click').on('click', function () {
            expenses[index] = {
                category: $('#category').val(),
                description: $('#description').val(),
                amount: $('#amount').val()
            };
            updateExpenses();
            resetForm();
        });
        deleteExpenseBtn.off('click').on('click', function () {
            deleteExpense(index);
            resetForm();
        });
    }

    function resetForm() {
        expenseForm.trigger('reset');
        editExpenseBtn.prop('disabled', true);
        deleteExpenseBtn.prop('disabled', true);
        editExpenseBtn.off('click');
        deleteExpenseBtn.off('click');
    }

    expenseForm.submit(function (e) {
        e.preventDefault();
        const category = $('#category').val();
        const description = $('#description').val();
        const amount = $('#amount').val();
        if (category.trim() && description.trim() && amount.trim()) {
            addExpense(category, description, amount);
            resetForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    expenseList.on('click', '.edit-btn', function () {
        const index = $(this).data('index');
        editExpense(index);
    });

    expenseList.on('click', '.delete-btn', function () {
        const index = $(this).data('index');
        deleteExpense(index);
    });

    updateExpenses();
});
