import { Header } from './components/Header'
import { ThemeProvider } from './hooks/useTheme'

export function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  )
}
