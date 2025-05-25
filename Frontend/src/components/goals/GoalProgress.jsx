/* eslint-disable no-unused-vars */
// src/components/goals/GoalProgress.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, Paper, LinearProgress,
  TextField, FormControl, InputLabel, Input, InputAdornment,
  FormControlLabel, Switch, Alert
} from '@mui/material';
import { API_BASE_URL } from '../../api/config'; 

const GoalProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [incrementMode, setIncrementMode] = useState(true);
  const [progressValue, setProgressValue] = useState('');

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/goals/${id}`,{ withCredentials: true });
        setGoal(response.data);
        setProgressValue(incrementMode ? '' : response.data.current_value || '0');
      } catch (err) {
        setError('Failed to load goal details');
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, incrementMode]);

  const calculateProgress = () => {
    if (!goal || !goal.current_value || !goal.target_value) return 0;
    const progress = (goal.current_value / goal.target_value) * 100;
    return Math.min(progress, 100);
  };

  const handleModeChange = (event) => {
    setIncrementMode(event.target.checked);
    setProgressValue(event.target.checked ? '' : (goal?.current_value || '0'));
  };

  const handleValueChange = (e) => {
    setProgressValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!progressValue.trim()) {
      setError('Please enter a value');
      return;
    }
    
    try {
      const payload = incrementMode 
        ? { increment: Number(progressValue) }
        : { current_value: Number(progressValue) };
        
      const response = await axios.patch(`${API_BASE_URL}/goals/${id}/progress`, payload);
      setGoal(response.data);
      setSuccessMessage('Progress updated successfully!');
      setProgressValue(incrementMode ? '' : response.data.current_value);
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  if (loading) return <LinearProgress />;
  
  if (!goal) return <Typography>Goal not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Update Progress: {goal.title}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="subtitle1">
            Current Progress: {goal.current_value || 0} / {goal.target_value}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()} 
            sx={{ height: 12, borderRadius: 6, mt: 1, mb: 1 }}
          />
          <Typography>
            {calculateProgress().toFixed(0)}% Complete
          </Typography>
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControlLabel
            control={
              <Switch 
                checked={incrementMode} 
                onChange={handleModeChange}
                color="primary"
              />
            }
            label={incrementMode ? "Increment by value" : "Set absolute value"}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="progress-value">
              {incrementMode ? 'Add Progress' : 'New Progress Value'}
            </InputLabel>
            <Input
              id="progress-value"
              type="number"
              value={progressValue}
              onChange={handleValueChange}
              startAdornment={<InputAdornment position="start">#</InputAdornment>}
            />
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/goals/${id}`)}
            >
              Back to Goal
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Update Progress
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default GoalProgress;
