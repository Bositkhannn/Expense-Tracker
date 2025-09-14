// Select elements from the DOM
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const totalElement = document.getElementById('total');
const expensesList = document.getElementById('expenses');
const emptyState = document.getElementById('empty-state');

// Set default date to today
dateInput.valueAsDate = new Date();

// Initialize an array to hold our expense objects
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to format numbers with thousand separators (for SUM)
function formatNumber(number) {
    return new Intl.NumberFormat('uz-UZ').format(number);
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uz-UZ', options);
}

// Function to update the total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    totalElement.textContent = formatNumber(total);
}

// Function to show/hide empty state
function toggleEmptyState() {
    if (expenses.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Function to render the list of expenses
function renderExpenses() {
    expensesList.innerHTML = ''; // Clear the current list

    expenses.forEach((expense, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'expense-item';
        
        // Create elements safely (avoiding innerHTML)
        const textSpan = document.createElement('span');
        textSpan.className = 'expense-text';
        textSpan.textContent = expense.description;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'expense-details';
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'expense-amount';
        amountSpan.textContent = `${formatNumber(parseFloat(expense.amount))} SUM`;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'expense-date';
        dateSpan.textContent = formatDate(expense.date);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('data-id', index);
        
        // Assemble the elements
        detailsDiv.appendChild(amountSpan);
        detailsDiv.appendChild(dateSpan);
        
        listItem.appendChild(textSpan);
        listItem.appendChild(detailsDiv);
        listItem.appendChild(deleteButton);
        
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
    toggleEmptyState(); // Show/hide empty state
}

// Function to add a new expense
function addExpense(e) {
    e.preventDefault(); // Prevent form from submitting and refreshing the page

    const description = descriptionInput.value.trim();
    const amount = amountInput.value.trim();
    const date = dateInput.value;

    if (description === '' || amount === '' || date === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Create a new expense object
    const newExpense = {
        description,
        amount,
        date
    };

    expenses.push(newExpense);
    
    // Save the updated array to local storage
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Re-render the list
    renderExpenses();
    
    // Clear the input fields and refocus on description
    expenseForm.reset();
    dateInput.valueAsDate = new Date(); // Reset date to today
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
window.addEventListener('DOMContentLoaded', () => {
    renderExpenses();
    toggleEmptyState();
});
