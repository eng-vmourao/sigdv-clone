import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import contratos from '../data/contratos'
import tams from '../data/tams'
import medicoes from '../data/medicoes'
import { calcularResumoContrato } from '../services/calculoService'
import { formatCurrency } from '../utils/formatters'

/**
 * Dashboard com resumo geral do sistema
 */
export default function Dashboard() {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const totalContratos = contratos.length
    const contratosAtivos = contratos.filter(c => c.status === 'Ativo').length
    const contratosEncerrados = contratos.filter(c => c.status === 'Encerrado').length

    let totalTams = 0
    let totalMedicoes = 0
    let valorTotalContratado = 0
    let valorTotalExecutado = 0

    contratos.forEach(c => {
      const tamsList = tams[c.id] || []
      const medicoesList = medicoes[c.id] || []
      totalTams += tamsList.length
      totalMedicoes += medicoesList.length
      valorTotalContratado += c.valorInicial
      valorTotalExecutado += medicoesList.reduce((s, m) => s + (m.medicaoR$ || 0) + (m.reajusteR$ || 0) - (m.descontoR$ || 0), 0)
    })

    return {
      totalContratos,
      contratosAtivos,
      contratosEncerrados,
      totalTams,
      totalMedicoes,
      valorTotalContratado,
      valorTotalExecutado,
      saldo: valorTotalContratado - valorTotalExecutado,
    }
  }, [])

  // Top 5 contratos por valor
  const topContratos = useMemo(() => {
    return [...contratos]
      .sort((a, b) => b.valorInicial - a.valorInicial)
      .slice(0, 5)
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="resumo-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <div className="resumo-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div className="resumo-card-label">Total Contratos</div>
          <div className="resumo-card-value">{stats.totalContratos}</div>
        </div>
        <div className="resumo-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="resumo-card-label">Contratos Ativos</div>
          <div className="resumo-card-value positive">{stats.contratosAtivos}</div>
        </div>
        <div className="resumo-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="resumo-card-label">Contratos Encerrados</div>
          <div className="resumo-card-value">{stats.contratosEncerrados}</div>
        </div>
        <div className="resumo-card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div className="resumo-card-label">Total TAMs</div>
          <div className="resumo-card-value">{stats.totalTams}</div>
        </div>
        <div className="resumo-card" style={{ borderLeft: '4px solid #8e44ad' }}>
          <div className="resumo-card-label">Total Medições</div>
          <div className="resumo-card-value">{stats.totalMedicoes}</div>
        </div>
      </div>

      {/* Cards financeiros */}
      <div className="resumo-grid" style={{ marginTop: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="resumo-card">
          <div className="resumo-card-label">Valor Total Contratado</div>
          <div className="resumo-card-value" style={{ fontSize: '1.3rem' }}>{formatCurrency(stats.valorTotalContratado)}</div>
        </div>
        <div className="resumo-card">
          <div className="resumo-card-label">Total Executado</div>
          <div className="resumo-card-value" style={{ fontSize: '1.3rem' }}>{formatCurrency(stats.valorTotalExecutado)}</div>
        </div>
        <div className="resumo-card">
          <div className="resumo-card-label">Saldo Global</div>
          <div className={`resumo-card-value ${stats.saldo >= 0 ? 'positive' : 'negative'}`} style={{ fontSize: '1.3rem' }}>
            {formatCurrency(stats.saldo)}
          </div>
        </div>
      </div>

      {/* Top 5 contratos */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--section-header-color)', marginBottom: 12 }}>
          TOP 5 CONTRATOS POR VALOR
        </h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nº Contrato</th>
                <th>Contratada</th>
                <th>Objeto</th>
                <th style={{ textAlign: 'right' }}>Valor Inicial</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topContratos.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/contratos/${c.id}`)}>
                  <td><strong>{c.numero}</strong></td>
                  <td>{c.contratada}</td>
                  <td>{c.objetoResumido}</td>
                  <td className="cell-currency">{formatCurrency(c.valorInicial)}</td>
                  <td>
                    <span className={c.status === 'Ativo' ? 'status-ok' : 'status-zerado'}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
