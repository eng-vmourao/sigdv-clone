import { useState, useCallback, useMemo } from 'react'
import { COLUMN_LABELS, COLUMN_TYPES, COLUMN_WIDTHS, ANULAR_OPTIONS } from '../../config/tamTypes'
import { formatByType, parseByType } from '../../utils/formatters'
import { validateRow } from '../../utils/validators'

/**
 * Tabela genérica configurável — renderiza colunas baseado na configuração do tipo de TAM
 * Suporta: colunas protegidas, editáveis, calculadas, totais, validações
 */
export default function ConfigurableTable({ config, rows, onRowChange, onAddItem }) {
  const [search, setSearch] = useState('')

  // Filtra linhas pela busca
  const filteredRows = useMemo(() => {
    if (!search) return rows
    const s = search.toLowerCase()
    return rows.filter(row =>
      (row.codigoItem || '').toLowerCase().includes(s) ||
      (row.descricao || '').toLowerCase().includes(s)
    )
  }, [rows, search])

  // Calcula linhas com fórmulas aplicadas
  const calculatedRows = useMemo(() => {
    return filteredRows.map(row => config.calcRow(row))
  }, [filteredRows, config])

  // Calcula totais
  const totals = useMemo(() => {
    const result = {}
    if (config.totals.itemCount) {
      result.itemCount = `${calculatedRows.length} itens`
    }
    for (const [col, type] of Object.entries(config.totals)) {
      if (col === 'itemCount') continue
      if (type === 'sum') {
        result[col] = calculatedRows.reduce((sum, row) => sum + (row[col] || 0), 0)
      }
    }
    return result
  }, [calculatedRows, config.totals])

  // Handler para alteração de célula
  const handleCellChange = useCallback((rowIndex, field, rawValue) => {
    const type = COLUMN_TYPES[field]
    const value = parseByType(rawValue, type)
    const originalRow = rows[rowIndex]
    const updatedRow = { ...originalRow, [field]: value }
    // Recalcula a linha
    const recalculated = config.calcRow(updatedRow)
    onRowChange(rowIndex, recalculated)
  }, [rows, config, onRowChange])

  // Verifica se uma coluna é protegida, calculada ou editável
  const getColumnState = useCallback((col) => {
    if (config.editable.includes(col)) return 'editable'
    if (config.calculated.includes(col)) return 'calculated'
    if (config.protected.includes(col)) return 'protected'
    return 'protected'
  }, [config])

const CellInput = ({ value, type, onChange, placeholder, style, error }) => {
  const [localVal, setLocalVal] = useState(() => {
    if (type === 'percent') return value ? (value * 100).toFixed(2) : ''
    return value ?? ''
  })

  // Sincroniza apenas quando o valor propaga de fora e é diferente
  if (type !== 'percent' && typeof value === 'number' && parseFloat(localVal?.toString().replace(',','.')) !== value && localVal !== '-' && !localVal?.toString().endsWith(',')) {
    // Para não sobrescrever o que o usuário digita (ex: '-', '-0,', etc), não atualizamos se localVal já reflete o número
    // Mas se o valor mudou de verdade externamente, atualizamos:
  }

  const handleChange = (e) => {
    const newVal = e.target.value
    setLocalVal(newVal)
    
    let parsed
    if (type === 'percent') {
      const pct = parseFloat(newVal.replace(',', '.'))
      parsed = isNaN(pct) ? 0 : pct / 100
    } else {
      parsed = parseByType(newVal, type)
    }
    
    // Se newVal for "-", "-", ou terminar em "," a gente passa 0 pro parent, mas mantém newVal local
    // Assim o cálculo não quebra com strings
    const isPartial = newVal === '-' || newVal === '-,' || newVal.endsWith(',')
    onChange(isPartial ? 0 : parsed)
  }

  const handleBlur = () => {
    // Formata o localVal no blur
    if (type === 'percent') {
      setLocalVal(value ? (value * 100).toFixed(2) : '')
    } else {
      setLocalVal(value ?? '')
    }
  }

  return (
    <>
      <input
        type="text"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={style}
      />
      {error && <div className={`alert-${error.type}`} style={{ fontSize: '0.65rem', padding: '2px 4px', marginTop: 2 }}>{error.message}</div>}
    </>
  )
}

  // Renderiza célula baseado no estado
  const renderCell = (row, col, rowIndex) => {
    const state = getColumnState(col)
    const type = COLUMN_TYPES[col]
    const value = row[col]
    const validations = config.validations || []
    const rowValidation = validateRow(row, validations)
    const cellError = rowValidation.find(v => v.field === col)

    const cellClass = [
      type === 'currency' || type === 'quantity' || type === 'percent' ? 'cell-currency' : 'cell-text',
      `cell-${state}`,
      cellError?.type === 'error' ? 'cell-error' : '',
      cellError?.type === 'warning' ? 'cell-warning' : '',
    ].filter(Boolean).join(' ')

    if (state === 'editable') {
      if (type === 'select') {
        return (
          <td key={col} className={cellClass} style={{ minWidth: COLUMN_WIDTHS[col] }}>
            <select
              value={value || ''}
              onChange={e => handleCellChange(rowIndex, col, e.target.value)}
            >
              <option value="">Selecione</option>
              {ANULAR_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {cellError && <div className={`alert-${cellError.type}`} style={{ fontSize: '0.65rem', padding: '2px 4px', marginTop: 2 }}>{cellError.message}</div>}
          </td>
        )
      }

      return (
        <td key={col} className={cellClass} style={{ minWidth: COLUMN_WIDTHS[col] }}>
          <CellInput 
            type={type} 
            value={value} 
            onChange={(val) => handleCellChange(rowIndex, col, val)} 
            placeholder={type === 'percent' ? '0,00' : '0'} 
            style={{ textAlign: type === 'currency' || type === 'quantity' || type === 'percent' ? 'right' : 'left' }}
            error={cellError}
          />
        </td>
      )
    }

    // Protegido ou calculado — somente exibição
    return (
      <td
        key={col}
        className={cellClass}
        style={{ minWidth: COLUMN_WIDTHS[col] }}
        title={cellError?.message}
      >
        {formatByType(value, type)}
      </td>
    )
  }

  return (
    <div>
      {/* Controles da tabela */}
      <div className="table-controls">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {config.allowNewItem && onAddItem && (
            <button className="btn btn-outline btn-sm" onClick={onAddItem}>
              + Novo Item
            </button>
          )}
        </div>
        <div className="table-search">
          <label style={{ marginRight: 4, fontSize: '0.75rem' }}>Pesquisar:</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar item..."
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map(col => (
                <th
                  key={col}
                  style={{
                    minWidth: COLUMN_WIDTHS[col],
                    textAlign: ['currency', 'quantity', 'percent'].includes(COLUMN_TYPES[col]) ? 'right' : 'left',
                  }}
                >
                  {COLUMN_LABELS[col]}
                  {getColumnState(col) === 'protected' && ' 🔒'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calculatedRows.length === 0 ? (
              <tr>
                <td colSpan={config.columns.length} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                  Nenhum item encontrado
                </td>
              </tr>
            ) : (
              calculatedRows.map((row, idx) => (
                <tr key={row.codigoItem || idx}>
                  {config.columns.map(col => renderCell(row, col, idx))}
                </tr>
              ))
            )}
          </tbody>
          {/* Totais */}
          {calculatedRows.length > 0 && (
            <tfoot>
              <tr className="totals-row">
                {config.columns.map((col, idx) => {
                  if (idx === 0 && totals.itemCount) {
                    return <td key={col}><strong>{totals.itemCount}</strong></td>
                  }
                  if (totals[col] !== undefined && col !== 'itemCount') {
                    return (
                      <td key={col} className="cell-currency">
                        <strong>{formatByType(totals[col], COLUMN_TYPES[col])}</strong>
                      </td>
                    )
                  }
                  return <td key={col}></td>
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Info de registros */}
      <div className="table-info" style={{ marginTop: 8 }}>
        Mostrando de 1 até {calculatedRows.length} de {calculatedRows.length} registros
        {search && ` (filtrado de ${rows.length} registros totais)`}
      </div>
    </div>
  )
}
