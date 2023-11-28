//1
const balance = document.getElementById(
    "balance"
  );
  const money_plus = document.getElementById(
    "money-plus"
  );
  const money_minus = document.getElementById(
    "money-minus"
  );
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
  //5
  //Add Transaction
  function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
        alert('Please add text, amount, and date');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value * (type.value === 'expense' ? -1 : 1),
            date: date.value,
            type: type.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
        date.value = '';
    }
}
  
  
  //5.5
  //Generate Random ID
  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  
  //2
  
  //Add Trasactions to DOM list
function addTransactionDOM(transaction) {
    // GET sign
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    // Extract only the date portion
    const transactionDate = new Date(transaction.date);
    const formattedDate = transactionDate.toLocaleDateString('en-GB'); 

    // Add Class Based on Value
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
      <span class="date">${formattedDate}</span>
      <span>${transaction.text}</span>
      <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}
  
  //4
  
  //Update the balance income and expence
  function updateValues() {
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);
  
      balance.innerText=`$${total}`;
      money_plus.innerText = `$${income}`;
      money_minus.innerText = `$${expense}`;
  }
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
  }
  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }
  
  //3
  
  //Init App
  function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }
  
  Init();
  
 form.addEventListener('submit',addTransaction);
  
  function filterByDateRange() {
    const selectedDate = prompt('Enter date to filter by (YYYY-MM-DD):');
    if (selectedDate !== null) {
        const filteredTransactions = transactions.filter(transaction =>
            transaction.date === selectedDate
        );
        displayTransactions(filteredTransactions);
    }
}
document.getElementById('save-to-file-btn').addEventListener('click', saveToFile);

document.getElementById('menu-btn').addEventListener('click', toggleMenu);
document.getElementById('search-btn').addEventListener('click', searchTransactions);
document.getElementById('filter-by-date-btn').addEventListener('click', filterByDateRange); // Changed the function name
document.getElementById('save-to-file-btn').addEventListener('click', saveToFile);

function toggleMenu() {
    document.getElementById('menu').classList.toggle('show-menu');
}

function searchTransactions() {
    const searchTerm = prompt('Enter text to search for:');
    if (searchTerm !== null) {
        const filteredTransactions = transactions.filter(transaction =>
            transaction.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayTransactions(filteredTransactions);
    }
}


function saveToFile() {
    const formattedTransactions = transactions.map(transaction => {
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB');
        const sign = transaction.amount < 0 ? "-" : "+";
        const formattedAmount = `$${Math.abs(transaction.amount)}`;
        return `${formattedDate} - ${transaction.text}: ${sign}${formattedAmount}`;
    });

    const content = formattedTransactions.join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_report.txt';
    a.textContent = 'Download Report';

    const container = document.getElementById('file-download-container');
    container.innerHTML = ''; // Clear previous content
    container.appendChild(a);

    // Trigger a click on the invisible link to start the download
    a.click();

    // Revoke the object URL to free up resources
    URL.revokeObjectURL(url);
}


function generateTransactionReportHTML() {
    // Create an HTML structure for your transaction report
    const reportContainer = document.createElement('div');
    reportContainer.innerHTML = `<h1>Transaction Report</h1>`;

    const transactionsList = document.createElement('ul');
    transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${transaction.date}</span> <span>${transaction.text}</span> <span>${transaction.amount}</span>`;
        transactionsList.appendChild(listItem);
    });

    reportContainer.appendChild(transactionsList);
    return reportContainer;
}

// Display transactions in the list
function displayTransactions(transactionsToShow) {
    list.innerHTML = "";
    const transactionsToDisplay = transactionsToShow || transactions;
    transactionsToDisplay.forEach(addTransactionDOM);
    updateValues();
}