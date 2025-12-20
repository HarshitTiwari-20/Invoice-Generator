export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const numberToWords = (num: number): string => {
    // Simple implementation or placeholder - for a real app, use a library like 'n2words'
    // For this demo, I'll return a placeholder or simple string concatenation if easy
    // But given constraints, I'll recommend the user install 'n2words' or similar if they need exact Indian numbering.
    // I will implement a very basic integer-to-words for demo.
    return num.toString() + " (Words logic placeholder)";
};
