import contratos from './contratos';

function parseDate(str) {
  const parts = str.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function generateMedicoesForContrato(contrato) {
  const medicoes = [];
  // Usa construtor manual para evitar qualquer problema de timezone
  let currentStart = parseDate(contrato.dataInicio);
  const end = parseDate(contrato.dataTermino);
  let medNumber = 1;
  let globalId = contrato.id * 100 + 1;

  while (currentStart <= end) {
    let next15 = new Date(currentStart.getFullYear(), currentStart.getMonth(), currentStart.getDate());
    
    if (next15.getDate() > 15) {
      next15.setMonth(next15.getMonth() + 1);
    }
    next15.setDate(15);

    if (next15 > end) {
      next15 = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    }

    let isLast = false;
    if (next15.getTime() === end.getTime()) {
      isLast = true;
    }

    const periodo = Math.floor((medNumber - 1) / 12) + 1;
    
    const formatDate = (d) => {
      const yy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };

    // Geração determinística de valores para evitar mudança ao atualizar a página
    const pseudoRandom = ((contrato.id * 7919) + (medNumber * 104729)) % 800000;

    medicoes.push({
      id: globalId++,
      numero: medNumber,
      contratoId: contrato.id,
      periodoInicio: formatDate(currentStart),
      periodoTermino: formatDate(next15),
      periodo: periodo,
      prazoVigenteContrato: medNumber,
      nrProtocolo: `P-${currentStart.getFullYear()}-${String(medNumber).padStart(3, '0')}`,
      medicaoR$: 200000 + pseudoRandom,
      reajusteR$: 0,
      descontoR$: 0,
    });

    if (isLast) break;

    // Próximo início será exatamente 1 dia após next15
    currentStart = new Date(next15.getFullYear(), next15.getMonth(), next15.getDate() + 1);
    medNumber++;
  }
  return medicoes;
}

const medicoes = {};
contratos.forEach(c => {
  medicoes[c.id] = generateMedicoesForContrato(c);
});

export default medicoes;
