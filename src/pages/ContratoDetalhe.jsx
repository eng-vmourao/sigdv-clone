import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato, atualizarLeiAplicavel, atualizarContrato } from '../services/contratoService'
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

  const contrato = useMemo(() => getContrato(id), [id, refreshKey])

  const [infoGerais, setInfoGerais] = useState({
    dataAssinatura: '',
    objetoContrato: contrato?.objetoResumido || '',
    dataBaseContrato: '',
    dataPrimeiraNotaServico: '',
    coordenadoria: contrato?.coordenadoria || '',
    leiAplicavel: contrato?.leiAplicavel || '',
  });

  const [orcamento, setOrcamento] = useState({
    dataInicio: contrato?.dataInicio || '',
    dataTermino: contrato?.dataTermino || '',
    duracao: '',
    duracaoUnidade: 'meses',
    passivelProrrogacao: 'Sim',
    meios: 'PRODESP',
  });

  const handleOrcamentoChange = (field, value) => {
    setOrcamento(prev => ({ ...prev, [field]: value }));
  };

  // Sincronizar estado local quando o contrato carregar/atualizar
  useEffect(() => {
    if (contrato) {
      setInfoGerais({
        dataAssinatura: contrato.dataAssinatura || '',
        objetoContrato: contrato.objetoContrato || contrato.objetoResumido || '',
        dataBaseContrato: contrato.dataBaseContrato || '',
        dataPrimeiraNotaServico: contrato.dataPrimeiraNotaServico || '',
        coordenadoria: contrato.coordenadoria || ''
      })
    }
  }, [contrato])

  const handleInfoGeraisChange = (field, value) => {
    setInfoGerais(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveInfoGerais = () => {
    atualizarContrato(contrato.id, infoGerais)
    alert('Informações gerais salvas com sucesso!')
    setRefreshKey(k => k + 1)
  }
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
              {/* Row 1: Dados estáticos */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', fontSize: '0.85rem' }}>
                <div><strong>Nº do Contrato:</strong> {contrato.numero}</div>
                <div><strong>Edital:</strong> {contrato.edital || `TAC nº ${contrato.numero}`}</div>
                <div><strong>Nº do Protocolo:</strong> {contrato.nrProtocolo || '0194/2025'}</div>
                <div><strong>Lote:</strong> {contrato.lote || 'SEDE'}</div>
                <div><strong>Regional:</strong> {contrato.regional}</div>
                <div><strong>Natureza:</strong> {contrato.natureza || contrato.objetoResumido}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong>Data da Publicação do Extrato do Contrato:</strong> {contrato.dataPublicacaoExtrato || '11/02/2019'}
                  <button className="btn btn-primary btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Extratos</button>
                </div>
              </div>

              {/* Row 2: Assinatura e Anexos */}
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Data da Assinatura do Contrato</label>
                  <input type="date" className="form-control" value={infoGerais.dataAssinatura} onChange={e => handleInfoGeraisChange('dataAssinatura', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Anexos do Contrato</label>
                  <button className="btn btn-primary btn-block">Anexos</button>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Empresas do Contrato</label>
                  <button className="btn btn-primary btn-block">Empresas</button>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Regionais</label>
                  <button className="btn btn-primary btn-block">Regionais</button>
                </div>
              </div>

              {/* Row 3: Objeto */}
              <div className="form-group">
                <label className="form-label">Objeto do Contrato</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={infoGerais.objetoContrato} 
                  onChange={e => handleInfoGeraisChange('objetoContrato', e.target.value)}
                ></textarea>
              </div>

              {/* Row 4: Datas e Coordenadoria */}
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Data Base do Contrato</label>
                  <input type="date" className="form-control" value={infoGerais.dataBaseContrato} onChange={e => handleInfoGeraisChange('dataBaseContrato', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Data 1ª Nota de Serviço</label>
                  <input type="date" className="form-control" value={infoGerais.dataPrimeiraNotaServico} onChange={e => handleInfoGeraisChange('dataPrimeiraNotaServico', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Anexos Nota de Serviço</label>
                  <button className="btn btn-primary btn-block">Anexos</button>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Coordenadoria</label>
                  <select className="form-control" value={infoGerais.coordenadoria} onChange={e => handleInfoGeraisChange('coordenadoria', e.target.value)}>
                    <option value="">Selecione...</option>
                    <option value="COV - Coordenadoria de Operação Viária">COV - Coordenadoria de Operação Viária</option>
                    <option value="COT">COT</option>
                    <option value="CRO">CRO</option>
                    <option value="CET">CET</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Lei Aplicável</label>
                  <LeiAplicavelSelect value={contrato.leiAplicavel} onChange={handleLeiChange} />
                </div>
              </div>

              {/* Row 5: Salvar */}
              <div style={{ marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={handleSaveInfoGerais} style={{ minWidth: '150px' }}>Salvar</button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ORÇAMENTO E CONTRATAÇÃO INICIAL */}
        <CollapsibleSection title="Orçamento e Contratação Inicial" defaultOpen={false} storageKey={`contrato_${id}_orcamento`}>
          <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Importar Excel (xlsx)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="file" accept=".xlsx" className="form-control" style={{ maxWidth: '400px' }} />
                <button className="btn btn-primary">Importar</button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Data Início</label>
                <input type="date" className="form-control" value={orcamento.dataInicio} onChange={e => handleOrcamentoChange('dataInicio', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Data Término</label>
                <input type="date" className="form-control" value={orcamento.dataTermino} onChange={e => handleOrcamentoChange('dataTermino', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Duração do contrato</label>
                <div style={{ display: 'flex' }}>
                  <input type="number" className="form-control" style={{ flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 0 }} value={orcamento.duracao} onChange={e => handleOrcamentoChange('duracao', e.target.value)} />
                  <select className="form-control" style={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} value={orcamento.duracaoUnidade} onChange={e => handleOrcamentoChange('duracaoUnidade', e.target.value)}>
                    <option value="dias">Dias</option>
                    <option value="meses">Meses</option>
                    <option value="anos">Anos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Passível de Prorrogação</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="radio" name="passivelProrrogacao" value="Sim" checked={orcamento.passivelProrrogacao === 'Sim'} onChange={e => handleOrcamentoChange('passivelProrrogacao', e.target.value)} />
                    Sim
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="radio" name="passivelProrrogacao" value="Não" checked={orcamento.passivelProrrogacao === 'Não'} onChange={e => handleOrcamentoChange('passivelProrrogacao', e.target.value)} />
                    Não
                  </label>
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Meios</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="radio" name="meios" value="PRODESP" checked={orcamento.meios === 'PRODESP'} onChange={e => handleOrcamentoChange('meios', e.target.value)} />
                    PRODESP
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input type="radio" name="meios" value="SQA" checked={orcamento.meios === 'SQA'} onChange={e => handleOrcamentoChange('meios', e.target.value)} />
                    SQA
                  </label>
                </div>
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
          </div>

          <div className="table-controls" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setShowNewItemModal(true)}>
              + Novo Item
            </button>
            <input type="text" className="form-control" placeholder="Pesquisar..." style={{ maxWidth: '250px' }} />
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
