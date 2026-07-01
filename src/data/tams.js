/**
 * TAMs mockadas por contrato
 * Cada TAM tem: tipo, período, número (auto SIGDV-09), itens
 * TAMs novas são criadas com quantidades zeradas (SIGDV-06)
 */

const tams = {
  // Contrato 20.605-2 — 3 TAMs
  1: [
    {
      id: 1001, numero: 1, contratoId: 1, tipo: 'PRORROGACAO',
      dataInicio: '2021-06-02', dataTermino: '2022-06-01',
      inicioContrato: '2020-06-02', terminoContrato: '2022-06-01',
      periodo: 2, observacao: 'Prorrogação do contrato de radar estático por mais 12 meses.',
      baseMedicao: 13,
      itens: [
        { codigoItem: '1.1', descricao: 'Implantação de Central de Pré-Processamento de Imagens', qtdVigente: 0, precoUnitVigente: 237712.44, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.2', descricao: 'Manut. de Central de pré-processamento de Imagens', qtdVigente: 12, precoUnitVigente: 2106.21, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.3', descricao: 'Serviços de pré-processamento das imagens geradas pelo equipamentos de fiscalização', qtdVigente: 12, precoUnitVigente: 111024.42, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.4', descricao: 'Serviços de apoio no controle de eficiência de operação dos equipamentos estáticos', qtdVigente: 12, precoUnitVigente: 8430.59, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.5', descricao: 'Serviços de apoio no controle das condições dos equipamentos estáticos e fixos', qtdVigente: 12, precoUnitVigente: 11148.70, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.6', descricao: 'Serviços de apoio na interação com outras áreas internas e externas do DER/SP', qtdVigente: 12, precoUnitVigente: 13903.70, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Serviços de apoio ao DER/SP na elaboração de relatórios técnicos', qtdVigente: 12, precoUnitVigente: 23387.90, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.8', descricao: 'Serviços de apoio ao DER/SP na fiscalização da realização da operação dos equipamentos', qtdVigente: 12, precoUnitVigente: 12848.95, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.9', descricao: 'Serviços de apoio ao DER/SP na elaboração de planos de trabalhos mensais', qtdVigente: 12, precoUnitVigente: 5473.63, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.10', descricao: 'Serviços de apoio ao DER/SP nas vistorias técnicas', qtdVigente: 12, precoUnitVigente: 6383.54, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.11', descricao: 'Serviços de apoio ao DER/SP na análise de novas tecnologias', qtdVigente: 12, precoUnitVigente: 4733.58, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.12', descricao: 'Serviços de apoio ao DER/SP no desenvolvimento de banco de dados', qtdVigente: 12, precoUnitVigente: 21813.49, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.13', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', qtdVigente: 972000, precoUnitVigente: 0.76, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
        { codigoItem: '1.14', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', qtdVigente: 108, precoUnitVigente: 1930.88, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 },
      ],
    },
    {
      id: 1002, numero: 2, contratoId: 1, tipo: 'ACRESCIMO',
      dataInicio: '2022-01-15', dataTermino: '2022-06-01',
      inicioContrato: '2020-06-02', terminoContrato: '2022-06-01',
      periodo: 2, observacao: 'Acréscimo de quantidade de veículos para cobertura ampliada.',
      baseMedicao: 18,
      itens: [
        { codigoItem: '1.13', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', qtdVigente: 972000, precoUnitVigente: 0.76, qtdAcrescida: 120000 },
        { codigoItem: '1.14', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', qtdVigente: 108, precoUnitVigente: 1930.88, qtdAcrescida: 24 },
      ],
    },
    {
      id: 1003, numero: 3, contratoId: 1, tipo: 'DESCONTO',
      dataInicio: '2022-03-01', dataTermino: '2022-06-01',
      inicioContrato: '2020-06-02', terminoContrato: '2022-06-01',
      periodo: 2, observacao: 'Desconto aplicado após negociação de preços.',
      baseMedicao: 20,
      itens: [
        { codigoItem: '1.3', descricao: 'Serviços de pré-processamento das imagens', qtdVigente: 12, precoUnitVigente: 111024.42, descUnitPerc: 0.03, descUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Serviços de apoio ao DER/SP na elaboração de relatórios técnicos', qtdVigente: 12, precoUnitVigente: 23387.90, descUnitPerc: 0.05, descUnitValor: 0 },
      ],
    },
  ],

  // Contrato 22.583-6 — 4 TAMs
  2: [
    {
      id: 2001, numero: 1, contratoId: 2, tipo: 'PRORROGACAO',
      dataInicio: '2024-01-10', dataTermino: '2025-01-09',
      inicioContrato: '2022-01-10', terminoContrato: '2025-01-09',
      periodo: 2, observacao: 'Prorrogação por mais 12 meses conforme cláusula contratual.',
      baseMedicao: 24,
      itens: [
        { codigoItem: '1.1', descricao: 'Tapa-buraco com CBUQ em via simples', qtdVigente: 3500, precoUnitVigente: 485.20, variacaoQtd: 500, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.08, reajUnitValor: 0 },
        { codigoItem: '1.2', descricao: 'Tapa-buraco com CBUQ em via expressa', qtdVigente: 2200, precoUnitVigente: 612.35, variacaoQtd: 300, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.08, reajUnitValor: 0 },
        { codigoItem: '1.3', descricao: 'Remendo profundo com CBUQ', qtdVigente: 15000, precoUnitVigente: 125.80, variacaoQtd: 2000, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.08, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Fornecimento e aplicação de CBUQ faixa C', qtdVigente: 6000, precoUnitVigente: 425.60, variacaoQtd: 1000, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.08, reajUnitValor: 0 },
      ],
    },
    {
      id: 2002, numero: 2, contratoId: 2, tipo: 'SUPRESSAO',
      dataInicio: '2023-06-01', dataTermino: '2024-01-09',
      inicioContrato: '2022-01-10', terminoContrato: '2025-01-09',
      periodo: 1, observacao: 'Supressão de itens de sinalização conforme redefinição de escopo.',
      baseMedicao: 17,
      itens: [
        { codigoItem: '1.11', descricao: 'Sinalização horizontal com termoplástico', qtdVigente: 35000, precoUnitVigente: 45.80, qtdSuprimida: 10000 },
        { codigoItem: '1.12', descricao: 'Equipe de sinalização de emergência (diurna)', qtdVigente: 480, precoUnitVigente: 1250.00, qtdSuprimida: 120 },
      ],
    },
    {
      id: 2003, numero: 3, contratoId: 2, tipo: 'REAJUSTE',
      dataInicio: '2023-01-10', dataTermino: '2024-01-09',
      inicioContrato: '2022-01-10', terminoContrato: '2025-01-09',
      periodo: 1, observacao: 'Reajuste anual pelo IPCA acumulado de 6,2%.',
      baseMedicao: 12,
      itens: [
        { codigoItem: '1.1', descricao: 'Tapa-buraco com CBUQ em via simples', qtdVigente: 3500, precoUnitVigente: 485.20, reajUnitPerc: 0.062, reajUnitValor: 0 },
        { codigoItem: '1.2', descricao: 'Tapa-buraco com CBUQ em via expressa', qtdVigente: 2200, precoUnitVigente: 612.35, reajUnitPerc: 0.062, reajUnitValor: 0 },
        { codigoItem: '1.3', descricao: 'Remendo profundo com CBUQ', qtdVigente: 15000, precoUnitVigente: 125.80, reajUnitPerc: 0.062, reajUnitValor: 0 },
        { codigoItem: '1.4', descricao: 'Fresagem de pavimento asfáltico', qtdVigente: 4500, precoUnitVigente: 78.45, reajUnitPerc: 0.062, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Fornecimento e aplicação de CBUQ faixa C', qtdVigente: 6000, precoUnitVigente: 425.60, reajUnitPerc: 0.062, reajUnitValor: 0 },
      ],
    },
    {
      id: 2004, numero: 4, contratoId: 2, tipo: 'ANULACAO',
      dataInicio: '2024-06-01', dataTermino: '2025-01-09',
      inicioContrato: '2022-01-10', terminoContrato: '2025-01-09',
      periodo: 2, observacao: 'Anulação de itens de microrrevestimento por encerramento antecipado.',
      baseMedicao: 28,
      itens: [
        { codigoItem: '1.8', descricao: 'Fornecimento e aplicação de microrrevestimento', qtdVigente: 120000, precoUnitVigente: 18.90, anularItem: 'Sim' },
        { codigoItem: '1.9', descricao: 'Limpeza e desobstrução de sarjetas', qtdVigente: 25000, precoUnitVigente: 8.50, anularItem: 'Não' },
      ],
    },
  ],

  // Contrato 21.100-3 — 2 TAMs
  3: [
    {
      id: 3001, numero: 1, contratoId: 3, tipo: 'PRORROGACAO',
      dataInicio: '2023-03-15', dataTermino: '2024-03-14',
      inicioContrato: '2021-03-15', terminoContrato: '2024-03-14',
      periodo: 2, observacao: 'Prorrogação para continuidade do monitoramento.',
      baseMedicao: 24,
      itens: [
        { codigoItem: '1.6', descricao: 'Manutenção preventiva de equipamentos', qtdVigente: 24, precoUnitVigente: 18500.00, variacaoQtd: 12, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.05, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Manutenção corretiva de equipamentos', qtdVigente: 24, precoUnitVigente: 8200.00, variacaoQtd: 12, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.05, reajUnitValor: 0 },
        { codigoItem: '1.8', descricao: 'Operação de centro de controle 24h', qtdVigente: 24, precoUnitVigente: 42000.00, variacaoQtd: 12, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.05, reajUnitValor: 0 },
        { codigoItem: '1.9', descricao: 'Software de gerenciamento de tráfego (licença)', qtdVigente: 24, precoUnitVigente: 15000.00, variacaoQtd: 12, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.05, reajUnitValor: 0 },
      ],
    },
    {
      id: 3002, numero: 2, contratoId: 3, tipo: 'ACRESCIMO',
      dataInicio: '2023-06-01', dataTermino: '2024-03-14',
      inicioContrato: '2021-03-15', terminoContrato: '2024-03-14',
      periodo: 2, observacao: 'Acréscimo de câmeras e sensores para cobertura ampliada.',
      baseMedicao: 27,
      itens: [
        { codigoItem: '1.1', descricao: 'Instalação de câmera de monitoramento PTZ', qtdVigente: 48, precoUnitVigente: 12500.00, qtdAcrescida: 12 },
        { codigoItem: '1.2', descricao: 'Instalação de câmera fixa HD', qtdVigente: 120, precoUnitVigente: 4800.00, qtdAcrescida: 30 },
        { codigoItem: '1.4', descricao: 'Implantação de sensor de tráfego por laço indutivo', qtdVigente: 200, precoUnitVigente: 3200.00, qtdAcrescida: 50 },
      ],
    },
  ],

  // Contrato 20.937-5 — 1 TAM (Prorrogação por Excepcionalidade)
  4: [
    {
      id: 4001, numero: 1, contratoId: 4, tipo: 'PRORROGACAO_EXCEPCIONALIDADE',
      dataInicio: '2022-09-01', dataTermino: '2023-08-31',
      inicioContrato: '2020-09-01', terminoContrato: '2023-08-31',
      periodo: 2, observacao: 'Prorrogação por excepcionalidade - emergência climática.',
      baseMedicao: 24,
      itens: [
        { codigoItem: '1.1', descricao: 'Roçada mecanizada com trator', qtdVigente: 2400, precoUnitVigente: 285.00, variacaoQtd: 600, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.045, reajUnitValor: 0 },
        { codigoItem: '1.4', descricao: 'Limpeza de bueiros e galerias', qtdVigente: 1200, precoUnitVigente: 180.00, variacaoQtd: 400, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.045, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Remoção de árvore caída com guindaste', qtdVigente: 80, precoUnitVigente: 2800.00, variacaoQtd: 40, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.045, reajUnitValor: 0 },
        { codigoItem: '1.12', descricao: 'Equipe de emergência 24h (plantão)', qtdVigente: 24, precoUnitVigente: 85000.00, variacaoQtd: 12, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.045, reajUnitValor: 0 },
      ],
    },
  ],

  // Contrato 23.001-1 — 5 TAMs (todos os tipos)
  5: [
    {
      id: 5001, numero: 1, contratoId: 5, tipo: 'PRORROGACAO',
      dataInicio: '2025-02-01', dataTermino: '2026-01-31',
      inicioContrato: '2023-02-01', terminoContrato: '2026-01-31',
      periodo: 2, observacao: 'Prorrogação do contrato de sinalização.',
      baseMedicao: 24,
      itens: [
        { codigoItem: '1.1', descricao: 'Pintura de faixa central contínua (termoplástico)', qtdVigente: 250000, precoUnitVigente: 4.80, variacaoQtd: 50000, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.04, reajUnitValor: 0 },
        { codigoItem: '1.2', descricao: 'Pintura de faixa de bordo (termoplástico)', qtdVigente: 500000, precoUnitVigente: 4.20, variacaoQtd: 100000, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.04, reajUnitValor: 0 },
        { codigoItem: '1.7', descricao: 'Fornecimento e implantação de tacha refletiva', qtdVigente: 80000, precoUnitVigente: 8.50, variacaoQtd: 20000, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0.04, reajUnitValor: 0 },
      ],
    },
    {
      id: 5002, numero: 2, contratoId: 5, tipo: 'ACRESCIMO',
      dataInicio: '2024-03-01', dataTermino: '2025-01-31',
      inicioContrato: '2023-02-01', terminoContrato: '2026-01-31',
      periodo: 1, observacao: 'Acréscimo de placas para novas rodovias.',
      baseMedicao: 13,
      itens: [
        { codigoItem: '1.4', descricao: 'Implantação de placa de regulamentação', qtdVigente: 800, precoUnitVigente: 380.00, qtdAcrescida: 200 },
        { codigoItem: '1.5', descricao: 'Implantação de placa de advertência', qtdVigente: 600, precoUnitVigente: 420.00, qtdAcrescida: 150 },
        { codigoItem: '1.6', descricao: 'Implantação de placa de indicação (tipo pórtico)', qtdVigente: 45, precoUnitVigente: 12500.00, qtdAcrescida: 10 },
      ],
    },
    {
      id: 5003, numero: 3, contratoId: 5, tipo: 'SUPRESSAO',
      dataInicio: '2024-08-01', dataTermino: '2025-01-31',
      inicioContrato: '2023-02-01', terminoContrato: '2026-01-31',
      periodo: 1, observacao: 'Supressão de tachas reflexivas por mudança técnica para pintura.',
      baseMedicao: 18,
      itens: [
        { codigoItem: '1.8', descricao: 'Fornecimento e implantação de tachão refletivo', qtdVigente: 20000, precoUnitVigente: 22.00, qtdSuprimida: 5000 },
      ],
    },
    {
      id: 5004, numero: 4, contratoId: 5, tipo: 'REAJUSTE',
      dataInicio: '2024-02-01', dataTermino: '2025-01-31',
      inicioContrato: '2023-02-01', terminoContrato: '2026-01-31',
      periodo: 1, observacao: 'Reajuste anual pelo IGP-M acumulado.',
      baseMedicao: 12,
      itens: [
        { codigoItem: '1.1', descricao: 'Pintura de faixa central contínua (termoplástico)', qtdVigente: 250000, precoUnitVigente: 4.80, reajUnitPerc: 0.047, reajUnitValor: 0 },
        { codigoItem: '1.2', descricao: 'Pintura de faixa de bordo (termoplástico)', qtdVigente: 500000, precoUnitVigente: 4.20, reajUnitPerc: 0.047, reajUnitValor: 0 },
        { codigoItem: '1.3', descricao: 'Pintura de faixa de pedestres (termoplástico)', qtdVigente: 12000, precoUnitVigente: 48.00, reajUnitPerc: 0.047, reajUnitValor: 0 },
        { codigoItem: '1.10', descricao: 'Equipe de sinalização temporária de obra', qtdVigente: 600, precoUnitVigente: 1450.00, reajUnitPerc: 0.047, reajUnitValor: 0 },
      ],
    },
    {
      id: 5005, numero: 5, contratoId: 5, tipo: 'DESCONTO',
      dataInicio: '2024-06-01', dataTermino: '2025-01-31',
      inicioContrato: '2023-02-01', terminoContrato: '2026-01-31',
      periodo: 1, observacao: 'Desconto negociado para manutenção de placas.',
      baseMedicao: 16,
      itens: [
        { codigoItem: '1.9', descricao: 'Manutenção de placa de sinalização', qtdVigente: 400, precoUnitVigente: 180.00, descUnitPerc: 0.10, descUnitValor: 0 },
      ],
    },
  ],

  // Contratos 6-10 com TAMs variadas
  6: [
    {
      id: 6001, numero: 1, contratoId: 6, tipo: 'PRORROGACAO',
      dataInicio: '2023-07-10', dataTermino: '2024-07-09',
      inicioContrato: '2021-07-10', terminoContrato: '2024-07-09',
      periodo: 2, observacao: 'Prorrogação por mais 12 meses.',
      baseMedicao: 24,
      itens: [],
    },
  ],
  7: [],
  8: [
    {
      id: 8001, numero: 1, contratoId: 8, tipo: 'REAJUSTE',
      dataInicio: '2024-05-15', dataTermino: '2025-05-14',
      inicioContrato: '2023-05-15', terminoContrato: '2025-05-14',
      periodo: 1, observacao: 'Reajuste anual pelo INCC.',
      baseMedicao: 12,
      itens: [],
    },
    {
      id: 8002, numero: 2, contratoId: 8, tipo: 'ACRESCIMO',
      dataInicio: '2024-08-01', dataTermino: '2025-05-14',
      inicioContrato: '2023-05-15', terminoContrato: '2025-05-14',
      periodo: 1, observacao: 'Acréscimo de quantitativos de recapeamento.',
      baseMedicao: 15,
      itens: [],
    },
  ],
  9: [
    {
      id: 9001, numero: 1, contratoId: 9, tipo: 'SUPRESSAO',
      dataInicio: '2022-06-01', dataTermino: '2023-10-31',
      inicioContrato: '2021-11-01', terminoContrato: '2023-10-31',
      periodo: 1, observacao: 'Supressão de pontos de fiscalização desativados.',
      baseMedicao: 7,
      itens: [],
    },
  ],
  10: [
    {
      id: 10001, numero: 1, contratoId: 10, tipo: 'PRORROGACAO',
      dataInicio: '2024-08-01', dataTermino: '2025-07-31',
      inicioContrato: '2022-08-01', terminoContrato: '2025-07-31',
      periodo: 2, observacao: 'Prorrogação para conclusão de pontes.',
      baseMedicao: 24,
      itens: [],
    },
    {
      id: 10002, numero: 2, contratoId: 10, tipo: 'REAJUSTE',
      dataInicio: '2023-08-01', dataTermino: '2024-07-31',
      inicioContrato: '2022-08-01', terminoContrato: '2025-07-31',
      periodo: 1, observacao: 'Reajuste pelo INCC.',
      baseMedicao: 12,
      itens: [],
    },
  ],
  // Contratos 11-22 sem TAMs ou com TAMs vazias
  11: [], 12: [], 13: [], 14: [], 15: [],
  16: [], 17: [], 18: [], 19: [], 20: [],
  21: [
    {
      id: 21001, numero: 1, contratoId: 21, tipo: 'PRORROGACAO',
      dataInicio: '2027-03-01', dataTermino: '2028-02-28',
      inicioContrato: '2024-03-01', terminoContrato: '2028-02-28',
      periodo: 2, observacao: 'Prorrogação para fase 2 da duplicação.',
      baseMedicao: 36,
      itens: [],
    },
  ],
  22: [],
};

export default tams;
