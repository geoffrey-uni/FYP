export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};