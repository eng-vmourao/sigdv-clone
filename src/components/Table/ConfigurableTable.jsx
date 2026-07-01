import { useState, useCallback, useMemo, useEffect } from 'react'
import { COLUMN_LABELS, COLUMN_TYPES, COLUMN_WIDTHS, ANULAR_OPTIONS } from '../../config/tamTypes'
import { formatByType, parseByType } from '../../utils/formatters'
import { validateRow } from '../../utils/validators'

const CellInput = ({ value, type, onChange, placeholder, style, error, rowIndex, field }) => {
  const [localVal, setLocalVal] = useState(() => {
    if (type === 'percent') return value ? (value * 100).toFixed(2) : ''
    return value ?? ''
  })

  // Sincroniza localVal com a prop value quando esta mudar externamente
  useEffect(() => {
    // Ignora atualizações se o valor digitado atualmente for parcial (ex: "-", ou terminando com ",")
    if (localVal === '-' || localVal === '-0' || localVal?.toString().endsWith(',')) {
      return;
    }

    if (type === 'percent') {
      const propVal = value ? (value * 100).toFixed(2) : ''
      const localNum = parseFloat(localVal?.toString().replace(',', '.'))
      const propNum = parseFloat(propVal.replace(',', '.'))
      if (localNum !== propNum && !(isNaN(localNum) && isNaN(propNum))) {
        setLocalVal(propVal)
      }
    } else {
      const localNum = parseFloat(localVal?.toString().replace(',', '.'))
      if (localNum !== value && !(isNaN(localNum) && (value === null || value === undefined || value === ''))) {
        setLocalVal(value ?? '')
      }
    }
  }, [value, type])

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
    
    // Se for apenas o símbolo "-" ou termina em ",", passamos 0 ou o valor anterior sem quebrar
    const isPartial = newVal === '-' || newVal === '-0' || newVal === '-,' || newVal.endsWith(',')
    onChange(isPartial ? 0 : parsed)
  }

  const handleBlur = () => {
    // Se ao sair do campo, estiver como "-", "-0", "-0," ou vazio, removemos
    const cleaned = localVal?.toString().trim()
    if (cleaned === '-' || cleaned === '-0' || cleaned === '-0,' || cleaned === '') {
      setLocalVal('')
      onChange(0)
    } else {
      // Formata normalmente no blur
      if (type === 'percent') {
        setLocalVal(value ? (value * 100).toFixed(2) : '')
      } else {
        setLocalVal(value ?? '')
      }
    }
  }

  const handleKeyDown = (e) => {
    const editables = Array.from(e.currentTarget.closest('tr').querySelectorAll('input, select'))
    const currentIndex = editables.indexOf(e.currentTarget)

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = document.querySelector(`[data-row="${rowIndex + 1}"][data-field="${field}"]`)
      if (next) {
        next.focus()
        if (typeof next.select === 'function') {
          next.select()
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = document.querySelector(`[data-row="${rowIndex - 1}"][data-field="${field}"]`)
      if (prev) {
        prev.focus()
        if (typeof prev.select === 'function') {
          prev.select()
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = editables[currentIndex + 1]
      if (next) {
        next.focus()
        if (typeof next.select === 'function') {
          next.select()
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = editables[currentIndex - 1]
      if (prev) {
        prev.focus()
        if (typeof prev.select === 'function') {
          prev.select()
        }
      }
    }
  }

  return (
    <>
      <input
        type="text"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={style}
        data-row={rowIndex}
        data-field={field}
      />
      {error && <div className={`alert-${error.type}`} style={{ fontSize: '0.65rem', padding: '2px 4px', marginTop: 2 }}>{error.message}</div>}
    </>
  )
}

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
              data-row={rowIndex}
              data-field={col}
              onKeyDown={e => {
                const editables = Array.from(e.currentTarget.closest('tr').querySelectorAll('input, select'))
                const currentIndex = editables.indexOf(e.currentTarget)

                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  const next = document.querySelector(`[data-row="${rowIndex + 1}"][data-field="${col}"]`)
                  if (next) next.focus()
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const prev = document.querySelector(`[data-row="${rowIndex - 1}"][data-field="${col}"]`)
                  if (prev) prev.focus()
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  const next = editables[currentIndex + 1]
                  if (next) next.focus()
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const prev = editables[currentIndex - 1]
                  if (prev) prev.focus()
                }
              }}
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
            rowIndex={rowIndex}
            field={col}
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
