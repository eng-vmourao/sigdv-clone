import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato } from '../services/contratoService'
import { getMedicao, getItensMedicaoComCalculos } from '../services/medicaoService'
import { calcularResumoMedicao } from '../services/calculoService'
import CollapsibleSection from '../components/UI/CollapsibleSection'
import ContratoInfoBar from '../components/Contrato/ContratoInfoBar'
import BackButton from '../components/UI/BackButton'
import { formatCurrency, formatDate, formatQuantity } from '../utils/formatters'

/**
 * Editor de Medição
 * Implements: SIGDV-03 (4 casas decimais), SIGDV-02 (resumo centralizado)
 */
export default function MedicaoEditor() {
  const { contratoId, medicaoId } = useParams()
  const navigate = useNavigate()

  const contrato = useMemo(() => getContrato(contratoId), [contratoId])
  const medicao = useMemo(() => getMedicao(Number(medicaoId)), [medicaoId])
  const itens = useMemo(() => {
    if (!medicao) return []
    return getItensMedicaoComCalculos(medicao.id, medicao.contratoId, medicao.numero)
  }, [medicao])
  const resumo = useMemo(() => {
    if (!medicao) return null
    return calcularResumoMedicao(Number(contratoId), medicao.numero)
  }, [contratoId, medicao])

  if (!contrato || !medicao) {
    return <div><p>Medição não encontrada.</p></div>
  }

  const totalMedidoPeriodo = itens.reduce((s, i) => s + (i.valorMedidoPeriodo || 0), 0)

  return (
    <div>
      <ContratoInfoBar contrato={contrato} />
      <div style={{ padding: '16px 0' }}>
        <button className="back-button" onClick={() => navigate(`/contratos/${contratoId}`)}>
          ← Contrato {contrato.numero}
        </button>

        <h1 className="page-title">Medição {medicao.numero}</h1>
        <p className="page-subtitle">
          Período: {formatDate(medicao.periodoInicio)} a {formatDate(medicao.periodoTermino)}
          {medicao.nrProtocolo && ` | Protocolo: ${medicao.nrProtocolo}`}
        </p>

        {/* RESUMO GERAL */}
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
                  <th style={{ textAlign: 'right' }}>Qtd. Medida Período</th>
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
                      <td className="cell-currency">{formatQuantity(item.qtdMedidaPeriodo)}</td>
                      <td className="cell-currency cell-calculated">{formatQuantity(item.qtdAcumuladaAtual)}</td>
                      <td className={`cell-currency ${item.saldoQtd < 0 ? 'cell-error' : ''}`}>
                        {formatQuantity(item.saldoQtd)}
                      </td>
                      <td className="cell-currency">{formatCurrency(item.precoUnitVigente)}</td>
                      <td className="cell-currency cell-calculated">{formatCurrency(item.valorMedidoPeriodo)}</td>
                      <td>
                        <span className={`status-${item.statusSaldo.type}`}>
                          {item.statusSaldo.label}
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

        {/* Botão Voltar */}
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => navigate(`/contratos/${contratoId}`)}>
            Voltar ao Contrato
          </button>
        </div>
      </div>
    </div>
  )
}
