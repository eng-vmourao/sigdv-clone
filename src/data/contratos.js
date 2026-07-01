/**
 * 22 contratos mockados com dados realistas de engenharia rodoviária
 * Cada contrato simula um cenário diferente do DER/SP
 */

export const LEI_APLICAVEL_OPTIONS = [
  { value: 'NENHUM', label: 'Nenhum' },
  { value: '8666_1993', label: 'Lei Federal nº 8.666/1993' },
  { value: '14133_2021', label: 'Lei Federal nº 14.133/2021' },
];

const contratos = [
  {
    id: 1, numero: '20.605-2', contratada: 'LBR Engenharia e Tecnologia',
    regional: 'DR-20 - SEDE - São Paulo', objetoResumido: 'Radar Estático',
    leiAplicavel: '8666_1993', dataInicio: '2020-06-03', dataTermino: '2021-05-31',
    valorInicial: 3602287.56, ajusteCentavos: 0.12,
    coordenadoria: 'COT', status: 'Ativo',
  },
  {
    id: 2, numero: '22.583-6', contratada: 'Beta Engenharia e Serviços Ltda',
    regional: 'DR-05 - Campinas', objetoResumido: 'Manutenção Viária Preventiva',
    leiAplicavel: '14133_2021', dataInicio: '2022-01-10', dataTermino: '2024-01-09',
    valorInicial: 8750420.00, ajusteCentavos: -0.04,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 3, numero: '21.100-3', contratada: 'Gama Tecnologia de Tráfego S/A',
    regional: 'DR-12 - Ribeirão Preto', objetoResumido: 'Sistema de Monitoramento de Tráfego',
    leiAplicavel: '8666_1993', dataInicio: '2021-03-15', dataTermino: '2023-03-14',
    valorInicial: 4200000.00, ajusteCentavos: 0,
    coordenadoria: 'CET', status: 'Encerrado',
  },
  {
    id: 4, numero: '20.937-5', contratada: 'Delta Serviços de Conservação Rodoviária',
    regional: 'DR-01 - Capital', objetoResumido: 'Conservação Rodoviária Emergencial',
    leiAplicavel: 'NENHUM', dataInicio: '2020-09-01', dataTermino: '2022-08-31',
    valorInicial: 15320000.00, ajusteCentavos: 0.56,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 5, numero: '23.001-1', contratada: 'Epsilon Infraestrutura Urbana',
    regional: 'DR-08 - Sorocaba', objetoResumido: 'Sinalização Horizontal e Vertical',
    leiAplicavel: '14133_2021', dataInicio: '2023-02-01', dataTermino: '2025-01-31',
    valorInicial: 6450000.00, ajusteCentavos: 0,
    coordenadoria: 'COT', status: 'Ativo',
  },
  {
    id: 6, numero: '21.450-8', contratada: 'Zeta Sinalização e Obras Ltda',
    regional: 'DR-03 - Santos', objetoResumido: 'Implantação de Dispositivos de Segurança',
    leiAplicavel: '8666_1993', dataInicio: '2021-07-10', dataTermino: '2023-07-09',
    valorInicial: 2890000.00, ajusteCentavos: 0.22,
    coordenadoria: 'CRO', status: 'Encerrado',
  },
  {
    id: 7, numero: '22.010-4', contratada: 'Eta Consultoria Viária S/A',
    regional: 'DR-06 - Bauru', objetoResumido: 'Consultoria em Engenharia de Tráfego',
    leiAplicavel: '8666_1993', dataInicio: '2022-03-01', dataTermino: '2024-02-29',
    valorInicial: 1250000.00, ajusteCentavos: 0,
    coordenadoria: 'CET', status: 'Ativo',
  },
  {
    id: 8, numero: '23.220-9', contratada: 'Theta Pavimentação e Terraplenagem',
    regional: 'DR-10 - Presidente Prudente', objetoResumido: 'Recapeamento Asfáltico SP-270',
    leiAplicavel: '14133_2021', dataInicio: '2023-05-15', dataTermino: '2025-05-14',
    valorInicial: 22500000.00, ajusteCentavos: -0.30,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 9, numero: '21.780-2', contratada: 'Iota Sistemas Eletrônicos',
    regional: 'DR-02 - Guarulhos', objetoResumido: 'Fiscalização Eletrônica de Velocidade',
    leiAplicavel: '8666_1993', dataInicio: '2021-11-01', dataTermino: '2023-10-31',
    valorInicial: 5680000.00, ajusteCentavos: 0,
    coordenadoria: 'COT', status: 'Encerrado',
  },
  {
    id: 10, numero: '22.890-1', contratada: 'Kappa Geotecnia e Fundações',
    regional: 'DR-04 - Taubaté', objetoResumido: 'Recuperação de Pontes e Viadutos',
    leiAplicavel: '14133_2021', dataInicio: '2022-08-01', dataTermino: '2024-07-31',
    valorInicial: 18900000.00, ajusteCentavos: 0.78,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 11, numero: '20.330-7', contratada: 'Lambda Engenharia Ambiental',
    regional: 'DR-09 - Araçatuba', objetoResumido: 'Serviços de Drenagem e OAC',
    leiAplicavel: '8666_1993', dataInicio: '2020-04-01', dataTermino: '2022-03-31',
    valorInicial: 7250000.00, ajusteCentavos: 0,
    coordenadoria: 'CRO', status: 'Encerrado',
  },
  {
    id: 12, numero: '23.445-3', contratada: 'Mu Topografia e Geodésia',
    regional: 'DR-07 - Araraquara', objetoResumido: 'Levantamento Topográfico e Cadastral',
    leiAplicavel: '14133_2021', dataInicio: '2023-09-01', dataTermino: '2025-08-31',
    valorInicial: 980000.00, ajusteCentavos: 0,
    coordenadoria: 'CET', status: 'Ativo',
  },
  {
    id: 13, numero: '22.150-6', contratada: 'Nu Projetos Rodoviários Ltda',
    regional: 'DR-11 - Marília', objetoResumido: 'Elaboração de Projetos Executivos',
    leiAplicavel: '8666_1993', dataInicio: '2022-04-15', dataTermino: '2024-04-14',
    valorInicial: 3450000.00, ajusteCentavos: 0.45,
    coordenadoria: 'CET', status: 'Ativo',
  },
  {
    id: 14, numero: '21.600-5', contratada: 'Xi Terraplenagem e Obras',
    regional: 'DR-14 - São Carlos', objetoResumido: 'Terraplenagem e Pavimentação SP-215',
    leiAplicavel: '8666_1993', dataInicio: '2021-08-01', dataTermino: '2023-07-31',
    valorInicial: 28900000.00, ajusteCentavos: -0.15,
    coordenadoria: 'CRO', status: 'Encerrado',
  },
  {
    id: 15, numero: '23.560-7', contratada: 'Omicron Iluminação Rodoviária',
    regional: 'DR-13 - Franca', objetoResumido: 'Iluminação de Trechos Rodoviários',
    leiAplicavel: '14133_2021', dataInicio: '2023-11-01', dataTermino: '2025-10-31',
    valorInicial: 4100000.00, ajusteCentavos: 0,
    coordenadoria: 'COT', status: 'Ativo',
  },
  {
    id: 16, numero: '20.100-9', contratada: 'Pi Manutenção Predial e Rodoviária',
    regional: 'DR-16 - Itapetininga', objetoResumido: 'Conservação de Faixa de Domínio',
    leiAplicavel: 'NENHUM', dataInicio: '2020-01-15', dataTermino: '2022-01-14',
    valorInicial: 1850000.00, ajusteCentavos: 0,
    coordenadoria: 'CRO', status: 'Encerrado',
  },
  {
    id: 17, numero: '22.670-3', contratada: 'Rho Engenharia de Pontes',
    regional: 'DR-15 - São José do Rio Preto', objetoResumido: 'Reforço Estrutural de OAE',
    leiAplicavel: '14133_2021', dataInicio: '2022-10-01', dataTermino: '2024-09-30',
    valorInicial: 12300000.00, ajusteCentavos: 0.33,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 18, numero: '23.780-1', contratada: 'Sigma Controle de Qualidade',
    regional: 'DR-20 - SEDE - São Paulo', objetoResumido: 'Controle Tecnológico de Obras',
    leiAplicavel: '14133_2021', dataInicio: '2024-01-01', dataTermino: '2026-12-31',
    valorInicial: 2780000.00, ajusteCentavos: 0,
    coordenadoria: 'CET', status: 'Ativo',
  },
  {
    id: 19, numero: '21.920-4', contratada: 'Tau Paisagismo Rodoviário',
    regional: 'DR-04 - Taubaté', objetoResumido: 'Serviços de Paisagismo e Roçada',
    leiAplicavel: '8666_1993', dataInicio: '2021-12-01', dataTermino: '2023-11-30',
    valorInicial: 3200000.00, ajusteCentavos: 0,
    coordenadoria: 'CRO', status: 'Encerrado',
  },
  {
    id: 20, numero: '22.340-2', contratada: 'Upsilon Tecnologia Viária',
    regional: 'DR-02 - Guarulhos', objetoResumido: 'PMI - Pesquisa e Monitoramento',
    leiAplicavel: '8666_1993', dataInicio: '2022-06-01', dataTermino: '2024-05-31',
    valorInicial: 1980000.00, ajusteCentavos: 0.09,
    coordenadoria: 'CET', status: 'Ativo',
  },
  {
    id: 21, numero: '23.900-5', contratada: 'Phi Construções Rodoviárias',
    regional: 'DR-01 - Capital', objetoResumido: 'Duplicação SP-150 Trecho Sul',
    leiAplicavel: '14133_2021', dataInicio: '2024-03-01', dataTermino: '2027-02-28',
    valorInicial: 85000000.00, ajusteCentavos: -0.42,
    coordenadoria: 'CRO', status: 'Ativo',
  },
  {
    id: 22, numero: '21.050-8', contratada: 'Chi Segurança Viária Ltda',
    regional: 'DR-06 - Bauru', objetoResumido: 'Operação de Pedágio Temporário',
    leiAplicavel: 'NENHUM', dataInicio: '2021-02-01', dataTermino: '2023-01-31',
    valorInicial: 4560000.00, ajusteCentavos: 0,
    coordenadoria: 'COT', status: 'Encerrado',
  },
];

export default contratos;
