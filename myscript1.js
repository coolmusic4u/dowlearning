const API_KEY = 'your_api_key'; // Replace this with your API key
const API_URL = `https://open.er-api.com/v6/latest/TWD?apikey=${API_KEY}&symbols=MYR,CNY,SGD,HKD`;


// option 1  change tw to other currency
$('#twd').on('input', function () {
  const twdAmount = parseFloat($(this).val());
  if (isNaN(twdAmount) || twdAmount < 0) {

    //if no amount or negative amount at twd, reset to 0
    resetResults();
    return;
  }

  fetchExchangeRates(twdAmount);
});


// option 2 bean ratio and amount to calculate currency
$('#bean-ratio, #bean-amount').on('input', function () {
  const beanRatio = parseFloat($('#bean-ratio').val());
  const beanAmount = parseFloat($('#bean-amount').val()) * 10000;
  if (isNaN(beanRatio) || isNaN(beanAmount) || beanRatio <= 0 || beanAmount < 0) {
    resetBeanResults();
    return;
  }

  fetchBeanExchangeRates(beanRatio, beanAmount);
});



// Fetch initial exchange rates when the page loads
fetch(API_URL)
.then(response => response.json())
.then(data => {
const rates = data.rates;
// displayExchangeRates(data.date, rates);
});

// Initialize calculations for the Bean Conversion tab
$('#bean-ratio').trigger('input');



//end
// Add event listeners for Option 3 input fields
$('input[name="gift-type"], input[name="deduction-percentage"]').on('change', calculateOption3);



$('#total-bean-value').on('input', calculateOption3);
$('#total-bean-value, #bean-ratio-option3').on('input', calculateOption3);

// Initialize Option 3 calculations
calculateOption3();



function resetResults() {
  $('#myr').text('0.00');
  $('#rmb').text('0.00');
  $('#sgd').text('0.00');
  $('#hkd').text('0.00');
}

function fetchExchangeRates(twdAmount) {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;

      const myrAmount = (twdAmount * rates.MYR).toFixed(2);
      const rmbAmount = (twdAmount * rates.CNY).toFixed(2);
      const sgdAmount = (twdAmount * rates.SGD).toFixed(2);
      const hkdAmount = (twdAmount * rates.HKD).toFixed(2);
	  
      $('#myr').text(myrAmount);
      $('#rmb').text(rmbAmount);
      $('#sgd').text(sgdAmount);
      $('#hkd').text(hkdAmount);
    })

    .catch(error => {
      console.error('Error fetching exchange rates:', error);
      alert('An error occurred while fetching exchange rates. Please try again later.');
    });


}

function resetBeanResults() {
  $('#bean-twd').text('0.00');
  $('#bean-myr').text('0.00');
  $('#bean-rmb').text('0.00');
  $('#bean-sgd').text('0.00');
  $('#bean-hkd').text('0.00');
}

function fetchBeanExchangeRates(beanRatio, beanAmount) {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;

      const twdAmount = (beanAmount / beanRatio).toFixed(2);
      const myrAmount = (twdAmount * rates.MYR).toFixed(2);
      const rmbAmount = (twdAmount * rates.CNY).toFixed(2);
      const sgdAmount = (twdAmount * rates.SGD).toFixed(2);
      const hkdAmount = (twdAmount * rates.HKD).toFixed(2);

      $('#bean-twd').text(twdAmount);
      $('#bean-myr').text(myrAmount);
      $('#bean-rmb').text(rmbAmount);
      $('#bean-sgd').text(sgdAmount);
      $('#bean-hkd').text(hkdAmount);

// Display exchange rates at thetop of the page
// displayExchangeRates(data.date, rates);
})
.catch(error => {
console.error('Error fetching exchange rates:', error);
alert('An error occurred while fetching exchange rates. Please try again later.');
});
}

function displayExchangeRates(date, rates) {
  $('#exchange-rates').html(`
    <span>台幣 兌 馬幣: ${rates.MYR.toFixed(4)}</span>
    <span>台幣 兌 人民幣: ${rates.CNY.toFixed(4)}</span>
    <span>台幣 兌 新幣: ${rates.SGD.toFixed(4)}</span>
    <span>台幣 兌 港幣: ${rates.HKD.toFixed(4)}</span>
  `);
}

