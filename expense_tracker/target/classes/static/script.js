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
  if (period === "daily") document.getElementById("dailyTotal").innerText = "$"+dailyTotal.toFixed(2);
  else if (period === "weekly") document.getElementById("weeklyTotal").innerText = "$"+weeklyTotal.toFixed(2);
  else if (period === "monthly") document.getElementById("monthlyTotal").innerText = "$"+monthlyTotal.toFixed(2);
  else if (period === "yearly") document.getElementById("yearlyTotal").innerText = "$"+yearlyTotal.toFixed(2);
}

function colorChanger(category, element){
  if (category === "Groceries"){

  }
}

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

    const index = handlePeriodIndex(period);

    // Add to pie chart data
    data[index].values.push(amount);
    data[index].labels.push(category);

    addToTotal(period, amount);

    document.getElementById(`${period}NoContent`).hidden=true;

    // redraw pie chart
    Plotly.newPlot(`${period}PieChart`, [data[index]], layout);
  } else {
    alert("Please enter a valid expense name and amount.");
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
 

