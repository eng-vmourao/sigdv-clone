/**
 * Itens de medição por medição
 * Cada item contém: item, descrição, unidade, qtd contratada vigente,
 * qtd acumulada anterior, qtd medida no período
 * Campos calculados: qtd acumulada atual, saldo, valor medido, status
 */

const itensMedicao = {
  // Medição 1 do Contrato 20.605-2
  11: [
    { itemId: 101, codigoItem: '1.1', descricao: 'Implantação de Central de Pré-Processamento de Imagens', unidade: 'UN', qtdContratadaVigente: 0, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 0, precoUnitVigente: 237712.44, observacao: '' },
    { itemId: 102, codigoItem: '1.2', descricao: 'Manut. de Central de pré-processamento de Imagens', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 2106.21, observacao: '' },
    { itemId: 103, codigoItem: '1.3', descricao: 'Serviços de pré-processamento das imagens', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 111024.42, observacao: '' },
    { itemId: 104, codigoItem: '1.4', descricao: 'Serviços de apoio no controle de eficiência', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 8430.59, observacao: '' },
    { itemId: 105, codigoItem: '1.5', descricao: 'Serviços de apoio no controle das condições', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 11148.70, observacao: '' },
    { itemId: 106, codigoItem: '1.6', descricao: 'Serviços de apoio na interação com outras áreas', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 13903.70, observacao: '' },
    { itemId: 107, codigoItem: '1.7', descricao: 'Serviços de apoio na elaboração de relatórios', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 23387.90, observacao: '' },
    { itemId: 108, codigoItem: '1.8', descricao: 'Serviços de apoio na fiscalização', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 12848.95, observacao: '' },
    { itemId: 109, codigoItem: '1.9', descricao: 'Serviços de apoio na elaboração de planos', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 5473.63, observacao: '' },
    { itemId: 110, codigoItem: '1.10', descricao: 'Serviços de apoio nas vistorias técnicas', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 6383.54, observacao: '' },
    { itemId: 111, codigoItem: '1.11', descricao: 'Serviços de apoio na análise de novas tecnologias', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 4733.58, observacao: '' },
    { itemId: 112, codigoItem: '1.12', descricao: 'Serviços de apoio no desenv. de banco de dados', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1, precoUnitVigente: 21813.49, observacao: '' },
    { itemId: 113, codigoItem: '1.13', descricao: 'Veículo 1.000 CC (km)', unidade: 'KM', qtdContratadaVigente: 972000, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 81000, precoUnitVigente: 0.76, observacao: '' },
    { itemId: 114, codigoItem: '1.14', descricao: 'Veículo 1.000 CC (diária)', unidade: 'KM', qtdContratadaVigente: 108, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 9, precoUnitVigente: 1930.88, observacao: '' },
  ],

  // Medição 2 do Contrato 20.605-2 (acumula da anterior)
  12: [
    { itemId: 101, codigoItem: '1.1', descricao: 'Implantação de Central', unidade: 'UN', qtdContratadaVigente: 0, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 0, precoUnitVigente: 237712.44, observacao: '' },
    { itemId: 102, codigoItem: '1.2', descricao: 'Manut. de Central', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 1, qtdMedidaPeriodo: 1, precoUnitVigente: 2106.21, observacao: '' },
    { itemId: 103, codigoItem: '1.3', descricao: 'Pré-processamento de imagens', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 1, qtdMedidaPeriodo: 1, precoUnitVigente: 111024.42, observacao: '' },
    { itemId: 104, codigoItem: '1.4', descricao: 'Controle de eficiência', unidade: 'MÊS', qtdContratadaVigente: 12, qtdAcumuladaAnterior: 1, qtdMedidaPeriodo: 1, precoUnitVigente: 8430.59, observacao: '' },
    { itemId: 113, codigoItem: '1.13', descricao: 'Veículo 1.000 CC (km)', unidade: 'KM', qtdContratadaVigente: 972000, qtdAcumuladaAnterior: 81000, qtdMedidaPeriodo: 78500, precoUnitVigente: 0.76, observacao: '' },
    { itemId: 114, codigoItem: '1.14', descricao: 'Veículo 1.000 CC (diária)', unidade: 'KM', qtdContratadaVigente: 108, qtdAcumuladaAnterior: 9, qtdMedidaPeriodo: 9, precoUnitVigente: 1930.88, observacao: '' },
  ],

  // Medição 1 do Contrato 22.583-6
  21: [
    { itemId: 201, codigoItem: '1.1', descricao: 'Tapa-buraco com CBUQ em via simples', unidade: 'T', qtdContratadaVigente: 3500, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 280, precoUnitVigente: 485.20, observacao: '' },
    { itemId: 202, codigoItem: '1.2', descricao: 'Tapa-buraco com CBUQ em via expressa', unidade: 'T', qtdContratadaVigente: 2200, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 175, precoUnitVigente: 612.35, observacao: '' },
    { itemId: 203, codigoItem: '1.3', descricao: 'Remendo profundo com CBUQ', unidade: 'M2', qtdContratadaVigente: 15000, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 1200, precoUnitVigente: 125.80, observacao: '' },
    { itemId: 207, codigoItem: '1.7', descricao: 'Fornecimento e aplicação de CBUQ faixa C', unidade: 'T', qtdContratadaVigente: 6000, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 480, precoUnitVigente: 425.60, observacao: '' },
    { itemId: 208, codigoItem: '1.8', descricao: 'Fornecimento e aplicação de microrrevestimento', unidade: 'M2', qtdContratadaVigente: 120000, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 8500, precoUnitVigente: 18.90, observacao: '' },
    { itemId: 211, codigoItem: '1.11', descricao: 'Sinalização horizontal com termoplástico', unidade: 'M2', qtdContratadaVigente: 35000, qtdAcumuladaAnterior: 0, qtdMedidaPeriodo: 2800, precoUnitVigente: 45.80, observacao: '' },
  ],
};

