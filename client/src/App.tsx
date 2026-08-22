import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import AppPage from './pages/AppPage';

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<SignInPage />} />

      {/* Protected routes — redirect to /signin if no token */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default App;
