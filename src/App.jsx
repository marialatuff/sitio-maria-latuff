import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Offer from './pages/Offer.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Contact from './pages/Contact.jsx';
import WorkTogether from './pages/WorkTogether.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="conoceme" element={<About />} />
        <Route path="mi-oferta" element={<Offer />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="proyectos/:slug" element={<ProjectDetail />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="trabajemos-juntos" element={<WorkTogether />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
