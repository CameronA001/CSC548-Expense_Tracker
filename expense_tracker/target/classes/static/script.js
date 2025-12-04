let dailyTotal = 0;
let weeklyTotal = 0;
let monthlyTotal = 0;
let yearlyTotal = 0;

var data = [
  //daily [0]
  {
    values: [],
    labels: [],
    type: "pie",
  },
  //weekly [1]
  {
    values: [],
    labels: [],
    type: "pie",
  },
  //monthly [2]
    {
    values: [],
    labels: [],
    type: "pie",
  },

  //yearly[3]
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

const categoryColors = {
  "Groceries": "rgba(255, 100, 100, 0.7)",
  "Eating_Out": "rgba(100, 150, 255, 0.7)",
  "Transportation": "rgba(120, 220, 120, 0.7)",
  "Entertainment": "rgba(255, 180, 80, 0.7)",
  "Utilities": "rgba(200, 200, 255, 0.7)",
  "Uncategorized": "rgba(200, 200, 200, 0.7)"
};


function handlePeriodIndex(period){
  if (period === "daily"){
    return 0;
  }
  if(period === "weekly"){
    return 1;
  }
  if (period === "monthly"){
    return 2;
  }
  if (period === "yearly"){
    return 3;
  }
}

function addToTotal(period, amount) {
  if (period === "daily") dailyTotal += amount;
  else if (period === "weekly") weeklyTotal += amount;
  else if (period === "monthly") monthlyTotal += amount;
  else if (period === "yearly") yearlyTotal += amount;

  // Update the corresponding HTML element
  if (period === "daily") document.getElementById("dailyTotal").innerText = "Total: $"+dailyTotal.toFixed(2);
  else if (period === "weekly") document.getElementById("weeklyTotal").innerText = "Total: $"+weeklyTotal.toFixed(2);
  else if (period === "monthly") document.getElementById("monthlyTotal").innerText = "Total: $"+monthlyTotal.toFixed(2);
  else if (period === "yearly") document.getElementById("yearlyTotal").innerText = "Total: $"+yearlyTotal.toFixed(2);
}

function colorChanger(category, element) {
  if (category === "Groceries") {
    element.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
  } 
  else if (category === "Eating_Out") {
    element.style.backgroundColor = "rgba(0, 0, 255, 0.25)";
  }
  else if (category === "Transportation") {
    element.style.backgroundColor = "rgba(0, 128, 0, 0.25)";
  }
  else if (category === "Entertainment") {
    element.style.backgroundColor = "rgba(255, 165, 0, 0.25)";
  }
  else if (category === "Utilities") {
    element.style.backgroundColor = "rgba(128, 0, 128, 0.25)";
  }
  else if(category === "Uncategorized"){
    element.style.backgroundColor= "rgba(0,0,0, 0.25)";
  }

  // shared styling
  element.style.borderRadius = "8px";
  element.style.padding = "3px 6px";
  element.style.display = "inline-block";
}


function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const period = document.getElementById("timePeriod").value;

  if (name && !isNaN(amount) && amount > 0) {
    const li = document.createElement("li");

    let category = document.getElementById("expense-category").value;
    if (!category) category = document.getElementById("custom-category").value;
    if (!category) category = "Uncategorized";

    li.innerHTML = `
      <span class="expense-text">${name}: $${amount.toFixed(2)} [${category}]</span>
      <button onclick="removeExpense(this, ${amount}, '${category}', '${period}')">X</button>

    `;

    const span = li.querySelector(".expense-text");
    colorChanger(category, span);

    document.getElementById(`expense-list-${period}`).appendChild(li);

    const index = handlePeriodIndex(period);

    data[index].values.push(amount);
    data[index].labels.push(category);

    addToTotal(period, amount);

    document.getElementById(`${period}NoContent`).hidden = true;

    const colors = data[index].labels.map(label => categoryColors[label]);

Plotly.newPlot(`${period}PieChart`, [{
  values: data[index].values,
  labels: data[index].labels,
  type: "pie",
  marker: { colors: colors }
}], layout);

  } else {
    alert("Please enter a valid expense name and amount.");
  }
}

function removeExpense(button, amount, category, period) {
  button.parentElement.remove();

  // subtract from totals
  addToTotal(period, -amount);

  // find the correct chart dataset
  const chartIndex = handlePeriodIndex(period);

  // find the item within that dataset
  const idx = data[chartIndex].labels.indexOf(category);

  if (idx > -1) {
    data[chartIndex].labels.splice(idx, 1);
    data[chartIndex].values.splice(idx, 1);
  }

  // redraw pie chart
  Plotly.newPlot(`${period}PieChart`, [data[chartIndex]], layout);

  // optional: if no data left, show "no content" message
  if (data[chartIndex].values.length === 0) {
    document.getElementById(`${period}NoContent`).hidden = false;
  }
}


function handleTotals(element, amount){
  const periodElement = document.getElementById(element);
  const currentTotal = periodElement.value;
  periodElement.innerHTML()=(currentTotal+=amount)
}


function collapse(period, containerID) {
  const container = document.getElementById(containerID);

  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
    button.textContent = `Hide '${period}'`;
  } else {
    container.style.display = "none";
    button.textContent = `Show '${period}'`;
  }
}


//collapsing buttons
 