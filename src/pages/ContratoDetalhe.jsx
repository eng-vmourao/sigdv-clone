import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato, atualizarLeiAplicavel } from '../services/contratoService'
import { listarTAMs } from '../services/tamService'
import { listarMedicoes, excluirMedicao } from '../services/medicaoService'
import { calcularResumoContrato } from '../services/calculoService'
import itensContrato from '../data/itensContrato'
import CollapsibleSection from '../components/UI/CollapsibleSection'
import BackButton from '../components/UI/BackButton'
import ContratoInfoBar from '../components/Contrato/ContratoInfoBar'
import LeiAplicavelSelect from '../components/Contrato/LeiAplicavelSelect'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import NewItemModal from '../components/TAM/NewItemModal'
import { formatCurrency, formatDate, formatQuantity } from '../utils/formatters'
import { TAM_TYPES } from '../config/tamTypes'

export default function ContratoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showNewItemModal, setShowNewItemModal] = useState(false)

  const contrato = useMemo(() => getContrato(id), [id])
  const tamsList = useMemo(() => listarTAMs(Number(id)), [id, refreshKey])
  const medicoesList = useMemo(() => listarMedicoes(Number(id)), [id, refreshKey])
  const resumo = useMemo(() => calcularResumoContrato(Number(id)), [id, refreshKey])
  const itens = useMemo(() => itensContrato[Number(id)] || [], [id, refreshKey])

  const handleAddItem = (novoItem) => {
    const contratoIdNum = Number(id);
    if (!itensContrato[contratoIdNum]) {
      itensContrato[contratoIdNum] = [];
    }
    
    // Verifica se item com o mesmo código já existe
    if (itensContrato[contratoIdNum].some(i => i.codigoItem === novoItem.codigoItem)) {
      alert(`Item com código ${novoItem.codigoItem} já existe neste contrato.`);
      return;
    }
    
    const maxId = itensContrato[contratoIdNum].reduce((max, i) => Math.max(max, i.id), 0);
    itensContrato[contratoIdNum].push({
      id: maxId + 1,
      ...novoItem,
      qtdVigente: Number(novoItem.qtdVigente) || 0,
      precoUnitVigente: Number(novoItem.precoUnitVigente) || 0,
    });
    
    setRefreshKey(k => k + 1);
  }

  // Restore and save scroll position
  useEffect(() => {
    const scrollKey = `scroll_contrato_${id}`
    const savedScroll = sessionStorage.getItem(scrollKey)
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10))
      }, 50)
    }

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, window.scrollY.toString())
    }

    // Atraso pequeno para evitar salvar 0 antes da renderização completa
    const timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [id])

  if (!contrato) {
    return <div className="app-content"><p>Contrato não encontrado.</p></div>
  }

  const handleLeiChange = (lei) => {
    atualizarLeiAplicavel(contrato.id, lei)
    setRefreshKey(k => k + 1)
  }

  const handleDeleteMedicao = (medicaoId) => {
    excluirMedicao(Number(id), medicaoId)
    setConfirmDelete(null)
    setRefreshKey(k => k + 1)
  }

  return (
    <div>
      <ContratoInfoBar contrato={contrato} />
      <div style={{ padding: '16px 0' }}>
        <BackButton to="/contratos" label="Contratos" />

        {/* INFORMAÇÕES GERAIS */}
        <CollapsibleSection title="Informações Gerais" defaultOpen={false} storageKey={`contrato_${id}_info`}>
          <div className="card">
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nº Contrato</label>
                  <input className="form-control" value={contrato.numero} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Contratada</label>
                  <input className="form-control" value={contrato.contratada} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Regional</label>
                  <input className="form-control" value={contrato.regional} disabled />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Objeto Resumido</label>
                  <input className="form-control" value={contrato.objetoResumido} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Coordenadoria</label>
                  <input className="form-control" value={contrato.coordenadoria || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Lei Aplicável</label>
                  <LeiAplicavelSelect value={contrato.leiAplicavel} onChange={handleLeiChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data Início</label>
                  <input className="form-control" value={formatDate(contrato.dataInicio)} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Data Término</label>
                  <input className="form-control" value={formatDate(contrato.dataTermino)} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input className="form-control" value={contrato.status} disabled />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ORÇAMENTO E CONTRATAÇÃO INICIAL */}
        <CollapsibleSection title="Orçamento e Contratação Inicial" defaultOpen={false} storageKey={`contrato_${id}_orcamento`}>
          <div className="table-controls" style={{ marginBottom: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowNewItemModal(true)}>
              + Novo Item
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Descrição</th>
                  <th>Unidade</th>
                  <th style={{ textAlign: 'right' }}>Qtde</th>
                  <th style={{ textAlign: 'right' }}>Preço Unit. (R$)</th>
                  <th style={{ textAlign: 'right' }}>Preço Total (R$)</th>
                </tr>
              </thead>
              <tbody>
                {itens.map(item => (
                  <tr key={item.id}>
                    <td>{item.codigoItem}</td>
                    <td>{item.descricao}</td>
                    <td>{item.unidade || '-'}</td>
                    <td className="cell-currency">{formatQuantity(item.qtdVigente)}</td>
                    <td className="cell-currency">{formatCurrency(item.precoUnitVigente)}</td>
                    <td className="cell-currency">{formatCurrency(item.qtdVigente * item.precoUnitVigente)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="totals-row">
                  <td colSpan={3}><strong>{itens.length} itens</strong></td>
                  <td></td>
                  <td></td>
                  <td className="cell-currency"><strong>{formatCurrency(itens.reduce((s, i) => s + i.qtdVigente * i.precoUnitVigente, 0))}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CollapsibleSection>

        {/* EQUIPE TÉCNICA */}
        <CollapsibleSection title="Equipe Técnica" defaultOpen={false} storageKey={`contrato_${id}_equipe`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados da equipe técnica do contrato.</p>
        </CollapsibleSection>

        {/* TAM's */}
        <CollapsibleSection title="TAM's" defaultOpen={true} storageKey={`contrato_${id}_tams`}>
          <div className="table-controls">
            <button className="btn btn-outline" onClick={() => navigate(`/contratos/${id}/tam/novo`)}>
              Novo
            </button>
            <div className="table-search">
              <label style={{ marginRight: 4, fontSize: '0.75rem' }}>Pesquisar:</label>
              <input type="text" placeholder="Buscar..." />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Numero Tam</th>
                  <th>Termo Aditivo e Modificativo</th>
                  <th colSpan={2} style={{ textAlign: 'center' }}>Base Medição</th>
                  <th colSpan={2} style={{ textAlign: 'center' }}>Base Relatório</th>
                  <th>Período</th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th>Início (TAM)</th>
                  <th>Término (TAM)</th>
                  <th>Início (Contrato)</th>
                  <th>Término (Contrato)</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tamsList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                      Nenhuma TAM cadastrada.
                    </td>
                  </tr>
                ) : (
                  tamsList.map(tam => (
                    <tr key={tam.id}>
                      <td><strong>{tam.numero}</strong></td>
                      <td>{TAM_TYPES[tam.tipo]?.label || tam.tipo}</td>
                      <td>{formatDate(tam.dataInicio)}</td>
                      <td>{formatDate(tam.dataTermino)}</td>
                      <td>{formatDate(tam.inicioContrato)}</td>
                      <td>{formatDate(tam.terminoContrato)}</td>
                      <td>{tam.periodo}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-sm btn-outline" onClick={() => navigate(`/contratos/${id}/tam/${tam.id}`)}>
                            ✏️
                          </button>
                          <button className="btn btn-sm btn-outline" title="Excluir">🗑️</button>
                          <div className="btn btn-sm btn-outline" style={{ cursor: 'pointer' }}>
                            Ação ▾
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="table-info" style={{ marginTop: 4 }}>
            Mostrando de 1 até {tamsList.length} de {tamsList.length} registros
          </div>
        </CollapsibleSection>

        {/* MEDIÇÃO */}
        <CollapsibleSection title="Medição" defaultOpen={false} storageKey={`contrato_${id}_medicao`}>
          <div className="table-controls">
            <button className="btn btn-outline" onClick={() => navigate(`/contratos/${id}/medicao/novo`)}>
              Nova Medição
            </button>
            <div className="table-search">
              <label style={{ marginRight: 4, fontSize: '0.75rem' }}>Pesquisar:</label>
              <input type="text" placeholder="Buscar..." />
            </div>
          </div>

          {/* Resumo Geral */}
          {resumo && (
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 8 }}>Resumo Geral - Contrato</h4>
              <div className="resumo-grid">
                <div className="resumo-card">
                  <div className="resumo-card-label">Medição Atual</div>
                  <div className="resumo-card-value">{resumo.totalMedicoes}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">% Executado</div>
                  <div className="resumo-card-value">{resumo.percentualExecutado.toFixed(2)}%</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Total Executado (R$)</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.totalExecutado)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Valor Total Contratado</div>
                  <div className="resumo-card-value">{formatCurrency(resumo.valorTotalContratado)}</div>
                </div>
                <div className="resumo-card">
                  <div className="resumo-card-label">Saldo Contrato (R$)</div>
                  <div className={`resumo-card-value ${resumo.saldoContrato >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(resumo.saldoContrato)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Medições */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medição</th>
                  <th>Início</th>
                  <th>Término</th>
                  <th style={{ textAlign: 'right' }}>Medição (R$)</th>
                  <th style={{ textAlign: 'right' }}>Reajuste (R$)</th>
                  <th style={{ textAlign: 'right' }}>Desconto (R$)</th>
                  <th>Protocolo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {medicoesList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                      Nenhuma medição cadastrada.
                    </td>
                  </tr>
                ) : (
                  medicoesList.map(med => (
                    <tr key={med.id}>
                      <td><strong>{med.numero}</strong></td>
                      <td>{formatDate(med.periodoInicio)}</td>
                      <td>{formatDate(med.periodoTermino)}</td>
                      <td className="cell-currency">{formatCurrency(med.medicaoR$)}</td>
                      <td className="cell-currency">{formatCurrency(med.reajusteR$)}</td>
                      <td className="cell-currency">{formatCurrency(med.descontoR$)}</td>
                      <td>{med.nrProtocolo || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-sm btn-outline"
                            onClick={() => navigate(`/contratos/${id}/medicao/${med.id}`)}>
                            ✏️
                          </button>
                          <button className="btn btn-sm btn-outline"
                            onClick={() => setConfirmDelete(med)}
                            title="Excluir">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* LIBERAÇÃO MEDIÇÃO */}
        <CollapsibleSection title="Liberação Medição" defaultOpen={false} storageKey={`contrato_${id}_liberacao`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados de liberação de medição.</p>
        </CollapsibleSection>

        {/* VALORES VIGENTES */}
        <CollapsibleSection title="Valores Vigentes" defaultOpen={false} storageKey={`contrato_${id}_valores_vigentes`}>
          {resumo && (
            <div className="resumo-grid">
              <div className="resumo-card">
                <div className="resumo-card-label">Valor Total Contratado</div>
                <div className="resumo-card-value">{formatCurrency(resumo.valorTotalContratado)}</div>
              </div>
              <div className="resumo-card">
                <div className="resumo-card-label">Total Executado</div>
                <div className="resumo-card-value">{formatCurrency(resumo.totalExecutado)}</div>
              </div>
              <div className="resumo-card">
                <div className="resumo-card-label">Saldo</div>
                <div className={`resumo-card-value ${resumo.saldoContrato >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(resumo.saldoContrato)}
                </div>
              </div>
              <div className="resumo-card">
                <div className="resumo-card-label">TAMs Aplicadas</div>
                <div className="resumo-card-value">{resumo.totalTams}</div>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* CRONOGRAMA */}
        <CollapsibleSection title="Cronograma" defaultOpen={false} storageKey={`contrato_${id}_cronograma`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados do cronograma.</p>
        </CollapsibleSection>

        {/* PAGAMENTO */}
        <CollapsibleSection title="Pagamento" defaultOpen={false} storageKey={`contrato_${id}_pagamento`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados de pagamento.</p>
        </CollapsibleSection>

        {/* ATESTADO DE CAPACIDADE TÉCNICA */}
        <CollapsibleSection title="Atestado de Capacidade Técnica" defaultOpen={false} storageKey={`contrato_${id}_atestado`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados do atestado.</p>
        </CollapsibleSection>

        {/* ENCERRAMENTO */}
        <CollapsibleSection title="Encerramento" defaultOpen={false} storageKey={`contrato_${id}_encerramento`}>
          <p style={{ color: 'var(--text-muted)', padding: 16 }}>Dados de encerramento.</p>
        </CollapsibleSection>

        {/* Botão Voltar */}
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/contratos')}>
            Voltar
          </button>
        </div>
      </div>

      {/* Diálogo de confirmação de exclusão de medição (SIGDV-07) */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Excluir Medição"
        message={confirmDelete ? `Deseja excluir a Medição ${confirmDelete.numero}? As medições posteriores serão recalculadas automaticamente.` : ''}
        onConfirm={() => handleDeleteMedicao(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Excluir"
      />

      {/* Modal de novo item (SIGDV-10) */}
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onAdd={handleAddItem}
        tamTipo="PRORROGACAO"
      />
    </div>
  )
}
