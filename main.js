const loanAmountInput = document.querySelector(".loan-amount");
const interestRateInput = document.querySelector(".interest-rate");
const loanTenureInput = document.querySelector(".loan-tenure");

const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");

const calculateBtn = document.querySelector(".calculate-btn");
const smartPayBtn = document.querySelector(".smartpay-btn");

let loanAmount = parseFloat(loanAmountInput.value);
let interestRate = parseFloat(interestRateInput.value);
let loanTenure = parseFloat(loanTenureInput.value);

let interest = interestRate / 12 / 100;

let myTable = document.getElementById("data");

let tableDiv = document.getElementById('tableDiv');
tableDiv.style.display = 'none';

let prepayment = document.getElementById('prepayment');
prepayment.style.display = 'none';

let myChart;

const checkValues = () => {
  let loanAmountValue = loanAmountInput.value;
  let interestRateValue = interestRateInput.value;
  let loanTenureValue = loanTenureInput.value;

  let regexNumber = /^[0-9]+$/;
  if (!loanAmountValue.match(regexNumber)) {
    loanAmountInput.value = "10000";
  }

  if (!loanTenureValue.match(regexNumber)) {
    loanTenureInput.value = "12";
  }

  let regexDecimalNumber = /^(\d*\.)?\d+$/;
  if (!interestRateValue.match(regexDecimalNumber)) {
    interestRateInput.value = "7.5";
  }
};

const displayChart = (totalInterestPayableValue) => {
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Interest", "Principal Loan Amount"],
      datasets: [
        {
          data: [totalInterestPayableValue, loanAmount],
          backgroundColor: ["#f42020", "#37b33b"],
          borderWidth: 0,
        },
      ],
    },
  });
};

const updateChart = (totalInterestPayableValue) => {
  myChart.data.datasets[0].data[0] = totalInterestPayableValue;
  myChart.data.datasets[0].data[1] = loanAmount;
  myChart.update();
};

const refreshInputValues = () => {
  loanAmount = parseFloat(loanAmountInput.value);
  interestRate = parseFloat(interestRateInput.value);
  loanTenure = parseFloat(loanTenureInput.value);
  interest = interestRate / 12 / 100;
};

const calculateEMI = () => {
  checkValues();
  refreshInputValues();
  let emi =
    loanAmount *
    interest *
    (Math.pow(1 + interest, loanTenure) /
      (Math.pow(1 + interest, loanTenure) - 1));

  return emi;
};

const updateData = (emi) => {
  loanEMIValue.innerHTML = Math.round(emi).toLocaleString('en-IN');;

  let totalAmount = Math.round(loanTenure * emi);
  totalAmountValue.innerHTML = totalAmount.toLocaleString('en-IN');;

  let totalInterestPayable = Math.round(totalAmount - loanAmount);
  totalInterestValue.innerHTML = totalInterestPayable.toLocaleString('en-IN');;

  if (myChart) {
    updateChart(totalInterestPayable);
  } else {
    displayChart(totalInterestPayable);
  }
};


const normalDisplayTable = () => {
let emi = calculateEMI();

  let table = '';
  table += '<table>';

  let j = 0;
  let k = 0;


table += '<thead><tr><th>Sr</th><th>EMI</th><th>Towards Loan</th><th>Towards Interest</th><th>Outstanding Loan</th></tr></thead><tbody></tbody>'; 


  for(let i=1; i<=loanTenure; i++){

  let finalinterest = loanAmount*interest;
  let towards_loan = emi - finalinterest;
  let outstanding_loan = loanAmount;

      outstanding_loan = outstanding_loan - towards_loan

    table += '<tr>';
    table += '<td>'+i;
    table += '</td>';
    table += '<td>'+Math.round(emi);
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_loan));
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(finalinterest));
    table += '</td>'; 
    table += '<td>'+Math.max(0, Math.round(outstanding_loan));
    table += '</td>'; 
    table += '</tr>';

    loanAmount = outstanding_loan;

  }

  table += '</tbody></table>';
  myTable.innerHTML = table;
}



const smartDisplayTable = () => {
let emi = calculateEMI();

  let table = '';
  table += '<table>';

  let j = 0;
  let k = 0;


table += '<thead><tr><th>Sr</th><th>EMI</th><th>Towards Loan</th><th>Towards Interest</th><th>Outstanding Loan</th><th>Prepayment</th></tr></thead><tbody id="myTbody"></tbody>'; 


  for(let i=1; i<=loanTenure; i++){

  let finalinterest = loanAmount*interest;
  let towards_loan = emi - finalinterest;
  let outstanding_loan = loanAmount;


  let prepayment = 0;
  let prepayment1 = 0;


  if(i == 12 || j == 12){
    prepayment = emi;
    j=0
  }

  if(i==13 || k == 12){
    prepayment1 = emi;
    k=0 
  }

  j++;
  k++;

      outstanding_loan = outstanding_loan - (prepayment1+towards_loan)


    table += '<tr>';
    table += '<td>'+i;
    table += '</td>';
    table += '<td>'+Math.round(emi);
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_loan));
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(finalinterest));
    table += '</td>'; 
    table += '<td>'+Math.max(0, Math.round(outstanding_loan));
    table += '</td>'; 
    table += '<td>'+Math.round(prepayment);
    table += '</td>';        
    table += '</tr>';



    loanAmount = outstanding_loan;


  }
  table += '</tbody></table>';
  myTable.innerHTML = table;
}



let init = () => {
  let emi = calculateEMI();
  updateData(emi);
}

init();

calculateBtn.addEventListener("click", () => {

  init()  
  tableDiv.style.display = 'block';
  normalDisplayTable();

});


smartPayBtn.addEventListener("click", () => {
prepayment.style.display = 'block';
  init();
  tableDiv.style.display = 'block';
  smartDisplayTable();  

});


