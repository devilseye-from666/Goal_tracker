/* eslint-disable no-unused-vars */
// src/components/goals/GoalList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, Typography, Button, Grid, Card, 
  CardContent, CardActions, LinearProgress, Box 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { API_BASE_URL } from '../../api/config'; 

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/goals`);
        setGoals(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load goals');
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const calculateProgress = (current, target) => {
    if (!current || !target) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  if (loading) return <LinearProgress />;
  
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Goals
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link} 
          to="/goals/new"
        >
          New Goal
        </Button>
      </Box>

      {goals.length === 0 ? (
        <Typography variant="body1">
          You don't have any goals yet. Start by creating a new goal!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {goal.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {goal.description || 'No description'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(goal.current_value, goal.target_value)} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Typography variant="body2">
                        {goal.current_value || 0} / {goal.target_value}
                      </Typography>
                      <Typography variant="body2">
                        {calculateProgress(goal.current_value, goal.target_value).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/goals/${goal.id}`}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/goals/${goal.id}/progress`}
                  >
                    Update Progress
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default GoalList;
