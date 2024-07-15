let formBody = document.querySelector(".formBody");
let checked = document.querySelector(".checked");
let amounts = document.querySelector(".amounts");

let cartona = ``;
let start = 1;
let allTransition = [];
let amount = [];
let date = [];
renderTable();


checked.addEventListener("change", function (e) {
  let selected = this.value;
  let cartona = ``;
  start = 1;
  allTransition.forEach((trans) => {
    if (selected == trans.name) {
      cartona += `
    <tr>
         <th scope="row">${start}</th>
         <td>${trans.customer_id}</td>
         <td>${trans.name}</td>
         <td>${trans.amount}</td>
         <td>${trans.date}</td>
       </tr>
    `;
      start++;
      amount.push(trans.amount);
      date.push(trans.date);
    }else{
     
    }
  });
  formBody.innerHTML = cartona;
  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  const ctx = document.getElementById("myChart");
  ctx.classList.remove("d-none");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: date,
      datasets: [
        {
          label: "# of Votes",
          data: amount,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  amount = [];
  date = [];
});

amounts.addEventListener("input", function (e) {
  let selected = this.value;
  let cartona = ``;
  start = 1;
  let cartonaAmounts = ``;
  allTransition.forEach((trans) => {
    cartonaAmounts += `
<option value="${trans.amount}"></option>
`;

    if (selected == trans.amount) {
      amount.push(trans.amount);
      date.push(trans.date);
      cartona += `
    <tr>
         <th scope="row">${start}</th>
         <td>${trans.customer_id}</td>
         <td>${trans.name}</td>
         <td>${trans.amount}</td>
         <td>${trans.date}</td>
       </tr>
    `;
      start++;
    }
  });
  formBody.innerHTML = cartona;
  document.getElementById("Transaction").innerHTML = cartonaAmounts;

  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById("myChart");
  ctx.classList.remove("d-none");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: date,
      datasets: [
        {
          label: "# of Votes",
          data: amount,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  amount = [];
  date = [];
});

async function renderTable() {
  let dataAPI = await data();
  let { customers, transactions } = dataAPI;

  customers.forEach((client) => {
    transactions.forEach((trans) => {
      if (client.id == trans.customer_id) {
        trans.name = client.name;
        allTransition.push(trans);
        cartona += `
       <tr>
            <th scope="row">${start}</th>
            <td>${trans.customer_id}</td>
            <td>${trans.name}</td>
            <td>${trans.amount}</td>
            <td>${trans.date}</td>
          </tr>
       `;
        start++;
      }
    });
  });
  formBody.innerHTML = cartona;

  console.log(allTransition);

  let allChecked = ` <option selected>All</option> `;
  customers.forEach((trans) => {
    allChecked += `<option value="${trans.name}">${trans.name}</option>`;
  });

  checked.innerHTML = allChecked;
}

async function data() {
  let api = await fetch(`../json/data.json`);
  return await api.json();
}
