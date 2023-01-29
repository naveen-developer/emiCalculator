const loanAmountInput = document.querySelector(".loan-amount");
const interestRateInput = document.querySelector(".interest-rate");
const loanTenureInput = document.querySelector(".loan-tenure");
const hikeEMI = document.querySelector(".hike-emi");

const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");

const calculateBtn = document.querySelector(".calculate-btn");
const smartPayBtn = document.querySelector(".smartpay-btn");



//let number = loanAmountInput.value.replace(/\,/g,'')

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
  myChart.data.datasets[0].data[1] = loanAmountInput.value;
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

let totalInterestPayable = 0;
let totalAmount = 0;

const updateData = (emi) => {
  loanEMIValue.innerHTML = Math.round(emi).toLocaleString('en-IN');

  totalAmount = Math.round(loanTenure * emi);
  totalAmountValue.innerHTML = totalAmount.toLocaleString('en-IN');

  totalInterestPayable = Math.round(totalAmount - loanAmount);
  totalInterestValue.innerHTML = totalInterestPayable.toLocaleString('en-IN');

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


// function formatIndianNumber(number) {
//   return number.toLocaleString("en-IN");
// }

// //console.log(formatIndianNumber(123456.789)); 

// document.getElementById("input").addEventListener("keyup", function(event) {
//   console.log(e.preventDefault());
//   event.preventDefault();
//      if(this.value == ""){
//       console.log("empty number")
//      }else{
//            this.value = formatIndianNumber(parseInt(this.value));
//      console.log(this.value)      
//      }

// });



  //    $(function() {
  //      $(".loan-amount").focus();
  //      let number =  $(".loan-amount").val();
  //      let number1 = parseInt(number).toLocaleString("en-IN");
  //      console.log("number "+number1+" number1 "+number1);
  //      $(".loan-amount").val(number1);
  //    });


  // function updateTextView(_obj){
  //   var num = getNumber(_obj.val());
  //   console.log(num);
  //   if(num==0){
  //     _obj.val('');
  //   }else{
  //     _obj.val(num.toLocaleString("en-IN"));
  //   }
  // }
  // function getNumber(_str){
  //   var arr = _str.split('');
  //   var out = new Array();
  //   for(var cnt=0;cnt<arr.length;cnt++){
  //     if(isNaN(arr[cnt])==false){
  //       out.push(arr[cnt]);
  //     }
  //   }
  //   return Number(out.join(''));
  // }
  // $(document).ready(function(){
  //   $('input[type=text]').on('keyup',function(){
  //     updateTextView($(this));
  //     //console.log(this)
  //   });
  // });



const normalDisplayTable = () => {
let emi = calculateEMI();

  let table = '';
  table += '<table>';

  let j = 0;
  let k = 0;


table += '<thead><tr><th>Sr</th><th>EMI</th><th>Towards Loan</th><th>Towards Interest</th><th>Outstanding Loan</th></tr></thead><tbody></tbody>'; 

  for(let i=1; i<=loanTenure; i++){


  let towards_interest = loanAmount*interest;
  let towards_loan = emi - towards_interest;
  let outstanding_loan = loanAmount;

      outstanding_loan = outstanding_loan - towards_loan

    table += '<tr>';
    table += '<td>'+i;
    table += '</td>';
    table += '<td>'+Math.round(emi).toLocaleString('en-IN');
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_loan)).toLocaleString('en-IN');
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_interest)).toLocaleString('en-IN');
    table += '</td>'; 
    table += '<td>'+Math.max(0, Math.round(outstanding_loan)).toLocaleString('en-IN');
    table += '</td>'; 
    table += '</tr>';

    loanAmount = outstanding_loan;

  }

  table += '</tbody></table>';
  myTable.innerHTML = table;
}



const smartDisplayTable = () => {
let hike_EMI_Value = hikeEMI.value
let emi = calculateEMI();
let hike_emi = emi;
let total_towards_interest = 0;

  let table = '';
  table += '<table>';
  let prepayment1 = 0;
  let j=0;


table += '<thead><tr><th>Sr</th><th>EMI</th><th>Towards Loan</th><th>Towards Interest</th><th>Outstanding Loan</th><th>Prepayment</th></tr></thead><tbody id="myTbody"></tbody>'; 

  for(let i=1; i<=loanTenure; i++){

//debugger;


  let prepayment = 0;
  let towards_interest = loanAmount*interest;
  
  let outstanding_loan = loanAmount;




  if(i%12 == 0){
    prepayment = emi;
  }

   

  if(i == 13 || j == 13){
//console.log("i value "+i)
    let percentage = hike_emi*hike_EMI_Value/100;
    hike_emi = hike_emi+percentage;
    j=1;   
  }

  j++;

let towards_loan = hike_emi - towards_interest;  
outstanding_loan = outstanding_loan - (towards_loan+prepayment1);
  


  if(towards_interest <= 0){

    hike_emi = 0;
    towards_loan = 0;
    towards_interest = 0;
    prepayment = 0;
  }

  total_towards_interest += towards_interest;


    table += '<tr>';
    table += '<td>'+i;
    table += '</td>';
    table += '<td>'+Math.round(hike_emi).toLocaleString('en-IN');
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_loan)).toLocaleString('en-IN');
    table += '</td>';
    table += '<td>'+Math.max(0, Math.round(towards_interest)).toLocaleString('en-IN');
    table += '</td>'; 
    table += '<td>'+Math.max(0, Math.round(outstanding_loan)).toLocaleString('en-IN');
    table += '</td>'; 
    table += '<td>'+Math.max(0, Math.round(prepayment)).toLocaleString('en-IN');
    table += '</td>';     
    table += '</tr>';

    
    prepayment1 = prepayment;
    loanAmount = outstanding_loan;

  }



  table += '</tbody></table>';
  myTable.innerHTML = table;


  document.querySelectorAll(".value")[1].innerHTML = "<del style='color:gray'>"+totalInterestPayable.toLocaleString('en-IN')+"</del><span> </span>"+Math.round(total_towards_interest).toLocaleString('en-IN');
  document.querySelectorAll(".value")[2].innerHTML = "<del style='color:gray'>"+totalAmount.toLocaleString('en-IN')+"</del><span> </span>"+Math.round(total_towards_interest+parseInt(loanAmountInput.value)).toLocaleString('en-IN');

 if (myChart) {
    updateChart(Math.round(total_towards_interest));
  } else {
    displayChart(Math.round(total_towards_interest));
  }
console.log(myChart);
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



