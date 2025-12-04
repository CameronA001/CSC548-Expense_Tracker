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
};

let savedExpenses = [];
let budgetGoals = [];

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
                    <button type="button" class="btn-secondary" onclick="removeExpense(this, ${amount}, '${category}')">X</button>
                    <button type="button" class="btn-secondary" onclick="saveExpense('${name}', ${amount}, '${category}')">Save</button>`;
    document.getElementById(`expense-list-${period}`).appendChild(li);

    // Add to pie chart data
    data[0].values.push(amount);
    data[0].labels.push(category);

    total += amount;
    document.getElementById("total").innerText = total.toFixed(2);

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").value = "";
    document.getElementById("custom-category").value = "";
    document.getElementById("savedExpenses").value = "";

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

if (toggleBtn && container) {
  toggleBtn.addEventListener("click", () => {
    if (container.style.display === "none") {
      container.style.display = "block";
      toggleBtn.textContent = "Hide Expense Tracker";
    } else {
      container.style.display = "none";
      toggleBtn.textContent = "Show Expense Tracker";
    }
  });
}

function saveExpense(name, amount, category) {
  savedExpenses.push({name, amount, category});
  loadSavedExpenses();
  alert("Expense saved!");
}

function loadSavedExpenses() {
  const dropdown = document.getElementById("savedExpenses");
  dropdown.innerHTML = `<option value="">--Select a Saved Expense--</option>`;

  savedExpenses.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${item.category}: ${item.name} ($${item.amount})`;
    dropdown.appendChild(option);
  });

  dropdown.onchange = function () {
    let index = dropdown.value;
    if(index === "") return;
   
    let item = savedExpenses[index];

    document.getElementById("expense-name").value = item.name;
    document.getElementById("expense-amount").value = item.amount;
    document.getElementById("expense-category").value = item.category;

    const categorySelect = document.getElementById("expense-category");

    const builtInCategories = Array.from(categorySelect.options)
      .map(option => option.value)
      .filter(value => value !== "");

    if (!builtInCategories.includes(item.category)) {
      // Custom
      document.getElementById("expense-category").value = "";
      document.getElementById("custom-category").value = item.category;
    }
    else {
      // Build-in
      document.getElementById("custom-category").value = "";
      document.getElementById("expense-category").value = item.category;
    }
  }
}

// New function to save budget goals
function saveBudgetGoal() {
  const name = document.getElementById("name").value;
  const reason = document.getElementById("budgetReason").value;
  const goal = parseFloat(document.getElementById("savingsSlider").value);
  const time = document.getElementById("time").value;
  const timePeriod = document.getElementById("timePeriod").value;

  if (!name || !reason || goal <= 0 || !time || time <= 0) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const budgetGoal = {
    id: Date.now(),
    name: name,
    reason: reason,
    goal: goal,
    time: time,
    timePeriod: timePeriod,
    saved: 0
  };

  budgetGoals.push(budgetGoal);
  renderBudgetGoals();

  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("budgetReason").value = "";
  document.getElementById("savingsSlider").value = 0;
  document.getElementById("sliderValue").innerText = 0;
  document.getElementById("time").value = "";
}

function renderBudgetGoals() {
  const container = document.getElementById("budgetGoalsList");
  
  if (budgetGoals.length === 0) {
    container.innerHTML = '<p class="panel-subtitle" style="text-align: center; padding: 20px;">No budget goals yet. Create one to get started!</p>';
    return;
  }

  container.innerHTML = budgetGoals.map(goal => {
    const progress = (goal.saved / goal.goal * 100).toFixed(1);
    const perPeriod = (goal.goal / goal.time).toFixed(2);
    const remaining = (goal.goal - goal.saved).toFixed(2);
    
    return `
      <div class="period-group" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
        <div class="section-header">
          <div>
            <h3 style="font-size: 1rem; color: var(--text); margin-bottom: 2px;">${goal.name}'s Goal</h3>
            <p style="font-size: 0.8rem; color: var(--text-soft); margin: 0;">${goal.reason}</p>
          </div>
          <button class="btn-secondary" onclick="removeBudgetGoal(${goal.id})" style="background: linear-gradient(135deg, var(--danger), #dc2626); padding: 5px 10px;">Remove</button>
        </div>
        
        <div style="margin-top: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: var(--text-soft); font-size: 0.78rem;">Progress</span>
            <span style="color: var(--positive); font-size: 0.78rem; font-weight: 600;">$${goal.saved.toFixed(2)} / $${goal.goal.toFixed(2)}</span>
          </div>
          <div style="background: rgba(15, 23, 42, 0.85); height: 20px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border);">
            <div style="background: linear-gradient(90deg, var(--accent), var(--positive)); height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
          </div>
          <div style="text-align: center; margin-top: 4px; color: var(--text-soft); font-size: 0.75rem;">${progress}% Complete • $${remaining} remaining</div>
        </div>
        
        <div class="form-grid" style="margin-bottom: 12px;">
          <div class="form-group">
            <label style="font-size: 0.7rem; color: var(--text-soft);">Timeline</label>
            <div style="background: rgba(15, 23, 42, 0.85); padding: 8px 10px; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="color: var(--text); font-size: 0.85rem; font-weight: 600;">${goal.time} ${goal.timePeriod}</div>
            </div>
          </div>
          <div class="form-group">
            <label style="font-size: 0.7rem; color: var(--text-soft);">Save Per ${goal.timePeriod.slice(0, -1)}</label>
            <div style="background: rgba(15, 23, 42, 0.85); padding: 8px 10px; border-radius: var(--radius-md); border: 1px solid var(--border);">
              <div style="color: var(--positive); font-size: 0.85rem; font-weight: 600;">$${perPeriod}</div>
            </div>
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="addAmount-${goal.id}">Add Savings</label>
            <input type="number" id="addAmount-${goal.id}" placeholder="Enter amount">
          </div>
          <div class="form-group align-end">
            <button class="btn-primary" onclick="addToGoal(${goal.id})" style="width: 100%;">Add to Goal</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function addToGoal(id) {
  const goal = budgetGoals.find(g => g.id === id);
  if (!goal) return;

  const input = document.getElementById(`addAmount-${id}`);
  const amount = parseFloat(input.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  goal.saved = Math.min(goal.saved + amount, goal.goal);
  
  // Update total saved
  total = budgetGoals.reduce((sum, g) => sum + g.saved, 0);
  document.getElementById("total").innerText = total.toFixed(2);
  
  input.value = "";
  renderBudgetGoals();
}

function removeBudgetGoal(id) {
  if (confirm("Are you sure you want to remove this budget goal?")) {
    const goal = budgetGoals.find(g => g.id === id);
    if (goal) {
      // Subtract from total
      total -= goal.saved;
      document.getElementById("total").innerText = total.toFixed(2);
    }
    
    budgetGoals = budgetGoals.filter(g => g.id !== id);
    renderBudgetGoals();
  }
}