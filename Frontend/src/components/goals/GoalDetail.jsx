// src/components/goals/GoalDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Box, Button, Grid, Paper, LinearProgress,
  Tabs, Tab, Divider, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlanList from '../plans/PlanList';
import TipList from '../tips/TipList';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await axios.get(`/api/goals/${id}`);
        setGoal(response.data);
      } catch (err) {
        setError('Failed to load goal details');
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const calculateProgress = () => {
    if (!goal || !goal.current_value || !goal.target_value) return 0;
    const progress = (goal.current_value / goal.target_value) * 100;
    return Math.min(progress, 100);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/goals/${id}`);
      setDeleteDialogOpen(false);
      navigate('/goals');
    } catch (err) {
      setError('Failed to delete goal');
      setDeleteDialogOpen(false);
    }
  };

  if (loading) return <LinearProgress />;
  
  if (error) return <Typography color="error">{error}</Typography>;
  
  if (!goal) return <Typography>Goal not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1">
            {goal.title}
          </Typography>
          <Box>
            <IconButton 
              component={Link} 
              to={`/goals/${id}/edit`}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error"
              onClick={handleDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {goal.description || 'No description provided.'}
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                Progress: {goal.current_value || 0} / {goal.target_value}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress()} 
                sx={{ height: 12, borderRadius: 6, mt: 1 }}
              />
              <Typography sx={{ mt: 1 }}>
                {calculateProgress().toFixed(0)}% Complete
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              {goal.deadline && (
                <Typography variant="subtitle1">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  component={Link}
                  to={`/goals/${id}/progress`}
                >
                  Update Progress
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Action Plans" />
          <Tab label="Tips & Advice" />
        </Tabs>
        <Divider />
      </Box>
      
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && <PlanList goalId={id} />}
        {tabValue === 1 && <TipList goalId={id} />}
      </Box>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this goal? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GoalDetail;
