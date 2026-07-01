import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContrato } from '../services/contratoService'
import { getTAM, criarTAM, atualizarItensTAM, adicionarNovoItem, getProximoNumeroTAM } from '../services/tamService'
import { getTAMConfig, TAM_TYPE_OPTIONS } from '../config/tamTypes'
import ConfigurableTable from '../components/Table/ConfigurableTable'
import ContratoInfoBar from '../components/Contrato/ContratoInfoBar'
import BackButton from '../components/UI/BackButton'
import CollapsibleSection from '../components/UI/CollapsibleSection'
import NewItemModal from '../components/TAM/NewItemModal'
import ConfirmDialog from '../components/UI/ConfirmDialog'
import { formatDate } from '../utils/formatters'

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
  const [dataInicio, setDataInicio] = useState('')
  const [dataTermino, setDataTermino] = useState('')
  const [observacao, setObservacao] = useState('')
  const [showNewItemModal, setShowNewItemModal] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Carrega TAM existente
  const tamExistente = useMemo(() => {
    if (isNew) return null
    const tam = getTAM(Number(tamId))
    if (tam) {
      setTipo(tam.tipo)
      setDataInicio(tam.dataInicio)
      setDataTermino(tam.dataTermino)
      setObservacao(tam.observacao || '')
    }
    return tam
  }, [tamId, isNew])

  // Estado dos itens
  const [itens, setItens] = useState(() => {
    if (tamExistente?.itens) return [...tamExistente.itens]
    return []
  })

  // Próximo número (SIGDV-09)
  const proximoNumero = useMemo(() => {
    if (!isNew) return tamExistente?.numero
    return getProximoNumeroTAM(Number(contratoId))
  }, [contratoId, isNew, tamExistente])

  // Config do tipo selecionado
  const config = useMemo(() => getTAMConfig(tipo), [tipo])

  // Handler de alteração de tipo
  const handleTipoChange = (novoTipo) => {
    setTipo(novoTipo)
    // Se é nova TAM, reinicializa itens zerados (SIGDV-06)
    if (isNew) {
      setItens([])
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

  // Handler de novo item (SIGDV-10)
  const handleAddItem = useCallback((novoItem) => {
    const baseItem = {
      ...novoItem,
      origemTAM: true,
    }

    // Adiciona campos zerados conforme tipo
    switch (tipo) {
      case 'PRORROGACAO':
      case 'PRORROGACAO_EXCEPCIONALIDADE':
        baseItem.variacaoQtd = 0
        baseItem.descUnitPerc = 0
        baseItem.descUnitValor = 0
        baseItem.reajUnitPerc = 0
        baseItem.reajUnitValor = 0
        break
      case 'ACRESCIMO':
        baseItem.qtdAcrescida = 0
        break
      case 'SUPRESSAO':
        baseItem.qtdSuprimida = 0
        break
      default:
        break
    }

    setItens(prev => [...prev, baseItem])
    setHasChanges(true)
  }, [tipo])

  // Salvar
  const handleSave = () => {
    if (isNew) {
      if (!dataInicio || !dataTermino) {
        alert('Datas de início e término são obrigatórias.')
        return
      }
      const novaTAM = criarTAM(Number(contratoId), tipo, dataInicio, dataTermino, observacao)
      if (itens.length > 0) {
        atualizarItensTAM(novaTAM.id, itens)
      }
      setSaveMessage('TAM criada com sucesso!')
      setTimeout(() => navigate(`/contratos/${contratoId}`), 1000)
    } else {
      atualizarItensTAM(Number(tamId), itens)
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
                    disabled={!isNew}
                  >
                    {TAM_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Período</label>
                  <input className="form-control" value={tamExistente?.periodo || '-'} disabled />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data Início (TAM)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataInicio}
                    onChange={e => { setDataInicio(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data Término (TAM)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dataTermino}
                    onChange={e => { setDataTermino(e.target.value); setHasChanges(true) }}
                    disabled={!isNew}
                  />
                </div>
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
        <CollapsibleSection title={`Itens da TAM — ${config?.label || tipo}`} defaultOpen={true}>
          {config ? (
            <ConfigurableTable
              config={config}
              rows={itens}
              onRowChange={handleRowChange}
              onAddItem={config.allowNewItem ? () => setShowNewItemModal(true) : null}
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

      {/* Modal de novo item (SIGDV-10) */}
      <NewItemModal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        onAdd={handleAddItem}
        tamTipo={tipo}
      />

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
