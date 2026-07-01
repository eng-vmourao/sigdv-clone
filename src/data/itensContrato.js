/**
 * Itens de orçamento por contrato (8-14 itens cada)
 * Dados realistas de serviços de engenharia rodoviária
 * Quantidades com até 4 casas decimais (SIGDV-03)
 */

const itensContrato = {
  // Contrato 20.605-2 — Radar Estático (14 itens)
  1: [
    { id: 101, codigoItem: '1.1', descricao: 'Implantação de Central de Pré-Processamento de Imagens', unidade: 'UN', qtdVigente: 0, precoUnitVigente: 237712.44 },
    { id: 102, codigoItem: '1.2', descricao: 'Manut. de Central de pré-processamento de Imagens', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 2106.21 },
    { id: 103, codigoItem: '1.3', descricao: 'Serviços de pré-processamento das imagens geradas pelo equipamentos de fiscalização de excesso de velocidade e pelos não metrológicos, tipos estáticos e fixos', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 111024.42 },
    { id: 104, codigoItem: '1.4', descricao: 'Serviços de apoio no controle de eficiência de operação dos equipamentos estáticos', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 8430.59 },
    { id: 105, codigoItem: '1.5', descricao: 'Serviços de apoio no controle das condições dos equipamentos estáticos e fixos bem como das manutenções preventivas ecorretivas', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 11148.70 },
    { id: 106, codigoItem: '1.6', descricao: 'Serviços de apoio na interação com outras áreas internas e externas do DER/SP, em assuntos relacionados à fiscalização eletrônica de excesso de velocidade', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 13903.70 },
    { id: 107, codigoItem: '1.7', descricao: 'Serviços de apoio ao DER/SP na elaboração de relatórios técnicos relacionados à fiscalização eletrônica de excesso de velocidade', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 23387.90 },
    { id: 108, codigoItem: '1.8', descricao: 'Serviços de apoio ao DER/SP na fiscalização da realização da operação dos equipamentos estáticos e coleta dos equipamentos fixos', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 12848.95 },
    { id: 109, codigoItem: '1.9', descricao: 'Serviços de apoio ao DER/SP na elaboração de planos de trabalhos mensais relacionados à escala de serviços e locais a serem operados', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 5473.63 },
    { id: 110, codigoItem: '1.10', descricao: 'Serviços de apoio ao DER/SP nas vistorias técnicas aos locais de operação dos equipamentos, relacionados à sinalização de trânsito, geometria e condições de segurança de trânsito e dos próprios operadores de equipamentos', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 6383.54 },
    { id: 111, codigoItem: '1.11', descricao: 'Serviços de apoio ao DER/SP na análise de novas tecnologias aplicáveis à fiscalização eletrônica de excesso de velocidade', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 4733.58 },
    { id: 112, codigoItem: '1.12', descricao: 'Serviços de apoio ao DER/SP no desenvolvimento de banco de dados e aplicativos específicos para controle de todos os dados gerados ao longo do contrato', unidade: 'MÊS', qtdVigente: 12, precoUnitVigente: 21813.49 },
    { id: 113, codigoItem: '1.13', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', unidade: 'KM', qtdVigente: 972000, precoUnitVigente: 0.76 },
    { id: 114, codigoItem: '1.14', descricao: 'Veículo c/ capacidade p/ 4 pessoas 1.000 CC Cond.', unidade: 'KM', qtdVigente: 108, precoUnitVigente: 1930.88 },
  ],

  // Contrato 22.583-6 — Manutenção Viária (12 itens)
  2: [
    { id: 201, codigoItem: '1.1', descricao: 'Tapa-buraco com CBUQ em via simples', unidade: 'T', qtdVigente: 3500.0000, precoUnitVigente: 485.20 },
    { id: 202, codigoItem: '1.2', descricao: 'Tapa-buraco com CBUQ em via expressa', unidade: 'T', qtdVigente: 2200.0000, precoUnitVigente: 612.35 },
    { id: 203, codigoItem: '1.3', descricao: 'Remendo profundo com CBUQ', unidade: 'M2', qtdVigente: 15000.0000, precoUnitVigente: 125.80 },
    { id: 204, codigoItem: '1.4', descricao: 'Fresagem de pavimento asfáltico', unidade: 'M3', qtdVigente: 4500.0000, precoUnitVigente: 78.45 },
    { id: 205, codigoItem: '1.5', descricao: 'Imprimação ligante (CM-30)', unidade: 'M2', qtdVigente: 80000.0000, precoUnitVigente: 4.22 },
    { id: 206, codigoItem: '1.6', descricao: 'Pintura de ligação com RR-2C', unidade: 'M2', qtdVigente: 80000.0000, precoUnitVigente: 2.85 },
    { id: 207, codigoItem: '1.7', descricao: 'Fornecimento e aplicação de CBUQ faixa C', unidade: 'T', qtdVigente: 6000.0000, precoUnitVigente: 425.60 },
    { id: 208, codigoItem: '1.8', descricao: 'Fornecimento e aplicação de microrrevestimento', unidade: 'M2', qtdVigente: 120000.0000, precoUnitVigente: 18.90 },
    { id: 209, codigoItem: '1.9', descricao: 'Limpeza e desobstrução de sarjetas', unidade: 'M', qtdVigente: 25000.0000, precoUnitVigente: 8.50 },
    { id: 210, codigoItem: '1.10', descricao: 'Roçada mecanizada de faixa de domínio', unidade: 'HA', qtdVigente: 450.0000, precoUnitVigente: 320.00 },
    { id: 211, codigoItem: '1.11', descricao: 'Sinalização horizontal com termoplástico', unidade: 'M2', qtdVigente: 35000.0000, precoUnitVigente: 45.80 },
    { id: 212, codigoItem: '1.12', descricao: 'Equipe de sinalização de emergência (diurna)', unidade: 'DIA', qtdVigente: 480.0000, precoUnitVigente: 1250.00 },
  ],

  // Contrato 21.100-3 — Sistema de Monitoramento (10 itens)
  3: [
    { id: 301, codigoItem: '1.1', descricao: 'Instalação de câmera de monitoramento PTZ', unidade: 'UN', qtdVigente: 48.0000, precoUnitVigente: 12500.00 },
    { id: 302, codigoItem: '1.2', descricao: 'Instalação de câmera fixa HD', unidade: 'UN', qtdVigente: 120.0000, precoUnitVigente: 4800.00 },
    { id: 303, codigoItem: '1.3', descricao: 'Implantação de PMV (Painel de Mensagem Variável)', unidade: 'UN', qtdVigente: 15.0000, precoUnitVigente: 85000.00 },
    { id: 304, codigoItem: '1.4', descricao: 'Implantação de sensor de tráfego por laço indutivo', unidade: 'UN', qtdVigente: 200.0000, precoUnitVigente: 3200.00 },
    { id: 305, codigoItem: '1.5', descricao: 'Infraestrutura de fibra óptica (fornecimento e lançamento)', unidade: 'KM', qtdVigente: 85.5000, precoUnitVigente: 12000.00 },
    { id: 306, codigoItem: '1.6', descricao: 'Manutenção preventiva de equipamentos', unidade: 'MÊS', qtdVigente: 24.0000, precoUnitVigente: 18500.00 },
    { id: 307, codigoItem: '1.7', descricao: 'Manutenção corretiva de equipamentos', unidade: 'MÊS', qtdVigente: 24.0000, precoUnitVigente: 8200.00 },
    { id: 308, codigoItem: '1.8', descricao: 'Operação de centro de controle 24h', unidade: 'MÊS', qtdVigente: 24.0000, precoUnitVigente: 42000.00 },
    { id: 309, codigoItem: '1.9', descricao: 'Software de gerenciamento de tráfego (licença)', unidade: 'MÊS', qtdVigente: 24.0000, precoUnitVigente: 15000.00 },
    { id: 310, codigoItem: '1.10', descricao: 'Treinamento operacional de equipe', unidade: 'UN', qtdVigente: 4.0000, precoUnitVigente: 25000.00 },
  ],

  // Contrato 20.937-5 — Conservação Rodoviária (12 itens)
  4: [
    { id: 401, codigoItem: '1.1', descricao: 'Roçada mecanizada com trator', unidade: 'HA', qtdVigente: 2400.0000, precoUnitVigente: 285.00 },
    { id: 402, codigoItem: '1.2', descricao: 'Roçada manual em área de difícil acesso', unidade: 'HA', qtdVigente: 600.0000, precoUnitVigente: 420.00 },
    { id: 403, codigoItem: '1.3', descricao: 'Capina química de faixa de domínio', unidade: 'HA', qtdVigente: 800.0000, precoUnitVigente: 195.00 },
    { id: 404, codigoItem: '1.4', descricao: 'Limpeza de bueiros e galerias', unidade: 'UN', qtdVigente: 1200.0000, precoUnitVigente: 180.00 },
    { id: 405, codigoItem: '1.5', descricao: 'Recomposição de cerca tipo Belgo', unidade: 'M', qtdVigente: 15000.0000, precoUnitVigente: 42.50 },
    { id: 406, codigoItem: '1.6', descricao: 'Poda de árvores com plataforma', unidade: 'UN', qtdVigente: 350.0000, precoUnitVigente: 450.00 },
    { id: 407, codigoItem: '1.7', descricao: 'Remoção de árvore caída com guindaste', unidade: 'UN', qtdVigente: 80.0000, precoUnitVigente: 2800.00 },
    { id: 408, codigoItem: '1.8', descricao: 'Reconstituição de aterro com solo local', unidade: 'M3', qtdVigente: 5000.0000, precoUnitVigente: 32.00 },
    { id: 409, codigoItem: '1.9', descricao: 'Limpeza e pintura de defensas metálicas', unidade: 'M', qtdVigente: 8000.0000, precoUnitVigente: 28.50 },
    { id: 410, codigoItem: '1.10', descricao: 'Substituição de defensa metálica simples', unidade: 'M', qtdVigente: 2000.0000, precoUnitVigente: 185.00 },
    { id: 411, codigoItem: '1.11', descricao: 'Enrocamento de proteção de taludes', unidade: 'M3', qtdVigente: 1500.0000, precoUnitVigente: 120.00 },
    { id: 412, codigoItem: '1.12', descricao: 'Equipe de emergência 24h (plantão)', unidade: 'MÊS', qtdVigente: 24.0000, precoUnitVigente: 85000.00 },
  ],

  // Contrato 23.001-1 — Sinalização (10 itens)
  5: [
    { id: 501, codigoItem: '1.1', descricao: 'Pintura de faixa central contínua (termoplástico)', unidade: 'M', qtdVigente: 250000.0000, precoUnitVigente: 4.80 },
    { id: 502, codigoItem: '1.2', descricao: 'Pintura de faixa de bordo (termoplástico)', unidade: 'M', qtdVigente: 500000.0000, precoUnitVigente: 4.20 },
    { id: 503, codigoItem: '1.3', descricao: 'Pintura de faixa de pedestres (termoplástico)', unidade: 'M2', qtdVigente: 12000.0000, precoUnitVigente: 48.00 },
    { id: 504, codigoItem: '1.4', descricao: 'Implantação de placa de regulamentação', unidade: 'UN', qtdVigente: 800.0000, precoUnitVigente: 380.00 },
    { id: 505, codigoItem: '1.5', descricao: 'Implantação de placa de advertência', unidade: 'UN', qtdVigente: 600.0000, precoUnitVigente: 420.00 },
    { id: 506, codigoItem: '1.6', descricao: 'Implantação de placa de indicação (tipo pórtico)', unidade: 'UN', qtdVigente: 45.0000, precoUnitVigente: 12500.00 },
    { id: 507, codigoItem: '1.7', descricao: 'Fornecimento e implantação de tacha refletiva', unidade: 'UN', qtdVigente: 80000.0000, precoUnitVigente: 8.50 },
    { id: 508, codigoItem: '1.8', descricao: 'Fornecimento e implantação de tachão refletivo', unidade: 'UN', qtdVigente: 20000.0000, precoUnitVigente: 22.00 },
    { id: 509, codigoItem: '1.9', descricao: 'Manutenção de placa de sinalização', unidade: 'UN', qtdVigente: 400.0000, precoUnitVigente: 180.00 },
    { id: 510, codigoItem: '1.10', descricao: 'Equipe de sinalização temporária de obra', unidade: 'DIA', qtdVigente: 600.0000, precoUnitVigente: 1450.00 },
  ],
};

// Gera itens genéricos para contratos 6-22
function generateItems(contratoId, count, baseId) {
  const servicosBase = [
    { desc: 'Mobilização e desmobilização de equipamentos', unidade: 'VB', precoBase: 45000 },
    { desc: 'Escavação e carga de material de 1ª categoria', unidade: 'M3', precoBase: 18.50 },
    { desc: 'Compactação de aterro a 95% do Proctor Normal', unidade: 'M3', precoBase: 8.20 },
    { desc: 'Fornecimento e transporte de brita graduada', unidade: 'T', precoBase: 95.00 },
    { desc: 'Concreto estrutural fck=30MPa', unidade: 'M3', precoBase: 680.00 },
    { desc: 'Armadura de aço CA-50', unidade: 'KG', precoBase: 12.50 },
    { desc: 'Forma de madeira compensada', unidade: 'M2', precoBase: 85.00 },
    { desc: 'Execução de dreno longitudinal profundo', unidade: 'M', precoBase: 145.00 },
    { desc: 'Meio-fio de concreto pré-moldado', unidade: 'M', precoBase: 52.00 },
    { desc: 'Transporte comercial de materiais', unidade: 'T.KM', precoBase: 0.85 },
    { desc: 'Ensaios de controle tecnológico', unidade: 'UN', precoBase: 320.00 },
    { desc: 'Relatório técnico mensal', unidade: 'UN', precoBase: 8500.00 },
    { desc: 'Supervisão de obras (engenheiro sênior)', unidade: 'MÊS', precoBase: 22000.00 },
    { desc: 'Topografia e controle geométrico', unidade: 'MÊS', precoBase: 12000.00 },
  ];

  const items = [];
  for (let i = 0; i < count; i++) {
    const svc = servicosBase[i % servicosBase.length];
    const fator = 0.8 + Math.random() * 0.4; // variação de 80% a 120%
    const qtd = Math.round((50 + Math.random() * 5000) * 10000) / 10000;
    items.push({
      id: baseId + i,
      codigoItem: `1.${i + 1}`,
      descricao: svc.desc,
      unidade: svc.unidade,
      qtdVigente: qtd,
      precoUnitVigente: Math.round(svc.precoBase * fator * 100) / 100,
    });
  }
  return items;
}

// Gera itens para contratos 6-22
for (let c = 6; c <= 22; c++) {
  const count = 8 + Math.floor((c * 7 + 3) % 7); // 8-14 itens
  itensContrato[c] = generateItems(c, count, c * 100 + 1);
}

export default itensContrato;
