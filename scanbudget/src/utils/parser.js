/**
 * Analisa o texto bruto de um recibo para extrair dados estruturados,
 * focando-se na lista de itens após uma linha de cabeçalho.
 * @param {string} text - O texto extraído pelo OCR.
 * @returns {object} - Um objeto com os dados do recibo.
 */
export function parseReceiptText(text) {
  const lines = text.split('\n');

  let merchant = 'Desconhecido';
  let date = new Date().toISOString().split('T')[0];
  let total = null;
  const items = [];
  
  // ==========================================================
  // 1. Extração de Metadados (Loja e Data) - Lógica geral
  // ==========================================================
  
  // Tenta encontrar o nome da loja na primeira linha
  if (lines.length > 0) {
    merchant = lines[0].trim();
  }
  
  const dateRegex = /(\d{2}[-.\/]\d{2}[-.\/]\d{2,4})/;
  const dateMatch = text.match(dateRegex);
  if (dateMatch && dateMatch[0]) {
    let [day, month, year] = dateMatch[0].replace(/[.\/]/g, '-').split('-');
    if (year.length === 2) year = `20${year}`;
    date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // ==========================================================
  // 2. Extração Estruturada de Itens e Categorias
  // ==========================================================
  
  let currentItemCategory = 'Geral'; // Categoria padrão
  let processingItems = false; // Flag para saber se estamos na secção de itens

  // Palavras-chave que indicam o início e o fim da lista de itens
  const startKeywords = ['descricao', 'descrição', 'descricau'];
  const endKeywords = ['total', 'multibanco', 'mb way', 'contribuinte', 'nif', 'iva', 'resumo'];

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();
    if (!lowerLine) continue; // Ignora linhas vazias

    // Inicia o processamento quando encontramos o cabeçalho da lista de itens
    if (!processingItems && startKeywords.some(kw => lowerLine.includes(kw))) {
      processingItems = true;
      continue; // Pula para a próxima linha
    }

    // Para o processamento se encontrarmos uma palavra-chave de fim
    if (processingItems && endKeywords.some(kw => lowerLine.startsWith(kw))) {
      processingItems = false;
      break; // Saímos do loop, a lista de itens terminou
    }

    if (processingItems) {
      // Regex para encontrar um valor no final da linha (ex: " 1,29" ou " 1.29")
      const valueMatch = line.match(/(-?\d+[,.]\d{2})\s*$/);

      if (valueMatch) {
        // Se a linha tem um valor no final, é um ITEM
        const value = parseFloat(valueMatch[1].replace(',', '.'));
        
        // O nome do item é tudo o que vem antes do valor
        const name = line.substring(0, valueMatch.index).trim();

        // Limpeza adicional do nome (remover códigos, letras de imposto, etc.)
        const cleanedName = name.replace(/^\(?[A-Z]\)?\s*/, '').replace(/ (BI-PACK|POUPANCA)\s*$/, '').trim();

        if (cleanedName.length > 2) {
          items.push({
            name: cleanedName,
            value: value,
            category: currentItemCategory, // Associa à última categoria encontrada
          });
        }
      } else {
        // Se a linha NÃO tem um valor no final, é uma CATEGORIA
        // Ignoramos linhas muito curtas ou com "POUPANCA", etc.
        if (line.length > 3 && !line.includes('---') && !line.toLowerCase().includes('poupanca')) {
            currentItemCategory = line.trim().replace(/:$/, ''); // Define a nova categoria e remove ':' do final
        }
      }
    }
  }

  // ==========================================================
  // 3. Cálculo do Total
  // ==========================================================

  const totalRegex = /total[\s:]*([€$]?\s*\d+[,.]\d{2})/i;
  const totalMatch = text.match(totalRegex);
  if (totalMatch && totalMatch[1]) {
    total = parseFloat(totalMatch[1].replace(/[^0-9,.]/g, '').replace(',', '.'));
  } else if (items.length > 0) {
    // Fallback: se não encontrarmos um "TOTAL", somamos os itens
    total = items.reduce((sum, item) => sum + item.value, 0);
  }

  return {
    merchant,
    date,
    total: total ? parseFloat(total.toFixed(2)) : null,
    items,
    rawText: text,
  };
}