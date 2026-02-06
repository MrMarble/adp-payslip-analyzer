# Agent Guidelines for ADP Payslip Analyzer

Client-side ADP payslip analyzer built with React, TypeScript, Vite, and Vitest.

## Build/Test Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run demo             # Start dev server with demo data

# Build
npm run build            # Production build to dist/
npm run build:demo       # Production build with demo data

# Testing
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
npx vitest run <path>    # Run a single test file
```

## Demo Mode

Demo mode loads mock payslip data without requiring PDF files. Useful for showcasing the UI without exposing real payslip data.

### How it works
- Uses `VITE_DEMO` environment variable (set in `.env.demo`)
- Mock data lives in `src/demo/mockData.ts`
- App.tsx checks `import.meta.env.VITE_DEMO` and loads demo data on mount
- **Demo code is tree-shaken out of production builds** (dead code elimination)

### Implementation pattern in App.tsx:
```tsx
useEffect(() => {
  if (import.meta.env.VITE_DEMO) {
    import('./demo/mockData').then(({ demoPayslips }) => {
      setPayslips(demoPayslips)
    })
  }
}, [])
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled - always define types explicitly
- Use `type` for type imports: `import type { Payslip } from './types'`
- Prefer `interface` for object shapes, `type` for unions/complex types
- Nullable types: use `T | null` instead of optional `T?` for missing values
- Target: ES2022, Module: ESNext

### Naming Conventions
- Components: PascalCase (e.g., `PayslipTable.tsx`)
- Functions/variables: camelCase (e.g., `parsePayslip`, `totalEarnings`)
- Constants: UPPER_SNAKE_CASE for true constants (e.g., `KNOWN_CONCEPTS`)
- Types/Interfaces: PascalCase (e.g., `PayslipLineItem`)
- Props interfaces: `{ComponentName}Props` (e.g., `PayslipTableProps`)

### Formatting
- No semicolons
- Single quotes for strings
- No trailing commas in multi-line objects
- 2-space indentation
- JSDoc comments for exported functions

### Imports
- Group: external libs, internal modules, types
- Use path aliases from project root (e.g., `../types`)
- Default exports for React components
- Named exports for utilities

### React Patterns
- Functional components with hooks
- Props destructured in function parameters
- State initialization with proper types: `useState<Payslip[]>([])`
- Error handling with try/catch and type guards:
  ```ts
  err instanceof Error ? err.message : 'Failed to parse'
  ```

### Error Handling
- Always check for null/undefined before accessing properties
- Use early returns for guard clauses
- Throw descriptive errors for parsing failures
- Handle async errors with try/catch in event handlers

### Styling
- TailwindCSS 4 with DaisyUI components
- Utility classes over custom CSS
- Spanish locale for currency: `toLocaleString('es-ES')`
- Color conventions: `text-success` (green), `text-error` (red), `text-primary`

### Testing
- Tests in `tests/` directory
- Vitest with globals enabled
- Use fixtures in `tests/fixtures/` (PDFs not committed)
- Async tests use `async/await`
- Descriptive assertion messages

### Project Structure
```
src/
  components/     # React components
  types.ts        # Shared interfaces
  concepts.ts     # Known payslip concept definitions
  parser.ts       # PDF text extraction
  payslip-parser.ts  # Main parsing logic
  App.tsx         # Root component
  main.tsx        # Entry point
```

### Dependencies
- React 19, TypeScript 5.9
- PDF.js for PDF parsing (use legacy build)
- Nivo for charts (@nivo/line, @nivo/sankey)

### Notes
- This is a client-side only app - no server code
- Payslip data contains PII - never log or expose raw data
- Test fixtures are excluded from git (see .gitignore)

## PDF Format Reference

### Structure
- 2 pages per payslip
- Page 1: Main payslip with earnings/deductions
- Page 2: Employer contributions breakdown

### Header Fields
- Company, employee name & address
- FECHA DE ABONO (payment date)
- PERIODO LIQUIDACION (settlement period - month)
- N. EMPLEADO (employee number), N.I.F. (tax ID)
- FECHA INGRESO / FECHA INIC. ANTIG. (hire date / seniority)
- CATEGORIA / GRUPO A (category/group)

### Earnings (DEVENGOS) - codes 3xx-7xx
| Code | Concept | Description |
|------|---------|-------------|
| 321 | SALARIO BASE | Base salary |
| 413 | Q BONUS | Quarterly bonus |
| 438 | BONUS | Variable bonus |
| 637 | SEGURO ME | Medical insurance (benefit) |
| 638 | AP.PENSIO | Pension contribution (benefit) |
| 702 | IN KIND M | In-kind medical benefit |
| 711 | DENTAL IN | Dental insurance |
| 715 | T.RESTAU | Restaurant vouchers |
| 716 | STOCK PP | Stock purchase plan benefit |

### Deductions (DEDUCCIONES) - codes 10xx-15xx
| Code | Concept | Description |
|------|---------|-------------|
| 1005 | SEGURIDAD SOCIAL | Social Security (4.7%) |
| 1008 | DESEMPLEO | Unemployment (1.55%) |
| 1009 | FORMACION PROFES | Professional training (0.1%) |
| 1010 | SEG.SOCIAL MEI | Social Security MEI (0.13%) |
| 1012 | COTIZACION SOLIDARIA | Solidarity contribution (0.15%) |
| 1051 | IMP A CUENTA RENTA | Income tax (IRPF) |
| 1057 | IMP A CTA SEG.MEDICO | Tax on medical insurance |
| 1075 | IMP A CTA SEG.DENTAL | Tax on dental insurance |
| 1085 | IMP A CTA STOCK P.P | Tax on stock benefit |
| 1542 | ESPP1 | Employee stock purchase plan |
| 1550 | DEDUC.PLAN PENSIONES | Pension plan deduction |
