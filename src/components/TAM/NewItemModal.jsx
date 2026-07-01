/**
 * Modal para cadastrar novo item na TAM (SIGDV-10)
 * Permitido em Prorrogação, Acréscimo e Supressão
 */
import { useState } from 'react'

export default function NewItemModal({ isOpen, onClose, onAdd, tamTipo }) {
  const [formData, setFormData] = useState({
    codigoItem: '',
    descricao: '',
    unidade: '',
    qtdVigente: 0,
    precoUnitVigente: 0,
    justificativa: '',
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.codigoItem || !formData.descricao) {
      alert('Cód. do Item e Descrição são obrigatórios.')
      return
    }
    onAdd({
      ...formData,
      qtdVigente: parseFloat(String(formData.qtdVigente).replace(',', '.')) || 0,
      precoUnitVigente: parseFloat(String(formData.precoUnitVigente).replace(',', '.')) || 0,
      origemTAM: true,
    })
    setFormData({ codigoItem: '', descricao: '', unidade: '', qtdVigente: 0, precoUnitVigente: 0, justificativa: '' })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Cadastrar Novo Item na TAM</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              ℹ️ Este item será incluído por TAM e estará vinculado a este termo. Aparecerá nas medições abrangidas.
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cód. do Item *</label>
                <input className="form-control" type="text" required value={formData.codigoItem}
                  onChange={e => setFormData({ ...formData, codigoItem: e.target.value })}
                  placeholder="Ex: 2.1" />
              </div>
              <div className="form-group">
                <label className="form-label">Unidade</label>
                <input className="form-control" type="text" value={formData.unidade}
                  onChange={e => setFormData({ ...formData, unidade: e.target.value })}
                  placeholder="Ex: M2, KG, UN" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição *</label>
              <input className="form-control" type="text" required value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do serviço ou material" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input className="form-control" type="text" value={formData.qtdVigente}
                  onChange={e => setFormData({ ...formData, qtdVigente: e.target.value })}
                  placeholder="0,0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Preço Unit. (R$)</label>
                <input className="form-control" type="text" value={formData.precoUnitVigente}
                  onChange={e => setFormData({ ...formData, precoUnitVigente: e.target.value })}
                  placeholder="0,00" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Justificativa</label>
              <input className="form-control" type="text" value={formData.justificativa}
                onChange={e => setFormData({ ...formData, justificativa: e.target.value })}
                placeholder="Justificativa para inclusão do item" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Adicionar Item</button>
          </div>
        </form>
      </div>
    </div>
  )
}
