// src/components/goals/GoalForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box,
  Paper, Alert, FormControl, InputLabel, Input, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { API_BASE_URL } from '../../api/config'; 

const GoalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_value: '',
    deadline: null
  });
  
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchGoal = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/goals/${id}`,{ withCredentials: true });
          const goal = response.data;
          setFormData({
            title: goal.title,
            description: goal.description || '',
            target_value: goal.target_value.toString(),
            deadline: goal.deadline ? new Date(goal.deadline) : null
          });
        } catch (err) {
          setError('Failed to load goal details');
        }
      };
      
      fetchGoal();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, deadline: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = {
      ...formData,
      target_value: Number(formData.target_value),
      deadline: formData.deadline ? formData.deadline.toISOString() : null
    };
    
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/goals/${id}`, payload,{ withCredentials: true });
      } else {
        await axios.post(`${API_BASE_URL}/goals`, payload,{ withCredentials: true });
      }
      navigate('/goals');
    } catch (err) {
      setError('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Goal' : 'Create New Goal'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Goal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="target_value">Target Value</InputLabel>
            <Input
              id="target_value"
              name="target_value"
              type="number"
              value={formData.target_value}
              onChange={handleChange}
              startAdornment={<InputAdornment position="start">#</InputAdornment>}
            />
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Deadline (Optional)"
              value={formData.deadline}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/goals')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditMode ? 'Update Goal' : 'Create Goal')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default GoalForm;
