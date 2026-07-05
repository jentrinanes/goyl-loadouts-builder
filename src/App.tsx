import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardPage from './pages/DashboardPage';
import BuilderPage from './pages/BuilderPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<DashboardPage />} />
          <Route path="/dashboard"   element={<DashboardPage />} />
          <Route path="/builder"     element={<BuilderPage />} />
          <Route path="/builder/:id" element={<BuilderPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
