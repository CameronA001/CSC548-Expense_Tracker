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
};

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
                    <button onclick="removeExpense(this, ${amount}, '${category}')">X</button>`;
    document.getElementById("expense-list").appendChild(li);

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
