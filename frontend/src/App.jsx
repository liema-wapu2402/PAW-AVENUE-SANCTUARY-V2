import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import Home from './pages/Home';
import About from './pages/About';
import Vets from './pages/Vets';
import Services from './pages/Services';
import Adopt from './pages/Adopt';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './admin/AdminLogin';
import RequireAdmin from './admin/RequireAdmin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ResourcePage from './admin/ResourcePage';

/**
 * Whenever the website is opened (run, refreshed, or visited by a deep link) the visitor lands on Home.
 * Admin pages are left alone so staff can reload where they are.
 */
function StartAtHome() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (pathname !== '/' && !pathname.startsWith('/admin')) navigate('/', { replace: true });
    window.scrollTo({ top: 0 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function App() {
  return (
    <>
      <StartAtHome />
      <Routes>
        {/* Visitor panel - open to everyone, no login */}
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="veterinarians" element={<Vets />} />
          <Route path="services" element={<Services />} />
          <Route path="adopt" element={<Adopt />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin panel - sign-in required */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path=":resource" element={<ResourcePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
