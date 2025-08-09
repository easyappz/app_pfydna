import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ErrorBoundary from './ErrorBoundary';

// Layout & routing
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import UploadPhotosPage from './pages/Photos/UploadPhotosPage';
import RatePhotosPage from './pages/Photos/RatePhotosPage';
import PhotoStatsPage from './pages/Photos/PhotoStatsPage';
import ProfilePage from './pages/User/ProfilePage';
import FilterSettingsPage from './pages/User/FilterSettingsPage';

import './App.css';

dayjs.locale('ru');

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: { colorPrimary: '#1677ff' },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/rate" replace />} />

                {/* Public pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />

                {/* Private area */}
                <Route element={<ProtectedRoute />}> 
                  <Route element={<AppLayout />}> 
                    <Route path="/rate" element={<RatePhotosPage />} />
                    <Route path="/upload" element={<UploadPhotosPage />} />
                    <Route path="/stats" element={<PhotoStatsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/filters" element={<FilterSettingsPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
