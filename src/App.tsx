import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { ThemeProvider } from './hooks/useTheme'
import { CountryDetail } from './routes/CountryDetail'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

export function App() {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="*" element={<NotFound generic />} />
      </Routes>
    </ThemeProvider>
  )
}
