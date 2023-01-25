const loanAmountInput = document.querySelector(".loan-amount");
const interestRateInput = document.querySelector(".interest-rate");
const loanTenureInput = document.querySelector(".loan-tenure");
const hikeEMI = document.querySelector(".hike-emi");

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

let prepayment = document.querySelectorAll('.prepayment');
prepayment[0].style.display = 'none'
prepayment[1].style.display = 'none'


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
  let hike_EMI_Value = parseFloat(hikeEMI.value);
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


// const myFunction = () => {
//    let a = document.querySelector(".loan-amount");  
//    let b = parseInt(a.value).toLocaleString("en-IN");
//        a.value = b;
// }



function updateTextView(_obj){
  var num = getNumber(_obj.val());
  if(num==0){
    _obj.val('');
  }else{
    _obj.val(num.toLocaleString("en-IN"));
  }
}
function getNumber(_str){
  var arr = _str.split('');
  var out = new Array();
  for(var cnt=0;cnt<arr.length;cnt++){
    if(isNaN(arr[cnt])==false){
      out.push(arr[cnt]);
    }
  }
  return Number(out.join(''));
}
$(document).ready(function(){
  $('input[type=text]').on('keyup',function(){
    updateTextView($(this));
  });
});



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

//debugger;

let hike_EMI_Value = hikeEMI.value

let emi = calculateEMI();

  let table = '';
  table += '<table>';



table += '<thead><tr><th>Sr</th><th>EMI</th><th>Towards Loan</th><th>Towards Interest</th><th>Outstanding Loan</th><th>Prepayment</th></tr></thead><tbody id="myTbody"></tbody>'; 



  for(let i=1; i<=loanTenure; i++){

  let finalinterest = loanAmount*interest;
  let outstanding_loan = loanAmount;

  let prepayment = 0;
    let prepayment1 = 0;

  if(i%12 == 0){
    prepayment = emi;
  }


  if(i%13 == 0){
    let percentage = emi*hike_EMI_Value/100;
    prepayment1 = emi;
    emi = emi+percentage    
  }

  let towards_loan = emi - finalinterest;


if(i%14==0){
  prepayment1 = 0;
}

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

  init()

calculateBtn.addEventListener("click", () => {
prepayment[0].style.display = 'none';
prepayment[1].style.display = 'none';
  init()  
  tableDiv.style.display = 'block';
  normalDisplayTable();

});


smartPayBtn.addEventListener("click", () => {
prepayment[0].style.display = 'block';
prepayment[1].style.display = 'block';  
  init();
  tableDiv.style.display = 'block';
  smartDisplayTable();  

});



