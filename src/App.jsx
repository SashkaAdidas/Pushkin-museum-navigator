import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import MapPage from './pages/MapPage.jsx';
import HallsPage from './pages/HallsPage.jsx';
import HallPage from './pages/HallPage.jsx';
import RoutesPage from './pages/RoutesPage.jsx';
import RouteDetailPage from './pages/RouteDetailPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/halls" element={<HallsPage />} />
        <Route path="/halls/:hallId" element={<HallPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/routes/:routeId" element={<RouteDetailPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
