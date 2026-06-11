import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Admin from './pages/Admin.jsx';
import Investigacion from './pages/Investigacion.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/investigacion" element={<Investigacion />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
