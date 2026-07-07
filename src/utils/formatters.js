/**
 * Formatadores para valores monetários, percentuais e quantidades
 * Padrão brasileiro: R$ 1.234,56 | 5,00% | 4 casas decimais em quantidades
 */

/**
 * Formata valor como moeda brasileira
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado como R$ 1.234,56
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata valor como percentual
 * @param {number} value - Valor decimal (0.05 = 5%)
 * @returns {string} Valor formatado como 5,00%
 */
export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0,00%';
  return (value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }) + '%';
}

/**
 * Formata quantidade com 4 casas decimais (SIGDV-03)
 * @param {number} value - Valor numérico
 * @param {number} decimals - Número de casas decimais (padrão 4)
 * @returns {string} Valor formatado com separador BR
 */
export function formatQuantity(value, decimals = 4) {
  if (value === null || value === undefined || isNaN(value)) return '0,0000';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Parseia entrada de percentual: aceita "5%", "5", "0,05", "0.05"
 * Normaliza para decimal (0.05)
 * @param {string} input - Entrada do usuário
 * @returns {number} Valor decimal normalizado
 */
export function parsePercent(input) {
  if (input === null || input === undefined || input === '') return 0;
  if (typeof input === 'number') return input;
  let str = String(input).trim().replace('%', '');
  str = str.replace(',', '.');
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return num / 100;
}

/**
 * Parseia entrada monetária BR: "1.234,56" → 1234.56
 * @param {string} input - Entrada do usuário
 * @returns {number} Valor numérico
 */
export function parseCurrency(input) {
  if (input === null || input === undefined || input === '') return 0;
  if (typeof input === 'number') return input;
  let str = String(input).trim().replace('R$', '').trim();
  // Remove pontos de milhar e troca vírgula decimal por ponto
  str = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Parseia entrada de quantidade BR: "1.234,5678" → 1234.5678
 * @param {string} input - Entrada do usuário
 * @returns {number} Valor numérico
 */
export function parseQuantity(input) {
  if (input === null || input === undefined || input === '') return 0;
  if (typeof input === 'number') return input;
  let str = String(input).trim();
  // Se contém vírgula, assume formato BR
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Formata valor numérico baseado no tipo da coluna
 * @param {*} value - Valor a formatar
 * @param {string} type - Tipo: 'currency', 'percent', 'quantity', 'text', 'select'
 * @returns {string} Valor formatado
 */
export function formatByType(value, type) {
  switch (type) {
    case 'currency': return formatCurrency(value);
    case 'percent': return formatPercent(value);
    case 'quantity': return formatQuantity(value);
    case 'text': return value || '';
    case 'select': return value || '';
    default: return String(value ?? '');
  }
}

/**
 * Parseia entrada do usuário baseado no tipo da coluna
 * @param {string} input - Entrada do usuário
 * @param {string} type - Tipo: 'currency', 'percent', 'quantity', 'text', 'select'
 * @returns {*} Valor parseado
 */
export function parseByType(input, type) {
  switch (type) {
    case 'currency': return parseCurrency(input);
    case 'percent': return parsePercent(input);
    case 'quantity': return parseQuantity(input);
    case 'text': return input || '';
    case 'select': return input || '';
    default: return input;
  }
}

/**
 * Formata data para exibição BR
 * @param {string|Date} date - Data
 * @returns {string} dd/mm/aaaa
 */
export function formatDate(date) {
  if (!date) return '';
  
  // Previne bug de timezone do JS (que converte YYYY-MM-DD para UTC e exibe -3h local, subtraindo 1 dia)
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    const [y, m, d] = date.trim().split('-');
    return `${d}/${m}/${y}`;
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata número do contrato
 * @param {string} numero - Número do contrato
 * @returns {string} Formatado
 */
export function formatContratoNumero(numero) {
  return numero || '';
}
