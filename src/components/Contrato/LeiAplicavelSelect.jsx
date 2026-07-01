import { LEI_APLICAVEL_OPTIONS } from '../../data/contratos'

/**
 * Dropdown de Lei Aplicável (SIGDV-01)
 */
export default function LeiAplicavelSelect({ value, onChange, disabled = false }) {
  return (
    <select
      className="form-control"
      value={value || 'NENHUM'}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      {LEI_APLICAVEL_OPTIONS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
