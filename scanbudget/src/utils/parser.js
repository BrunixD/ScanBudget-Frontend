// Regex to find common date formats (DD/MM/YYYY, MM-DD-YY, YYYY-MM-DD)
const dateRegex = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})|(\d{4}-\d{2}-\d{2})/;

// Regex to find amounts, usually preceded by "Total", "TOTAL", "Amount"
// It looks for the keyword, then anything, then a number like 123.45
const totalRegex = /(?:total|amount|subtotal|balance\s*due)[\s:]*([\$€£]?\s*\d+\.\d{2})/i;

// A simple rule-based categorizer
const categoryRules = {
  'groceries': ['lidl', 'aldi', 'tesco', 'walmart', 'supervalu'],
  'transport': ['shell', 'texaco', 'uber', 'bolt', 'trainline'],
  'food': ['mcdonalds', 'burger king', 'starbucks', 'costa'],
  'shopping': ['amazon', 'ikea', 'zara'],
};

function getCategory(text) {
  const lowerText = text.toLowerCase();
  for (const category in categoryRules) {
    for (const keyword of categoryRules[category]) {
      if (lowerText.includes(keyword)) {
        return category;
      }
    }
  }
  return 'miscellaneous'; // Default category
}

export function parseReceiptText(text) {
  const dateMatch = text.match(dateRegex);
  const totalMatch = text.match(totalRegex);
  
  // Clean up the total by removing currency symbols and whitespace
  const cleanTotal = totalMatch ? parseFloat(totalMatch[1].replace(/[^0-9.]/g, '')) : null;

  const extractedData = {
    date: dateMatch ? new Date(dateMatch[0]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    total: cleanTotal,
    category: getCategory(text),
    rawText: text,
  };
  
  return extractedData;
}