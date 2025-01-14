import React from 'react';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App: React.FC = () => {
  return (
    <div>
      <ProtectedRoute>
      <MainLayout/>
      </ProtectedRoute>
    </div>
  );
};

export default App;