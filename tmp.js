/**
 * Medições mockadas por contrato
 * Cada medição contém resumo e itens detalhados
 * Recálculo encadeado implementado no service (SIGDV-07)
 */

let medicoes = {
  // Contrato 20.605-2 — 5 medições
  1: [
    { id: 11, numero: 1, contratoId: 1, periodoInicio: '2020-06-16', periodoTermino: '2020-07-15', periodo: 1, prazoVigenteContrato: 1, nrProtocolo: '', medicaoR$: 460896.79, reajusteR$: 0, descontoR$: 0 },
    { id: 12, numero: 2, contratoId: 1, periodoInicio: '2020-07-16', periodoTermino: '2020-08-15', periodo: 1, prazoVigenteContrato: 2, nrProtocolo: '', medicaoR$: 460896.79, reajusteR$: 0, descontoR$: 0 },
    { id: 13, numero: 3, contratoId: 1, periodoInicio: '2020-08-16', periodoTermino: '2020-09-15', periodo: 1, prazoVigenteContrato: 3, nrProtocolo: '', medicaoR$: 460896.79, reajusteR$: 0, descontoR$: 0 },
    { id: 14, numero: 4, contratoId: 1, periodoInicio: '2020-09-16', periodoTermino: '2020-10-15', periodo: 1, prazoVigenteContrato: 4, nrProtocolo: '', medicaoR$: 460896.79, reajusteR$: 0, descontoR$: 0 },
    { id: 15, numero: 5, contratoId: 1, periodoInicio: '2020-10-16', periodoTermino: '2020-11-15', periodo: 1, prazoVigenteContrato: 5, nrProtocolo: '', medicaoR$: 460896.79, reajusteR$: 0, descontoR$: 0 },
  ],

  // Contrato 22.583-6 — 8 medições
  2: [
    { id: 21, numero: 1, contratoId: 2, periodoInicio: '2022-01-10', periodoTermino: '2022-02-09', periodo: 1, prazoVigenteContrato: 1, nrProtocolo: 'P-2022-001', medicaoR$: 685420.00, reajusteR$: 0, descontoR$: 0 },
    { id: 22, numero: 2, contratoId: 2, periodoInicio: '2022-02-10', periodoTermino: '2022-03-09', periodo: 1, prazoVigenteContrato: 2, nrProtocolo: 'P-2022-002', medicaoR$: 720150.00, reajusteR$: 0, descontoR$: 0 },
    { id: 23, numero: 3, contratoId: 2, periodoInicio: '2022-03-10', periodoTermino: '2022-04-09', periodo: 1, prazoVigenteContrato: 3, nrProtocolo: 'P-2022-003', medicaoR$: 698300.00, reajusteR$: 0, descontoR$: 0 },
    { id: 24, numero: 4, contratoId: 2, periodoInicio: '2022-04-10', periodoTermino: '2022-05-09', periodo: 1, prazoVigenteContrato: 4, nrProtocolo: 'P-2022-004', medicaoR$: 710800.00, reajusteR$: 0, descontoR$: 0 },
    { id: 25, numero: 5, contratoId: 2, periodoInicio: '2022-05-10', periodoTermino: '2022-06-09', periodo: 1, prazoVigenteContrato: 5, nrProtocolo: 'P-2022-005', medicaoR$: 745200.00, reajusteR$: 0, descontoR$: 0 },
    { id: 26, numero: 6, contratoId: 2, periodoInicio: '2022-06-10', periodoTermino: '2022-07-09', periodo: 1, prazoVigenteContrato: 6, nrProtocolo: 'P-2022-006', medicaoR$: 690050.00, reajusteR$: 0, descontoR$: 0 },
    { id: 27, numero: 7, contratoId: 2, periodoInicio: '2022-07-10', periodoTermino: '2022-08-09', periodo: 1, prazoVigenteContrato: 7, nrProtocolo: 'P-2022-007', medicaoR$: 712400.00, reajusteR$: 0, descontoR$: 0 },
    { id: 28, numero: 8, contratoId: 2, periodoInicio: '2022-08-10', periodoTermino: '2022-09-09', periodo: 1, prazoVigenteContrato: 8, nrProtocolo: 'P-2022-008', medicaoR$: 735100.00, reajusteR$: 0, descontoR$: 0 },
  ],

  // Contrato 21.100-3 — 3 medições
  3: [
    { id: 31, numero: 1, contratoId: 3, periodoInicio: '2021-03-15', periodoTermino: '2021-04-14', periodo: 1, prazoVigenteContrato: 1, nrProtocolo: '', medicaoR$: 325000.00, reajusteR$: 0, descontoR$: 0 },
    { id: 32, numero: 2, contratoId: 3, periodoInicio: '2021-04-15', periodoTermino: '2021-05-14', periodo: 1, prazoVigenteContrato: 2, nrProtocolo: '', medicaoR$: 290000.00, reajusteR$: 0, descontoR$: 0 },
    { id: 33, numero: 3, contratoId: 3, periodoInicio: '2021-05-15', periodoTermino: '2021-06-14', periodo: 1, prazoVigenteContrato: 3, nrProtocolo: '', medicaoR$: 310000.00, reajusteR$: 0, descontoR$: 0 },
  ],

  // Contrato 20.937-5 — 12 medições
  4: Array.from({ length: 12 }, (_, i) => ({
    id: 40 + i + 1, numero: i + 1, contratoId: 4,
    periodoInicio: new Date(2020, 8 + i, 1).toISOString().split('T')[0],
    periodoTermino: new Date(2020, 9 + i, 0).toISOString().split('T')[0],
    periodo: 1, prazoVigenteContrato: i + 1, nrProtocolo: `P-${2020 + Math.floor((8+i)/12)}-${String(((8+i)%12)+1).padStart(3,'0')}`,
    medicaoR$: 1100000 + Math.round(Math.random() * 200000),
    reajusteR$: 0, descontoR$: 0,
  })),

  // Contrato 23.001-1 — 6 medições
  5: Array.from({ length: 6 }, (_, i) => ({
    id: 50 + i + 1, numero: i + 1, contratoId: 5,
    periodoInicio: new Date(2023, 1 + i, 1).toISOString().split('T')[0],
    periodoTermino: new Date(2023, 2 + i, 0).toISOString().split('T')[0],
    periodo: 1, prazoVigenteContrato: i + 1, nrProtocolo: `P-2023-${String(i+1).padStart(3,'0')}`,
    medicaoR$: 480000 + Math.round(Math.random() * 120000),
    reajusteR$: 0, descontoR$: 0,
  })),

  // Contratos 6-22 com medições geradas
  ...Object.fromEntries(
    Array.from({ length: 17 }, (_, idx) => {
      const cId = idx + 6;
      const count = Math.max(0, Math.floor((cId * 3 + 5) % 11)); // 0-10 medições
      return [cId, Array.from({ length: count }, (_, i) => ({
        id: cId * 100 + i + 1, numero: i + 1, contratoId: cId,
        periodoInicio: new Date(2021 + Math.floor(i/12), i % 12, 1).toISOString().split('T')[0],
        periodoTermino: new Date(2021 + Math.floor(i/12), (i % 12) + 1, 0).toISOString().split('T')[0],
        periodo: 1, prazoVigenteContrato: i + 1, nrProtocolo: `P-${2021+Math.floor(i/12)}-${String((i%12)+1).padStart(3,'0')}`,
        medicaoR$: 200000 + Math.round(Math.random() * 800000),
        reajusteR$: 0, descontoR$: 0,
      }))];
    })
  ),
};


; Object.keys(medicoes).forEach(cId => { const contrato = contratos.find(c => c.id == cId); if(!contrato) return; medicoes[cId].forEach(m => { const [aC, mC, dC] = contrato.dataInicio.split('-').map(Number); const [aM, mM, dM] = m.periodoInicio.split('-').map(Number); let diff = aM - aC; const isBefore = mM < mC || (mM === mC && dM < dC); if (isBefore) diff--; m.periodo = Math.max(1, diff + 1); }); }); console.log(JSON.stringify(medicoes, null, 2));