// Gera itens de medição genéricos para medições sem dados manuais
function generateMedicaoItems(medicaoId, contratoId, numero) {
  const items = [];
  const baseItems = [
    { codigoItem: '1.1', descricao: 'Serviço principal do contrato', unidade: 'VB', qtdContratada: 24, preco: 45000 },
    { codigoItem: '1.2', descricao: 'Serviço complementar A', unidade: 'M3', qtdContratada: 5000, preco: 18.50 },
    { codigoItem: '1.3', descricao: 'Serviço complementar B', unidade: 'T', qtdContratada: 3000, preco: 95.00 },
    { codigoItem: '1.4', descricao: 'Fornecimento de materiais', unidade: 'M3', qtdContratada: 2000, preco: 680.00 },
    { codigoItem: '1.5', descricao: 'Mão de obra especializada', unidade: 'MÊS', qtdContratada: 24, preco: 22000 },
  ];

  for (let i = 0; i < baseItems.length; i++) {
    const b = baseItems[i];
    const acumuladoAnterior = Math.round(b.qtdContratada / 24 * (numero - 1) * 100) / 100;
    const medido = Math.round(b.qtdContratada / 24 * (0.8 + Math.random() * 0.4) * 100) / 100;
    items.push({
      itemId: contratoId * 1000 + i + 1,
      codigoItem: b.codigoItem,
      descricao: b.descricao,
      unidade: b.unidade,
      qtdContratadaVigente: b.qtdContratada,
      qtdAcumuladaAnterior: acumuladoAnterior,
      qtdMedidaPeriodo: medido,
      precoUnitVigente: b.preco,
      observacao: '',
    });
  }
  return items;
}

// Preenche medições que não têm itens manuais
export function getItensMedicao(medicaoId, contratoId, numero) {
  if (itensMedicao[medicaoId]) return itensMedicao[medicaoId];
  return generateMedicaoItems(medicaoId, contratoId, numero);
}

export default itensMedicao;
