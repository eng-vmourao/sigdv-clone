import { formatCurrency } from '../../utils/formatters'

/**
 * Faixa de informações do contrato (como no SIGDV original)
 */
export default function ContratoInfoBar({ contrato }) {
  if (!contrato) return null

  return (
    <div className="info-bar">
      <div className="info-bar-item">
        <span className="info-bar-label">CONTRATO:</span>
        <span className="info-bar-value">{contrato.numero}</span>
      </div>
      <div className="info-bar-item">
        <span className="info-bar-label">CONTRATADA:</span>
        <span className="info-bar-value">{contrato.contratada}</span>
      </div>
      <div className="info-bar-item">
        <span className="info-bar-label">REGIONAL:</span>
        <span className="info-bar-value">{contrato.regional}</span>
      </div>
      <div className="info-bar-item">
        <span className="info-bar-label">OBJETO RESUMIDO:</span>
        <span className="info-bar-value">{contrato.objetoResumido}</span>
      </div>
    </div>
  )
}
