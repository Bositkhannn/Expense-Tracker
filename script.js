// Select elements from the DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const totalElement = document.getElementById('total');
const expensesList = document.getElementById('expenses');

// Initialize an array to hold our expense objects
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to update the total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    totalElement.textContent = total.toFixed(2); // Format to 2 decimal places
}

// Function to render the list of expenses
function renderExpenses() {
    expensesList.innerHTML = ''; // Clear the current list

    expenses.forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'expense-item';
        // Add HTML for the expense item, including a delete button
        listItem.innerHTML = `
            <span class="expense-text">${expense.description}</span>
            <div>
                <span class="expense-amount">$${parseFloat(expense.amount).toFixed(2)}</span>
                <button class="delete-btn" data-id="${index}">×</button>
            </div>
        `;
        expensesList.appendChild(listItem);
    });

    // Add event listeners to all delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-id');
            deleteExpense(index);
        });
    });

    updateTotal(); // Update the total after rendering
}

// Function to add a new expense
function addExpense(e) {
    e.preventDefault(); // Prevent form from submitting and refreshing the page

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();

    if (description === '' || amount === '') {
        alert('Please fill in both description and amount.');
        return;
    }

    // Create a new expense object
    const newExpense = {
        description,
        amount
    };

    expenses.push(newExpense);
    
    // Save the updated array to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Re-render the list
    renderExpenses();
    
    // Clear the input fields and refocus on description
    descriptionInput.value = '';
    amountInput.value = '';
    descriptionInput.focus();
}

// Function to delete an expense
function deleteExpense(index) {
    // Remove the expense at the given index
    expenses.splice(index, 1);
    // Update local storage and re-render the list
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

// Event Listeners
expenseForm.addEventListener('submit', addExpense);

// Initial render when the page loads
window.addEventListener('DOMContentLoaded', renderExpenses);