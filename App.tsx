import React from 'react';
    import '@radix-ui/themes/styles.css';
    import { Theme } from '@radix-ui/themes';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

    import Login from './src/pages/Login';
    import Register from './src/pages/Register';
    import TenantDashboard from './src/pages/tenant/TenantDashboard';
    import MyRequests from './src/pages/tenant/MyRequests';
    import RequestDetails from './src/pages/tenant/RequestDetails';
    import RequestHistory from './src/pages/tenant/RequestHistory';
    import MaintenanceDashboard from './src/pages/maintenance/MaintenanceDashboard';
    import AllRequests from './src/pages/maintenance/AllRequests';
    import MaintenanceRequestDetails from './src/pages/maintenance/MaintenanceRequestDetails';
    import NotFound from './src/pages/NotFound';

    const App: React.FC = () => {
      return (
        <Theme appearance="light" radius="large" scaling="100%">
          <Router>
            <main className="min-h-screen font-sans selection:bg-slate-900 selection:text-white">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Tenant Routes */}
                <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                <Route path="/tenant/requests" element={<MyRequests />} />
                <Route path="/tenant/requests/:id" element={<RequestDetails />} />
                <Route path="/tenant/history" element={<RequestHistory />} />
                
                {/* Maintenance Routes */}
                <Route path="/maintenance/dashboard" element={<MaintenanceDashboard />} />
                <Route path="/maintenance/all-requests" element={<AllRequests />} />
                <Route path="/maintenance/requests/:id" element={<MaintenanceRequestDetails />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </main>
          </Router>
        </Theme>
      );
    }

    export default App;