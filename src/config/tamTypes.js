/**
 * Configuração declarativa dos tipos de TAM (Termo Aditivo e Modificativo)
 * Cada tipo define: colunas visíveis, editáveis, protegidas, calculadas,
 * fórmulas de cálculo e validações.
 */

// Definição dos rótulos das colunas
export const COLUMN_LABELS = {
  codigoItem: 'Cód. do Item',
  descricao: 'Descrição',
  qtdVigente: 'Qtd. Vigente',
  precoUnitVigente: 'Preço Unit. Vigente (R$)',
  valorTotalVigente: 'Valor Total Vigente (R$)',
  variacaoQtd: 'Variação de Qtd.',
  qtdAcrescida: 'Qtd. Acrescida',
  qtdSuprimida: 'Qtd. Suprimida',
  anularMedicao: 'Anular ao término da medição:',
  anularPeriodo: 'Anular ao término do período:',
  descUnitPerc: 'Desc. Unit. (%)',
  descUnitValor: 'Desc. Unit. (R$)',
  descUnitTotal: 'Desc. Unit. Total (R$)',
  reajUnitPerc: 'Reaj. Unit. (%)',
  reajUnitValor: 'Reaj. Unit. (R$)',
  reajUnitTotal: 'Reaj. Unit. Total (R$)',
  qtdFinal: 'Qtd. Final',
  precoUnitFinal: 'Preço Unit. Final (R$)',
  valorFinal: 'Valor Final (R$)',
};

// Fórmulas para tooltips nas colunas calculadas
export const CALC_TOOLTIPS = {
  valorTotalVigente: 'Cálculo: Qtd. Vigente × Preço Unit. Vigente',
  descUnitTotal: 'Cálculo: Preço Unit. Vigente × Desc. Unit. (%) + Desc. Unit. (R$)',
  reajUnitTotal: 'Cálculo: Preço Unit. Vigente × Reaj. Unit. (%) + Reaj. Unit. (R$)',
  qtdFinal: 'Cálculo: Qtd. Vigente + Variações (Acréscimo, Supressão, etc.)',
  precoUnitFinal: 'Cálculo: Preço Unit. Vigente após Descontos e Reajustes',
  valorFinal: 'Cálculo: Qtd. Final × Preço Unit. Final'
};

// Tipo de dado para formatação
export const COLUMN_TYPES = {
  codigoItem: 'text',
  descricao: 'text',
  qtdVigente: 'quantity',
  precoUnitVigente: 'currency',
  valorTotalVigente: 'currency',
  variacaoQtd: 'quantity',
  qtdAcrescida: 'quantity',
  qtdSuprimida: 'quantity',
  anularMedicao: 'select_medicao',
  anularPeriodo: 'select_periodo',
  descUnitPerc: 'percent',
  descUnitValor: 'currency',
  descUnitTotal: 'currency',
  reajUnitPerc: 'percent',
  reajUnitValor: 'currency',
  reajUnitTotal: 'currency',
  qtdFinal: 'quantity',
  precoUnitFinal: 'currency',
  valorFinal: 'currency',
};

// Removido ANULAR_OPTIONS estático. As opções serão dinâmicas (medições ou períodos)

// Larguras sugeridas para cada coluna (em px)
export const COLUMN_WIDTHS = {
  codigoItem: 65,
  descricao: 200,
  qtdVigente: 85,
  precoUnitVigente: 110,
  valorTotalVigente: 120,
  variacaoQtd: 90,
  qtdSuprimida: 90,
  anularMedicao: 150,
  anularPeriodo: 150,
  descUnitPerc: 75,
  descUnitValor: 95,
  descUnitTotal: 110,
  reajUnitPerc: 75,
  reajUnitValor: 95,
  reajUnitTotal: 110,
  qtdFinal: 85,
  precoUnitFinal: 110,
  valorFinal: 120,
};

/**
 * Funções de cálculo reutilizáveis
 */
const calcDescUnitTotal = (row) => {
  const base = row.precoUnitVigente || 0;
  const perc = row.descUnitPerc || 0;
  const valor = row.descUnitValor || 0;
  return Number((base * perc + valor).toFixed(2));
};

const calcReajUnitTotal = (row) => {
  const base = row.precoUnitVigente || 0;
  const perc = row.reajUnitPerc || 0;
  const valor = row.reajUnitValor || 0;
  return Number((base * perc + valor).toFixed(2));
};

