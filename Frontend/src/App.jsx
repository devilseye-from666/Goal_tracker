// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Import components
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import Header from './components/common/Header.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import GoalList from './components/goals/GoalList.jsx';
import GoalDetail from './components/goals/GoalDetail.jsx';
import GoalForm from './components/goals/GoalForm.jsx';
import GoalProgress from './components/goals/GoalProgress.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <GoalList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/new" 
                element={
                  <ProtectedRoute>
                    <GoalForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/:id" 
                element={
                  <ProtectedRoute>
                    <GoalDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/:id/edit" 
                element={
                  <ProtectedRoute>
                    <GoalForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/:id/progress" 
                element={
                  <ProtectedRoute>
                    <GoalProgress />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/goals" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;
