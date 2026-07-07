import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato } from '../services/contratoService'
import { getTAM, criarTAM, atualizarTAM, atualizarItensTAM, getProximoNumeroTAM } from '../services/tamService'
import { getTAMConfig, TAM_TYPE_OPTIONS } from '../config/tamTypes'
import ConfigurableTable from '../components/Table/ConfigurableTable'
import ContratoInfoBar from '../components/Contrato/ContratoInfoBar'
import CollapsibleSection from '../components/UI/CollapsibleSection'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import { formatDate } from '../utils/formatters'
import itensContrato from '../data/itensContrato'
import medicoes from '../data/medicoes'

// Helper para inicializar itens de nova TAM zerados
function getItensZerados(contratoItens, tipo) {
  return contratoItens.map(item => {
    const base = {
      codigoItem: item.codigoItem,
      descricao: item.descricao,
      qtdVigente: item.qtdVigente,
      precoUnitVigente: item.precoUnitVigente,
    };
    switch (tipo) {
      case 'PRORROGACAO':
      case 'PRORROGACAO_EXCEPCIONALIDADE':
        return { ...base, variacaoQtd: 0, descUnitPerc: 0, descUnitValor: 0, reajUnitPerc: 0, reajUnitValor: 0 };
      case 'ACRESCIMO':
        return { ...base, qtdAcrescida: 0 };
      case 'SUPRESSAO':
        return { ...base, qtdSuprimida: 0 };
      case 'ANULACAO':
        return { ...base, anularMedicao: '', anularPeriodo: '' };
      case 'REAJUSTE':
        return { ...base, reajUnitPerc: 0, reajUnitValor: 0 };
      case 'DESCONTO':
        return { ...base, descUnitPerc: 0, descUnitValor: 0 };
      default:
        return base;
    }
  });
}

/**
 * Editor de TAM — usa ConfigurableTable baseado no tipo
 * Implements: SIGDV-04 (7 tipos), SIGDV-05 (tabela configurável),
 * SIGDV-06 (qtd zeradas), SIGDV-09 (numeração auto), SIGDV-10 (novo item)
 */
