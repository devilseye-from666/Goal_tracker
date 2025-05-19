// src/components/plans/PlanList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, List, ListItem, ListItemText, 
  ListItemSecondaryAction, IconButton, Checkbox, Paper,
  TextField, LinearProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const PlanList = ({ goalId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`/api/goals/${goalId}/plans`);
        setPlans(response.data);
      } catch (err) {
        setError('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [goalId]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newPlan.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(`/api/goals/${goalId}/plans`, {
        content: newPlan
      });
      setPlans([...plans, response.data]);
      setNewPlan('');
    } catch (err) {
      setError('Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (planId, completed) => {
    try {
      const response = await axios.put(`/api/plans/${planId}`, {
        completed: !completed
      });
      
      setPlans(plans.map(plan => 
        plan.id === planId ? response.data : plan
      ));
    } catch (err) {
      setError('Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`/api/plans/${planId}`);
      setPlans(plans.filter(plan => plan.id !== planId));
    } catch (err) {
      setError('Failed to delete plan');
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Action Plans
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleCreatePlan} sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Add a new action plan..."
          value={newPlan}
          onChange={(e) => setNewPlan(e.target.value)}
          disabled={submitting}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ ml: 1 }}
          disabled={!newPlan.trim() || submitting}
        >
          Add
        </Button>
      </Box>
      
      {plans.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No action plans yet. Add your first one above!
        </Typography>
      ) : (
        <List>
          {plans.map((plan) => (
            <ListItem key={plan.id} divider>
              <Checkbox
                edge="start"
                checked={!!plan.completed}
                onChange={() => handleToggleComplete(plan.id, plan.completed)}
              />
              <ListItemText
                primary={plan.content}
                sx={{
                  textDecoration: plan.completed ? 'line-through' : 'none',
                  color: plan.completed ? 'text.secondary' : 'text.primary'
                }}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handleDeletePlan(plan.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PlanList;