const calcValorTotalVigente = (row) => {
  return Number(((row.qtdVigente || 0) * (row.precoUnitVigente || 0)).toFixed(2));
};

/**
 * Configuração principal dos tipos de TAM
 */
export const TAM_TYPES = {
  PRORROGACAO: {
    key: 'PRORROGACAO',
    label: 'Prorrogação',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'variacaoQtd', 'descUnitPerc', 'descUnitValor', 'descUnitTotal',
      'reajUnitPerc', 'reajUnitValor', 'reajUnitTotal',
      'qtdFinal', 'precoUnitFinal', 'valorFinal'
    ],
    editable: ['variacaoQtd', 'descUnitPerc', 'descUnitValor', 'reajUnitPerc', 'reajUnitValor'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['descUnitTotal', 'reajUnitTotal', 'qtdFinal', 'precoUnitFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const descUnitTotal = calcDescUnitTotal(row);
      const reajUnitTotal = calcReajUnitTotal(row);
      const valorTotalVigente = calcValorTotalVigente(row);
      const qtdFinal = (row.qtdVigente || 0) + (row.variacaoQtd || 0);
      const precoUnitFinal = Number(((row.precoUnitVigente || 0) - descUnitTotal + reajUnitTotal).toFixed(2));
      const valorFinal = Number((qtdFinal * precoUnitFinal).toFixed(2));
      return { ...row, descUnitTotal, reajUnitTotal, valorTotalVigente, qtdFinal, precoUnitFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
    },
    validations: [
      { field: 'qtdFinal', rule: 'gte0', message: 'Qtd. Final não pode ser negativa.' },
    ],
  },

  PRORROGACAO_EXCEPCIONALIDADE: {
    key: 'PRORROGACAO_EXCEPCIONALIDADE',
    label: 'Prorrogação por Excepcionalidade',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'variacaoQtd', 'descUnitPerc', 'descUnitValor', 'descUnitTotal',
      'reajUnitPerc', 'reajUnitValor', 'reajUnitTotal',
      'qtdFinal', 'precoUnitFinal', 'valorFinal'
    ],
    editable: ['variacaoQtd', 'descUnitPerc', 'descUnitValor', 'reajUnitPerc', 'reajUnitValor'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['descUnitTotal', 'reajUnitTotal', 'qtdFinal', 'precoUnitFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const descUnitTotal = calcDescUnitTotal(row);
      const reajUnitTotal = calcReajUnitTotal(row);
      const valorTotalVigente = calcValorTotalVigente(row);
      const qtdFinal = (row.qtdVigente || 0) + (row.variacaoQtd || 0);
      const precoUnitFinal = Number(((row.precoUnitVigente || 0) - descUnitTotal + reajUnitTotal).toFixed(2));
      const valorFinal = Number((qtdFinal * precoUnitFinal).toFixed(2));
      return { ...row, descUnitTotal, reajUnitTotal, valorTotalVigente, qtdFinal, precoUnitFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
    },
    validations: [
      { field: 'qtdFinal', rule: 'gte0', message: 'Qtd. Final não pode ser negativa.' },
    ],
  },

  ACRESCIMO: {
    key: 'ACRESCIMO',
    label: 'Acréscimo',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'qtdAcrescida', 'qtdFinal', 'valorFinal'
    ],
    editable: ['qtdAcrescida'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['qtdFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const valorTotalVigente = calcValorTotalVigente(row);
      const qtdFinal = (row.qtdVigente || 0) + (row.qtdAcrescida || 0);
      const valorFinal = Number((qtdFinal * (row.precoUnitVigente || 0)).toFixed(2));
      return { ...row, valorTotalVigente, qtdFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
      qtdAcrescida: 'sum',
    },
    validations: [
      { field: 'qtdFinal', rule: 'gte0', message: 'Qtd. Final não pode ser negativa.' },
      { field: 'qtdAcrescida', rule: 'gte0', message: 'Qtd. Acrescida deve ser positiva.' },
    ],
  },

  SUPRESSAO: {
    key: 'SUPRESSAO',
    label: 'Supressão',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'qtdSuprimida', 'qtdFinal', 'valorFinal'
    ],
    editable: ['qtdSuprimida'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['qtdFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const valorTotalVigente = calcValorTotalVigente(row);
      const qtdFinal = (row.qtdVigente || 0) - (row.qtdSuprimida || 0);
      const valorFinal = Number((qtdFinal * (row.precoUnitVigente || 0)).toFixed(2));
      return { ...row, valorTotalVigente, qtdFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
      qtdSuprimida: 'sum',
    },
    validations: [
      { field: 'qtdSuprimida', rule: 'lteField', compareField: 'qtdVigente', message: 'Qtd. Suprimida não pode ser maior que Qtd. Vigente.' },
      { field: 'qtdFinal', rule: 'gte0', message: 'Qtd. Final não pode ser negativa.' },
    ],
  },

  ANULACAO: {
    key: 'ANULACAO',
    label: 'Anulação',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'anularMedicao', 'anularPeriodo', 'qtdFinal', 'valorFinal'
    ],
    editable: ['anularMedicao', 'anularPeriodo'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['qtdFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const valorTotalVigente = calcValorTotalVigente(row);
      // O item é anulado se alguma medição ou período for selecionado.
      const anular = !!row.anularMedicao || !!row.anularPeriodo;
      const qtdFinal = anular ? 0 : (row.qtdVigente || 0);
      const valorFinal = anular ? 0 : valorTotalVigente;
      return { ...row, valorTotalVigente, qtdFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
    },
    validations: [],
  },

  REAJUSTE: {
    key: 'REAJUSTE',
    label: 'Reajuste',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'descUnitPerc', 'descUnitValor', 'descUnitTotal',
      'reajUnitPerc', 'reajUnitValor', 'reajUnitTotal',
      'precoUnitFinal', 'valorFinal'
    ],
    editable: ['descUnitPerc', 'descUnitValor', 'reajUnitPerc', 'reajUnitValor'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['descUnitTotal', 'reajUnitTotal', 'precoUnitFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const valorTotalVigente = calcValorTotalVigente(row);
      const descUnitTotal = calcDescUnitTotal(row);
      const reajUnitTotal = calcReajUnitTotal(row);
      const precoUnitFinal = Number(((row.precoUnitVigente || 0) - descUnitTotal + reajUnitTotal).toFixed(2));
      const valorFinal = Number(((row.qtdVigente || 0) * precoUnitFinal).toFixed(2));
      return { ...row, valorTotalVigente, descUnitTotal, reajUnitTotal, precoUnitFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
    },
    validations: [
      { field: 'precoUnitFinal', rule: 'warnDecrease', baseField: 'precoUnitVigente', message: 'Atenção: o reajuste está reduzindo o preço unitário.' },
    ],
  },

  DESCONTO: {
    key: 'DESCONTO',
    label: 'Desconto',
    columns: [
      'codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente',
      'descUnitPerc', 'descUnitValor', 'descUnitTotal',
      'precoUnitFinal', 'valorFinal'
    ],
    editable: ['descUnitPerc', 'descUnitValor'],
    protected: ['codigoItem', 'descricao', 'qtdVigente', 'precoUnitVigente', 'valorTotalVigente'],
    calculated: ['descUnitTotal', 'precoUnitFinal', 'valorFinal', 'valorTotalVigente'],
    allowNewItem: false,
    calcRow: (row) => {
      const valorTotalVigente = calcValorTotalVigente(row);
      const descUnitTotal = calcDescUnitTotal(row);
      const precoUnitFinal = Number(((row.precoUnitVigente || 0) - descUnitTotal).toFixed(2));
      const valorFinal = Number(((row.qtdVigente || 0) * precoUnitFinal).toFixed(2));
      return { ...row, valorTotalVigente, descUnitTotal, precoUnitFinal, valorFinal };
    },
    totals: {
      itemCount: true,
      valorTotalVigente: 'sum',
      valorFinal: 'sum',
    },
    validations: [
      { field: 'precoUnitFinal', rule: 'gte0', message: 'Preço Unit. Final não pode ser negativo.' },
      { field: 'precoUnitFinal', rule: 'warnIncrease', baseField: 'precoUnitVigente', message: 'Atenção: o desconto está aumentando o preço unitário.' },
    ],
  },
};

/**
 * Lista de tipos para dropdown
 */
export const TAM_TYPE_OPTIONS = Object.values(TAM_TYPES).map(t => ({
  value: t.key,
  label: t.label,
}));

/**
 * Obtém configuração de um tipo de TAM pelo key
 */
export function getTAMConfig(typeKey) {
  return TAM_TYPES[typeKey] || null;
}
