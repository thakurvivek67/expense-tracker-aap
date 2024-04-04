document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses-list');
    const totalExpenses = document.getElementById('total-expenses');
    const editExpenseBtn = document.getElementById('editExpenseBtn');
    const deleteExpenseBtn = document.getElementById('deleteExpenseBtn');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function updateExpenses() {
        expenseList.innerHTML = '';
        let total = 0;
        expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'card mb-2';
            expenseItem.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${expense.category}</h5>
                    <p class="card-text">${expense.description}: ₹${expense.amount}</p>
                    <button class="btn btn-warning mr-2 edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
                </div>`;
            expenseList.appendChild(expenseItem);
            total += parseInt(expense.amount);
        });
        totalExpenses.textContent = '₹' + total;
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
        document.getElementById('category').value = expense.category;
        document.getElementById('description').value = expense.description;
        document.getElementById('amount').value = expense.amount;
        editExpenseBtn.disabled = false;
        deleteExpenseBtn.disabled = false;
        editExpenseBtn.onclick = () => {
            expenses[index] = {
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                amount: document.getElementById('amount').value
            };
            updateExpenses();
            resetForm();
        };
        deleteExpenseBtn.onclick = () => {
            deleteExpense(index);
            resetForm();
        };
    }

    function resetForm() {
        expenseForm.reset();
        editExpenseBtn.disabled = true;
        deleteExpenseBtn.disabled = true;
        editExpenseBtn.onclick = null;
        deleteExpenseBtn.onclick = null;
    }

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        if (category.trim() && description.trim() && amount.trim()) {
            addExpense(category, description, amount);
            resetForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    expenseList.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            editExpense(index);
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteExpense(index);
        }
    });

    updateExpenses();
});
