import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato } from '../services/contratoService'
import { getMedicao, getItensMedicaoComCalculos, criarMedicao, atualizarItensMedicao } from '../services/medicaoService'
import { calcularResumoMedicao } from '../services/calculoService'
import CollapsibleSection from '../components/UI/CollapsibleSection'
import ContratoInfoBar from '../components/Contrato/ContratoInfoBar'
import BackButton from '../components/UI/BackButton'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import { formatCurrency, formatDate, formatQuantity } from '../utils/formatters'
import { CellInput } from '../components/Table/ConfigurableTable'
import itensContrato from '../data/itensContrato'

/**
 * Editor de Medição
 * Implements: SIGDV-03 (4 casas decimais), SIGDV-02 (resumo centralizado)
 */
export default function MedicaoEditor() {
  const { contratoId, medicaoId } = useParams()
  const navigate = useNavigate()
  const isNew = medicaoId === 'novo'

  const contrato = useMemo(() => getContrato(contratoId), [contratoId])
  
  // Estado do formulário para nova medição
  const [dataInicio, setDataInicio] = useState('')
  const [dataTermino, setDataTermino] = useState('')
  const [nrProtocolo, setNrProtocolo] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Carrega Medição existente
  const medicaoExistente = useMemo(() => {
    if (isNew) return null
    const med = getMedicao(Number(medicaoId))
    if (med) {
      setDataInicio(med.periodoInicio)
      setDataTermino(med.periodoTermino)
      setNrProtocolo(med.nrProtocolo || '')
      setPeriodo(med.periodo || '')
    }
    return med
  }, [medicaoId, isNew])

  // Cálculo automático do período quando a data de início da medição mudar (apenas em novas)
  useEffect(() => {
    if (isNew && dataInicio && contrato?.dataInicio) {
      // Usar split para evitar problemas de timezone com T00:00:00
      const [anoC, mesC, diaC] = contrato.dataInicio.split('-').map(Number)
      const [anoM, mesM, diaM] = dataInicio.split('-').map(Number)

      let diffYears = anoM - anoC
      // Verifica se já fez aniversário no ano da medição
      const isBeforeAnniversary = mesM < mesC || (mesM === mesC && diaM < diaC)
      
      if (isBeforeAnniversary) {
        diffYears--
      }
      
      const calcPeriodo = Math.max(1, diffYears + 1)
      setPeriodo(calcPeriodo)
    }
  }, [dataInicio, contrato?.dataInicio, isNew])

  const resumo = useMemo(() => {
    if (!medicaoExistente) return null
    return calcularResumoMedicao(Number(contratoId), medicaoExistente.numero)
  }, [contratoId, medicaoExistente])

  // Estado dos itens
  const [itens, setItens] = useState([])
  
  // Carrega itens iniciais
  useEffect(() => {
    if (isNew) {
      // Iniciar com itens do contrato zerados
      const contratoItens = itensContrato[Number(contratoId)] || []
      const itensZerados = contratoItens.map(item => ({
        itemId: Date.now() + Math.random(),
        codigoItem: item.codigoItem,
        descricao: item.descricao,
        unidade: item.unidade || 'UN',
        qtdContratadaVigente: item.qtdVigente || 0,
        qtdAcumuladaAnterior: 0,
        qtdMedidaPeriodo: 0,
        precoUnitVigente: item.precoUnitVigente || 0,
        observacao: '',
      }))
      setItens(itensZerados)
    } else if (medicaoExistente) {
      setItens(getItensMedicaoComCalculos(medicaoExistente.id, medicaoExistente.contratoId, medicaoExistente.numero))
    }
  }, [isNew, medicaoExistente, contratoId])

  if (!contrato || (!isNew && !medicaoExistente)) {
    return <div><p>Medição não encontrada.</p></div>
  }

  // Handler de alteração da quantidade medida
  const handleQtdChange = (index, value) => {
    setItens(prev => {
      const newItens = [...prev]
      const item = newItens[index]
      
      const novaQtdMedida = value || 0
      const qtdAcumuladaAtual = (item.qtdAcumuladaAnterior || 0) + novaQtdMedida
      const saldoQtd = (item.qtdContratadaVigente || 0) - qtdAcumuladaAtual
      const valorMedidoPeriodo = novaQtdMedida * (item.precoUnitVigente || 0)

      let statusSaldo
      if (saldoQtd > 0) statusSaldo = { label: 'OK', type: 'ok' }
      else if (saldoQtd === 0) statusSaldo = { label: 'Saldo zerado', type: 'zerado' }
      else statusSaldo = { label: 'Saldo negativo', type: 'negativo' }

      newItens[index] = {
        ...item,
        qtdMedidaPeriodo: novaQtdMedida,
        qtdAcumuladaAtual,
        saldoQtd,
        valorMedidoPeriodo,
        statusSaldo
      }
      
      return newItens
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    if (isNew) {
      if (!dataInicio || !dataTermino) {
        alert('Datas de início e término são obrigatórias.')
        return
      }
      const novaMedicao = criarMedicao(Number(contratoId), {
        periodoInicio: dataInicio,
        periodoTermino: dataTermino,
        nrProtocolo: nrProtocolo,
        periodo: Number(periodo) || 1,
        medicaoR$: itens.reduce((s, i) => s + (i.valorMedidoPeriodo || 0), 0)
      })
      atualizarItensMedicao(novaMedicao.id, itens)
      
      setSaveMessage('Medição criada com sucesso!')
      setTimeout(() => navigate(`/contratos/${contratoId}`), 1000)
    } else {
      atualizarItensMedicao(Number(medicaoId), itens)
      setHasChanges(false)
      setSaveMessage('Alterações salvas com sucesso!')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const handleBack = () => {
    if (hasChanges) {
      setShowExitConfirm(true)
    } else {
      navigate(`/contratos/${contratoId}`)
    }
  }

  const totalMedidoPeriodo = itens.reduce((s, i) => s + (i.valorMedidoPeriodo || 0), 0)

  return (
    <div>
      <ContratoInfoBar contrato={contrato} />
      <div style={{ padding: '16px 0' }}>
        <button className="back-button" onClick={handleBack}>
          ← Contrato {contrato.numero}
        </button>

        <h1 className="page-title">{isNew ? 'Nova Medição' : `Medição ${medicaoExistente.numero}`}</h1>
        
        {saveMessage && (
          <div className="alert alert-success">{saveMessage}</div>
        )}

        {/* INFORMAÇÕES DA MEDIÇÃO */}
        <CollapsibleSection title="Informações da Medição" defaultOpen={true}>
          <div className="card">
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data Início</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataInicio}
                    onChange={e => { setDataInicio(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data Término</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataTermino}
                    onChange={e => { setDataTermino(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Período</label>
                  <input
                    type="number"
                    className="form-control"
                    value={periodo}
                    onChange={e => { setPeriodo(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nº Protocolo</label>
                  <input
                    className="form-control"
                    value={nrProtocolo}
                    onChange={e => { setNrProtocolo(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* RESUMO GERAL */}
        {!isNew && (
          <CollapsibleSection title="Resumo Geral - Contrato" defaultOpen={true}>
            {resumo && (
              <div className="resumo-grid">
                <div className="resumo-card">
                  <div className="resumo-card-label">Medição Atual</div>
                  <div className="resumo-card-value">{resumo.medicaoAtual}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">% Executado</div>
                  <div className="resumo-card-value">{resumo.percentualExecutado.toFixed(2)}%</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Medição (R$)</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.medicaoR$)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Reajuste (R$)</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.reajusteR$)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Med + Reaj (R$)</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.medicaoMaisReajuste)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Descontos (R$)</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.descontosR$)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Total Geral</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.totalGeralMedReajDesc)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Valor Contratado</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.valorTotalContratado)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Saldo Contrato</div>
                  <div className={`resumo-card-value ${resumo.saldoContrato >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(resumo.saldoContrato)}
                  </div>
                </div>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* ITENS DA MEDIÇÃO */}
        <CollapsibleSection title="Itens da Medição" defaultOpen={true}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Descrição</th>
                  <th>Und.</th>
                  <th style={{ textAlign: 'right' }}>Qtd. Contratada</th>
                  <th style={{ textAlign: 'right' }}>Qtd. Acum. Anterior</th>
                  <th style={{ textAlign: 'center' }}>Qtd. Medida Período</th>
                  <th style={{ textAlign: 'right' }}>Qtd. Acum. Atual</th>
                  <th style={{ textAlign: 'right' }}>Saldo Qtd.</th>
                  <th style={{ textAlign: 'right' }}>Preço Unit. (R$)</th>
                  <th style={{ textAlign: 'right' }}>Valor Medido (R$)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                      Nenhum item nesta medição.
                    </td>
                  </tr>
                ) : (
                  itens.map((item, idx) => (
                    <tr key={item.itemId || idx}>
                      <td>{item.codigoItem}</td>
                      <td>{item.descricao}</td>
                      <td>{item.unidade}</td>
                      <td className="cell-currency">{formatQuantity(item.qtdContratadaVigente)}</td>
                      <td className="cell-currency cell-protected">{formatQuantity(item.qtdAcumuladaAnterior)}</td>
                      
                      <td className="cell-currency" style={{ padding: 0 }}>
                        <CellInput
                          value={item.qtdMedidaPeriodo}
                          type="quantity"
                          field="qtdMedidaPeriodo"
                          onChange={(val) => handleQtdChange(idx, val)}
                          rowIndex={idx}
                          style={{
                            width: '100%',
                            minWidth: 100,
                            padding: '8px',
                            textAlign: 'right',
                            border: 'none',
                            backgroundColor: 'transparent',
                            outline: 'none',
                          }}
                        />
                      </td>

                      <td className="cell-currency cell-calculated">{formatQuantity(item.qtdAcumuladaAtual || 0)}</td>
                      <td className={`cell-currency ${item.saldoQtd < 0 ? 'cell-error' : ''}`}>
                        {formatQuantity(item.saldoQtd || 0)}
                      </td>
                      <td className="cell-currency">{formatCurrency(item.precoUnitVigente)}</td>
                      <td className="cell-currency cell-calculated">{formatCurrency(item.valorMedidoPeriodo || 0)}</td>
                      <td>
                        <span className={`status-${item.statusSaldo?.type || 'ok'}`}>
                          {item.statusSaldo?.label || 'OK'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {itens.length > 0 && (
                <tfoot>
                  <tr className="totals-row">
                    <td colSpan={5}><strong>{itens.length} itens</strong></td>
                    <td className="cell-currency"><strong>{formatQuantity(itens.reduce((s, i) => s + (i.qtdMedidaPeriodo || 0), 0))}</strong></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="cell-currency"><strong>{formatCurrency(totalMedidoPeriodo)}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CollapsibleSection>

        {/* Ações */}
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 {isNew ? 'Criar Medição' : 'Salvar Alterações'}
          </button>
          <button className="btn btn-outline" onClick={handleBack}>
            Cancelar
          </button>
        </div>
      </div>
      
      {/* Confirmação de saída sem salvar */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Alterações não salvas"
        message="Existem alterações não salvas. Deseja sair sem salvar?"
        onConfirm={() => navigate(`/contratos/${contratoId}`)}
        onCancel={() => setShowExitConfirm(false)}
        confirmLabel="Sair sem salvar"
        cancelLabel="Continuar editando"
        type="danger"
      />
    </div>
  )
}
