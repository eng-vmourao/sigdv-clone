import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import ContratosList from './pages/ContratosList'
import ContratoDetalhe from './pages/ContratoDetalhe'
import TAMEditor from './pages/TAMEditor'
import MedicaoEditor from './pages/MedicaoEditor'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/contratos" replace />} />
          <Route path="/contratos" element={<ContratosList />} />
          <Route path="/contratos/:id" element={<ContratoDetalhe />} />
          <Route path="/contratos/:contratoId/tam/novo" element={<TAMEditor />} />
          <Route path="/contratos/:contratoId/tam/:tamId" element={<TAMEditor />} />
          <Route path="/contratos/:contratoId/medicao/novo" element={<MedicaoEditor />} />
          <Route path="/contratos/:contratoId/medicao/:medicaoId" element={<MedicaoEditor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
