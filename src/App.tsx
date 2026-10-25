import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { ThemeProvider } from './hooks/useTheme'
import { Home } from './routes/Home'

export function App() {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  )
}
