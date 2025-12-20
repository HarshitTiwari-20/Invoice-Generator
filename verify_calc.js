const GST_RATE = 0.18;
const totalPrice = 123333.00;

const taxableValue = totalPrice / (1 + GST_RATE);
const totalTax = totalPrice - taxableValue;
const cgst = totalTax / 2;
const sgst = totalTax / 2;

console.log(`Input Total: ${totalPrice}`);
console.log(`Taxable Value: ${taxableValue.toFixed(2)} (Expected: 1,04,519.49)`);
console.log(`CGST: ${cgst.toFixed(2)} (Expected: 9,406.75)`);
console.log(`SGST: ${sgst.toFixed(2)} (Expected: 9,406.75)`);
console.log(`Total Calculated Tax: ${(cgst + sgst).toFixed(2)}`);
console.log(`Difference from Total Taxable + Tax: ${(parseFloat(taxableValue.toFixed(2)) + parseFloat(cgst.toFixed(2)) + parseFloat(sgst.toFixed(2))).toFixed(2)} (vs ${totalPrice})`);