function calculateOption3() {
  const giftType = $('input[name="gift-type"]:checked').val();
  const totalBeanValue = parseFloat($('#total-bean-value').val());
  const deductionPercentage = parseFloat($('input[name="deduction-percentage"]:checked').val());
  const beanRatio = parseFloat($('#bean-ratio-option3').val());

  if (isNaN(totalBeanValue) || isNaN(beanRatio)) {
    return;
  }

  const gifts = {
    cake: { value: 288, rate: 0.35 },
    boat: { value: 999, rate: 0.35 },
    panda: { value: 100, rate: 0.35 },
    star: { value: 100, rate: 0.25 },
  };

  //total bean value = 100 (w)
  const gift = gifts[giftType];
  const numberOfGifts = Math.ceil(totalBeanValue*10000 / gift.value);
  let convertedBeans = totalBeanValue*10000 *( gift.rate - deductionPercentage);

  convertedBeans10000 = (convertedBeans / 10000).toFixed(2);

  $('#option3-gifts').text(numberOfGifts);
  $('#option3-converted-beans').text(convertedBeans10000+ " 萬");

  //start of exchange
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;

      const twdAmount = (convertedBeans / beanRatio).toFixed(2);
      const myrAmount = (twdAmount * rates.MYR).toFixed(2);
      const rmbAmount = (twdAmount * rates.CNY).toFixed(2);
      const sgdAmount = (twdAmount * rates.SGD).toFixed(2);
      const hkdAmount = (twdAmount * rates.HKD).toFixed(2);
    
      $('#option3-twd').text(twdAmount);
      $('#option3-myr').text(myrAmount);
      $('#option3-rmb').text(rmbAmount);
      $('#option3-sgd').text(sgdAmount);
      $('#option3-hkd').text(hkdAmount);

// Display exchange rates at thetop of the page
// displayExchangeRates(data.date, rates);
})
.catch(error => {
console.error('Error fetching exchange rates:', error);
alert('An error occurred while fetching exchange rates. Please try again later.');
});
//end of exchange

}


// On change of Pig to Bean conversion ratio
$('#pigbean-ratio').on('input', function () {
  // Re-calculate the bean amount based on new pigbean ratio and current pig amount
  const pigBeanRatio = parseFloat($('#pigbean-ratio').val());
  const pigAmount = parseFloat($('#pig-amount').val());
  if (isNaN(pigBeanRatio) || pigBeanRatio <= 0) return;

  const newBeanAmount = (pigAmount * (pigBeanRatio / 1000)).toFixed(0);
  $('#bean-amount-from-pig').val(newBeanAmount);

  fetchPigExchangeRates();
});

// On change of Pig amount
$('#pig-amount').on('input', function () {
  // Re-calculate the bean amount based on new pig amount and current pigbean ratio
  const pigBeanRatio = parseFloat($('#pigbean-ratio').val());
  const pigAmount = parseFloat($('#pig-amount').val());
  if (isNaN(pigAmount) || pigAmount < 0) return;

  const newBeanAmount = (pigAmount * (pigBeanRatio / 1000)).toFixed(0);
  $('#bean-amount-from-pig').val(newBeanAmount);

  fetchPigExchangeRates();
});

// On change of Bean amount (from pig conversion)
$('#bean-amount-from-pig').on('input', function () {
  // Re-calculate the pig amount based on new bean amount and current pigbean ratio
  const pigBeanRatio = parseFloat($('#pigbean-ratio').val());
  const beanAmountFromPig = parseFloat($('#bean-amount-from-pig').val());

  if (isNaN(beanAmountFromPig) || beanAmountFromPig < 0) return;

  const newPigAmount = (beanAmountFromPig / (pigBeanRatio / 1000)).toFixed(0);
  $('#pig-amount').val(newPigAmount);
  
  fetchPigExchangeRates();
  });
  
  // On change of Pig to TWD ratio
  $('#pig-ratio').on('input', fetchPigExchangeRates);
  
  function fetchPigExchangeRates() {
    const pigRatio = parseFloat($('#pig-ratio').val());
    const beanAmountFromPig = parseFloat($('#bean-amount-from-pig').val());
    if (isNaN(pigRatio) || isNaN(beanAmountFromPig) || pigRatio <= 0 || beanAmountFromPig < 0) {
      resetPigResults();
      return;
    }
  
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        const rates = data.rates;
  
        const twdAmount = (beanAmountFromPig / pigRatio).toFixed(2);
        const myrAmount = (twdAmount * rates.MYR).toFixed(2);
        const rmbAmount = (twdAmount * rates.CNY).toFixed(2);
        const sgdAmount = (twdAmount * rates.SGD).toFixed(2);
        const hkdAmount = (twdAmount * rates.HKD).toFixed(2);
  
        $('#pig-twd').text(twdAmount);
        $('#pig-myr').text(myrAmount);
        $('#pig-rmb').text(rmbAmount);
        $('#pig-sgd').text(sgdAmount);
        $('#pig-hkd').text(hkdAmount);
  
        // Display exchange rates at the top of the page
        // displayExchangeRates(data.date, rates);
      })
      .catch(error => {
        console.error('Error fetching exchange rates:', error);
        alert('An error occurred while fetching exchange rates. Please try again later.');
      });
  }
  
  function resetPigResults() {
    $('#pig-twd, #pig-myr, #pig-rmb, #pig-sgd, #pig-hkd').text('0.00');
  }
  
  // Initialize calculations for the Pig Conversion tab
  $('#pig-ratio, #pig-amount, #bean-amount-from-pig').trigger('input');




