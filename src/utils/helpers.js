// src/utils/helpers.js
export const formatMoney = (amount, isAED, fxRate, baseCurrency = 'AED') => {
  let displayAmount = amount;
  
  // If the transaction is in AED but we are viewing in INR
  if (baseCurrency === 'AED' && !isAED) {
    displayAmount = amount * fxRate;
  } 
  // If the transaction is in INR but we are viewing in AED
  else if (baseCurrency === 'INR' && isAED) {
    displayAmount = amount / fxRate;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: isAED ? 'AED' : 'INR',
    maximumFractionDigits: 0,
  }).format(displayAmount);
};