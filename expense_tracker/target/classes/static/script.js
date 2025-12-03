let total = 0;

function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);

  if (name && !isNaN(amount) && amount > 0) {
    const li = document.createElement("li");
    let category = document.getElementById("expense-category").value;
    if (category == "") {
      category = document.getElementById("custom-category").value;
    }
    if (category == "") {
      category = "Uncategorized";
    }
    li.innerHTML = `<span>[${category}] ${name}: $${amount.toFixed(2)}</span> 
                    <button onclick="removeExpense(this, ${amount})">X</button>`;
    document.getElementById("expense-list").appendChild(li);

    total += amount;
    document.getElementById("total").innerText = total.toFixed(2);

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").value = "";
    document.getElementById("custom-category").value = "";
  } else {
    alert("Please enter a valid expense name and amount.");
  }
}

function removeExpense(button, amount) {
  button.parentElement.remove();
  total -= amount;
  document.getElementById("total").innerText = total.toFixed(2);
}
