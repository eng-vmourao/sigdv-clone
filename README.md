# SIGDV Clone

Sistema Integrado de Gestão de Desenvolvimento Viário — Clone funcional.

## Tecnologias

- **React 19** + Vite
- **React Router DOM** v7
- Vanilla CSS (Design System customizado)
- Mock data (sem backend)

## Funcionalidades

### Melhorias Implementadas (SIGDV-01 a SIGDV-10)

| Código | Melhoria | Status |
|--------|----------|--------|
| SIGDV-01 | Filtro por Lei Aplicável (8.666/1993, 14.133/2021) | ✅ |
| SIGDV-02 | Resumo financeiro centralizado (única fonte de verdade) | ✅ |
| SIGDV-03 | Quantidades com 4 casas decimais | ✅ |
| SIGDV-04 | 7 tipos de TAM (Prorrogação, Excepcionalidade, Acréscimo, Supressão, Anulação, Reajuste, Desconto) | ✅ |
| SIGDV-05 | Tabela Configurável por tipo de TAM | ✅ |
| SIGDV-06 | Nova TAM com quantidades zeradas | ✅ |
| SIGDV-07 | Recálculo encadeado ao excluir medição | ✅ |
| SIGDV-08 | Botão Voltar padronizado | ✅ |
| SIGDV-09 | Numeração automática de TAM | ✅ |
| SIGDV-10 | Inclusão de novo item via TAM | ✅ |

### Dados Mockados

- 22 contratos com dados realistas
- Medições cadastradas por contrato
- TAMs variadas (todos os 7 tipos)
- Itens de orçamento detalhados

## Como executar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Estrutura

```
src/
├── config/        # tamTypes.js — configuração declarativa dos 7 tipos
├── data/          # Mock data (contratos, itens, TAMs, medições)
├── services/      # Lógica de negócio (CRUD, cálculos)
├── utils/         # Formatadores BR, validadores
├── hooks/         # Custom hooks
├── components/    # Componentes reutilizáveis
│   ├── Layout/    # Sidebar, Header, Layout
│   ├── Table/     # ConfigurableTable
│   ├── TAM/       # NewItemModal
│   ├── Contrato/  # ContratoInfoBar, LeiAplicavelSelect
│   └── UI/        # CollapsibleSection, BackButton, ConfirmDialog
└── pages/         # Páginas (ContratosList, ContratoDetalhe, TAMEditor, MedicaoEditor, Dashboard)
```

## Licença

Uso interno — DER/SP.
