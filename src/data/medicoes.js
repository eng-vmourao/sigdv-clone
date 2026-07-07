import contratos from './contratos';

function generateMedicoesForContrato(contrato) {
  const medicoes = [];
  // Ensure we interpret dates strictly without timezone shift
  let currentStart = new Date(contrato.dataInicio + 'T00:00:00');
  const end = new Date(contrato.dataTermino + 'T00:00:00');
  let medNumber = 1;
  let globalId = contrato.id * 100 + 1;

  while (currentStart <= end) {
    let next15 = new Date(currentStart);
    if (next15.getDate() > 15) {
      next15.setMonth(next15.getMonth() + 1);
    }
    next15.setDate(15);

    if (next15 > end) {
      next15 = new Date(end);
    }

    let isLast = false;
    if (next15.getTime() === end.getTime()) {
      isLast = true;
    }

    // 1 ano = 12 meses. Cada PRORROGAÇÃO deveria mudar o periodo. Mas por simplificação na mock de medições, a cada 12 medições consideramos 1 período (anos civis da obra).
    // O backend real controlaria isso via TAMs
    const periodo = Math.floor((medNumber - 1) / 12) + 1;
    
    const formatDate = (d) => {
      const yy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };

    medicoes.push({
      id: globalId++,
      numero: medNumber,
      contratoId: contrato.id,
      periodoInicio: formatDate(currentStart),
      periodoTermino: formatDate(next15),
      periodo: periodo,
      prazoVigenteContrato: medNumber,
      nrProtocolo: `P-${currentStart.getFullYear()}-${String(medNumber).padStart(3, '0')}`,
      medicaoR$: 200000 + Math.round(Math.random() * 800000),
      reajusteR$: 0,
      descontoR$: 0,
    });

    if (isLast) break;

    currentStart = new Date(next15);
    currentStart.setDate(currentStart.getDate() + 1); // 16th
    medNumber++;
  }
  return medicoes;
}

const medicoes = {};
contratos.forEach(c => {
  medicoes[c.id] = generateMedicoesForContrato(c);
});

export default medicoes;
