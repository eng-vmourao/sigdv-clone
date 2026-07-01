import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarContratos } from '../services/contratoService'
import { LEI_APLICAVEL_OPTIONS } from '../data/contratos'
import { formatCurrency, formatDate } from '../utils/formatters'

/**
 * Lista de contratos com filtros (SIGDV-01: filtro por Lei Aplicável)
 */
export default function ContratosList() {
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState({
    leiAplicavel: 'TODOS',
    status: 'TODOS',
    busca: '',
  })

  const contratos = useMemo(() => listarContratos(filtros), [filtros])

  const leiLabel = (lei) => {
    const opt = LEI_APLICAVEL_OPTIONS.find(o => o.value === lei)
    return opt ? opt.label : lei
  }

  return (
    <div>
      <h1 className="page-title">Contratos</h1>

      {/* Barra de filtros */}
      <div className="filter-bar">
        <div>
          <label>Lei Aplicável</label>
          <select value={filtros.leiAplicavel} onChange={e => setFiltros({ ...filtros, leiAplicavel: e.target.value })}>
            <option value="TODOS">Todos</option>
            {LEI_APLICAVEL_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={filtros.status} onChange={e => setFiltros({ ...filtros, status: e.target.value })}>
            <option value="TODOS">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Nº contrato, contratada ou objeto..."
            value={filtros.busca}
            onChange={e => setFiltros({ ...filtros, busca: e.target.value })}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Tabela de contratos */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº Contrato</th>
              <th>Contratada</th>
              <th>Regional</th>
              <th>Objeto Resumido</th>
              <th>Valor Inicial</th>
              <th>Lei Aplicável</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {contratos.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  Nenhum contrato encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              contratos.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/contratos/${c.id}`)}>
                  <td><strong>{c.numero}</strong></td>
                  <td>{c.contratada}</td>
                  <td>{c.regional}</td>
                  <td>{c.objetoResumido}</td>
                  <td className="cell-currency">{formatCurrency(c.valorInicial)}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: c.leiAplicavel === 'NENHUM' ? '#f0f0f0' : c.leiAplicavel === '8666_1993' ? '#e8f4fd' : '#e8f8f0',
                      color: c.leiAplicavel === 'NENHUM' ? '#666' : c.leiAplicavel === '8666_1993' ? '#2980b9' : '#27ae60',
                    }}>
                      {leiLabel(c.leiAplicavel)}
                    </span>
                  </td>
                  <td>
                    <span className={c.status === 'Ativo' ? 'status-ok' : 'status-zerado'}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={e => { e.stopPropagation(); navigate(`/contratos/${c.id}`) }}>
                      Abrir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-info" style={{ marginTop: 8 }}>
        Mostrando {contratos.length} contrato(s)
      </div>
    </div>
  )
}
