import { useNavigate } from 'react-router-dom'

/**
 * Botão Voltar padronizado (SIGDV-08)
 * Volta para a rota de origem preservando contexto
 */
export default function BackButton({ to, label = 'Contratos' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button className="back-button" onClick={handleClick}>
      ← {label}
    </button>
  )
}
