let total = 0;

var data = [
  {
    values: [],
    labels: [],
    type: "pie",
  },
];

var layout = {
  height: 400,
  width: 500,
  paper_bgcolor: '#020617', 
  plot_bgcolor: '#020617',
  font: { color: '#ffffff' },
  padding: 
};

function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const period = document.getElementById("timePeriod").value;

  if (name && !isNaN(amount) && amount > 0) {
    const li = document.createElement("li");
    let category = document.getElementById("expense-category").value;
    if (category == "") {
      category = document.getElementById("custom-category").value;
    }
    if (category == "") {
      category = "Uncategorized";
    }
    li.innerHTML = `<span> ${name}: $${amount.toFixed(2)} [${category}]</span> 
                    <button onclick="removeExpense(this, ${amount}, '${category}')">X</button>`;
    document.getElementById(`expense-list-${period}`).appendChild(li);

    // Add to pie chart data
    data[0].values.push(amount); // <- use number
    data[0].labels.push(category); // <- reference first object in array

    total += amount;
    document.getElementById("total").innerText = total.toFixed(2);

    // redraw pie chart
    Plotly.newPlot("pieChart", data, layout);
  } else {
    alert("Please enter a valid expense name and amount.");
  }
}

function handleTotals(element, amount){
  const periodElement = document.getElementById(element);
  const currentTotal = periodElement.value;
  periodElement.innerHTML()=(currentTotal+=amount)
}

// removeExpense now also removes the value from the pie chart
function removeExpense(button, amount, category) {
  button.parentElement.remove();

  total -= amount;
  document.getElementById("total").innerText = total.toFixed(2);

  // remove from pie chart data
  const index = data[0].labels.indexOf(category);
  if (index > -1) {
    data[0].labels.splice(index, 1);
    data[0].values.splice(index, 1);
  }

  // redraw pie chart
  Plotly.newPlot("pieChart", data, layout);
}

//collapsing buttons
const toggleBtn = document.querySelector(".toggle-btn");
const container = document.querySelector(".collapsible-container");

toggleBtn.addEventListener("click", () => {
  if (container.style.display === "none") {
    container.style.display = "block";
    toggleBtn.textContent = "Hide Expense Tracker";
  } else {
    container.style.display = "none";
    toggleBtn.textContent = "Show Expense Tracker";
  }
});

