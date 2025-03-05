document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpensesEl = document.getElementById("total-expenses");
  const balanceEl = document.getElementById("balance");
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  renderTransactions();
  updateSummary();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTransactions();
  });

  function addTransactions() {
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const transaction = {
      id: Date.now(),
      amount,
      description,
      category,
      date,
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    form.reset();
  }

  function renderTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td>${transaction.amount.toFixed(2)}</td>
                <td>
                    <button class="edit-btn" onclick="editTransaction(${
                      transaction.id
                    })">Edit</button>
                    <button class="delete-btn" onclick="deleteTransaction(${
                      transaction.id
                    })">Delete</button>
                </td>
            `;
      transactionList.appendChild(row);
    });
  }

  function updateSummary() {
    const income = transactions
      .filter((t) => t.category === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.category === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const balance = income - expenses;

    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;
  }

  window.deleteTransaction = function (id) {
    transactions = transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
  };

  window.editTransaction = function (id) {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      document.getElementById("amount").value = transaction.amount;
      document.getElementById("description").value = transaction.description;
      document.getElementById("category").value = transaction.category;
      document.getElementById("date").value = transaction.date;

      // Delete the old one and let user resubmit
      deleteTransaction(id);
    }
  };
});