export default function TAMEditor() {
  const { contratoId, tamId } = useParams()
  const navigate = useNavigate()
  const isNew = tamId === undefined || tamId === 'novo'

  const contrato = useMemo(() => getContrato(contratoId), [contratoId])

  // Estado do formulário
  const [tipo, setTipo] = useState('PRORROGACAO')
  const [medicaoInicio, setMedicaoInicio] = useState(tamExistente?.medicaoInicio?.toString() || '1')
  const [dataInicio, setDataInicio] = useState(tamExistente?.dataInicio || '')
  const [periodo, setPeriodo] = useState(tamExistente?.periodo || '')
  const [inicioContrato, setInicioContrato] = useState(tamExistente?.inicioContrato || '')
  const [terminoContrato, setTerminoContrato] = useState('')
  const [modoAnulacao, setModoAnulacao] = useState('medicao')
  const [observacao, setObservacao] = useState('')
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Carrega Medições
  const medicoesContrato = useMemo(() => {
    const list = medicoes[Number(contratoId)] || []
    return [...list].sort((a, b) => a.numero - b.numero)
  }, [contratoId])

  const proximaMedicaoNum = medicoesContrato.length > 0 
    ? medicoesContrato[medicoesContrato.length - 1].numero + 1 
    : 1

  // Carrega TAM existente
  const tamExistente = useMemo(() => {
    if (isNew) return null
    const tam = getTAM(Number(tamId))
    if (tam) {
      setTipo(tam.tipo)
      setMedicaoInicio(String(tam.medicaoInicio || tam.baseMedicao || ''))
      setDataInicio(tam.dataInicio || '')
      setInicioContrato(tam.inicioContrato || '')
      setTerminoContrato(tam.terminoContrato || '')
      if (tam.tipo === 'ANULACAO') {
        const hasPeriodo = tam.itens?.some(i => !!i.anularPeriodo);
        setModoAnulacao(hasPeriodo ? 'periodo' : 'medicao');
      }
      setObservacao(tam.observacao || '')
    }
    return tam
  }, [tamId, isNew])

  // Estado dos itens
  const [itens, setItens] = useState(() => {
    if (!isNew && tamExistente?.itens) return [...tamExistente.itens]
    const contratoItens = itensContrato[Number(contratoId)] || []
    return getItensZerados(contratoItens, 'PRORROGACAO')
  })

  // Próximo número (SIGDV-09 modificado para medicaoInicio)
  const proximoNumero = useMemo(() => {
    if (!isNew) return tamExistente?.numero
    return getProximoNumeroTAM(Number(contratoId), medicaoInicio, tipo)
  }, [contratoId, isNew, tamExistente, medicaoInicio, tipo])

  // Config do tipo selecionado
  const config = useMemo(() => getTAMConfig(tipo), [tipo])

  const modifiedConfig = useMemo(() => {
    if (!config) return null;
    if (tipo === 'ANULACAO') {
      const newConfig = { ...config, columns: [...config.columns] }
      if (modoAnulacao === 'medicao') {
        newConfig.columns = newConfig.columns.filter(c => c !== 'anularPeriodo')
      } else {
        newConfig.columns = newConfig.columns.filter(c => c !== 'anularMedicao')
      }
      return newConfig;
    }
    return config;
  }, [config, tipo, modoAnulacao]);

  const selectOptions = useMemo(() => {
    const medOptions = medicoesContrato.map(m => ({ value: m.numero.toString(), label: `Medição ${m.numero}` }))
    const periodosMap = new Set(medicoesContrato.map(m => m.periodo).filter(Boolean))
    const perOptions = Array.from(periodosMap).sort().map(p => ({ value: p.toString(), label: `Período ${p}` }))
    return {
      medicoes: medOptions,
      periodos: perOptions
    }
  }, [medicoesContrato])

  // Handler de alteração de tipo
  const handleTipoChange = (novoTipo) => {
    setTipo(novoTipo)
    // Se é nova TAM, reinicializa itens zerados com a configuração do tipo de TAM correspondente
    if (isNew) {
      const contratoItens = itensContrato[Number(contratoId)] || []
      setItens(getItensZerados(contratoItens, novoTipo))
    }
    setHasChanges(true)
  }

  // Handler de alteração de linha
  const handleRowChange = useCallback((rowIndex, updatedRow) => {
    setItens(prev => {
      const newItens = [...prev]
      newItens[rowIndex] = updatedRow
      return newItens
    })
    setHasChanges(true)
  }, [])

  const handleMedicaoChange = (val) => {
    setMedicaoInicio(val)
    setHasChanges(true)
    
    if (!isNew && tamExistente?.medicaoInicio) {
      setMedicaoInicio(tamExistente.medicaoInicio.toString())
    } else if (isNew) {
      if (medicoesContrato.length > 0) {
        const last = medicoesContrato[medicoesContrato.length - 1]
        if (last.periodoTermino) {
          const d = new Date(last.periodoTermino + 'T12:00:00')
          d.setDate(d.getDate() + 1)
          setDataInicio(d.toISOString().split('T')[0])
        }
        setPeriodo(tipo === 'PRORROGACAO' ? last.periodo + 1 : last.periodo)
      } else if (contrato?.orcamento) {
        setDataInicio(contrato.orcamento.dataInicio)
        setPeriodo(1)
      }
    } else {
      const med = medicoesContrato.find(m => m.numero.toString() === val)
      if (med) {
        setDataInicio(med.periodoInicio)
        setPeriodo(med.periodo)
      } else {
        setDataInicio('')
        setPeriodo('')
      }
    }
  }

  // Salvar
  const handleSave = () => {
    if (isNew) {
      if (!medicaoInicio) {
        alert('Selecione a Medição Início.')
        return
      }
      
      if (tipo !== 'PRORROGACAO' && dataInicio && contrato?.orcamento) {
        const di = new Date(dataInicio)
        const cInicio = new Date(contrato.orcamento.dataInicio)
        const cTerm = new Date(contrato.orcamento.dataTermino)
        if (di < cInicio || di > cTerm) {
          alert('A Data Início gerada não está compreendida no período de vigência do contrato.')
          return
        }
      }
      
      const nova = tamService.criarTAM(
        contrato.id,
        tipo,
        medicaoInicio,
        dataInicio,
        observacao,
        inicioContrato,
        terminoContrato,
        periodo
      )
      if (itens.length > 0) {
        atualizarItensTAM(nova.id, itens)
      }
      setSaveMessage('TAM criada com sucesso!')
      navigate(`/contrato/${contrato.id}/tam/${nova.id}`, { state: { contrato, isNew: false, tamExistente: nova } })
    } else {
      tamService.atualizarTAM(tamExistente.id, {
        tipo,
        medicaoInicio,
        dataInicio,
        inicioContrato,
        terminoContrato,
        observacao,
        periodo,
      })
      tamService.atualizarItensTAM(tamExistente.id, itens)
      setHasChanges(false)
      setSaveMessage('Alterações salvas com sucesso!')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // Voltar com confirmação se houver alterações
  const handleBack = () => {
    if (hasChanges) {
      setShowExitConfirm(true)
    } else {
      navigate(`/contratos/${contratoId}`)
    }
  }

  if (!contrato) {
    return <div><p>Contrato não encontrado.</p></div>
  }

  return (
    <div>
      <ContratoInfoBar contrato={contrato} />
      <div style={{ padding: '16px 0' }}>
        <button className="back-button" onClick={handleBack}>
          ← Contrato {contrato.numero}
        </button>

        <h1 className="page-title">
          {isNew ? 'Nova TAM' : `TAM ${tamExistente?.numero || ''}`}
          {isNew && <span style={{ fontSize: '0.85rem', fontWeight: 400, marginLeft: 8, color: 'var(--text-secondary)' }}>(Nº automático: {proximoNumero})</span>}
        </h1>

        {saveMessage && (
          <div className="alert alert-success">{saveMessage}</div>
        )}

        {/* INFORMAÇÕES DA TAM */}
        <CollapsibleSection title="Informações da TAM" defaultOpen={true}>
          <div className="card">
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Número TAM</label>
                  <input className="form-control" value={proximoNumero || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de TAM</label>
                  <select
                    className="form-control"
                    value={tipo}
                    onChange={e => handleTipoChange(e.target.value)}
                  >
                    {TAM_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Período</label>
                  <input className="form-control" value={periodo || '-'} disabled />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Medição Início</label>
                  <select
                    className="form-control"
                    value={medicaoInicio}
                    onChange={e => handleMedicaoChange(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {medicoesContrato.map(m => (
                      <option key={m.numero} value={m.numero.toString()}>Medição {m.numero}</option>
                    ))}
                    {isNew && <option value="proxima">Próxima Medição ({proximaMedicaoNum})</option>}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Data Início</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataInicio}
                    disabled
                  />
                </div>
                {tipo === 'PRORROGACAO' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Início (Contrato)</label>
                      <input type="date" className="form-control" value={inicioContrato} onChange={e => { setInicioContrato(e.target.value); setHasChanges(true) }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Término (Contrato)</label>
                      <input type="date" className="form-control" value={terminoContrato} onChange={e => { setTerminoContrato(e.target.value); setHasChanges(true) }} />
                    </div>
                  </>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Observação</label>
                <input
                  className="form-control"
                  value={observacao}
                  onChange={e => { setObservacao(e.target.value); setHasChanges(true) }}
                  placeholder="Observações sobre esta TAM"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ITENS DA TAM — Tabela Configurável */}
        <CollapsibleSection title={`Itens da TAM — ${modifiedConfig?.label || tipo}`} defaultOpen={true}>
          {tipo === 'ANULACAO' && (
            <div style={{ padding: '0 16px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
              <strong>Modo de Anulação:</strong>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" name="modoAnulacao" value="medicao" checked={modoAnulacao === 'medicao'} onChange={() => { setModoAnulacao('medicao'); setHasChanges(true) }} />
                Por Medição
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="radio" name="modoAnulacao" value="periodo" checked={modoAnulacao === 'periodo'} onChange={() => { setModoAnulacao('periodo'); setHasChanges(true) }} />
                Por Período
              </label>
            </div>
          )}
          {modifiedConfig ? (
            <ConfigurableTable
              config={modifiedConfig}
              rows={itens}
              onRowChange={handleRowChange}
              onAddItem={null}
              selectOptions={selectOptions}
            />
          ) : (
            <div className="alert alert-warning">
              Tipo de TAM não reconhecido: {tipo}
            </div>
          )}
        </CollapsibleSection>

        {/* Ações */}
        <div className="form-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 {isNew ? 'Criar TAM' : 'Salvar Alterações'}
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
