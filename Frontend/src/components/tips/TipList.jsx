/* eslint-disable no-unused-vars */
// src/components/tips/TipList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Card, CardContent, CardActions,
  IconButton, LinearProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const TipList = ({ goalId }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [formData, setFormData] = useState({
    advice: '',
    source: ''
  });

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get(`/api/goals/${goalId}/tips`);
        setTips(response.data);
      } catch (err) {
        setError('Failed to load tips');
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [goalId]);

  const handleOpenDialog = (tip = null) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        advice: tip.advice,
        source: tip.source || ''
      });
    } else {
      setEditingTip(null);
      setFormData({
        advice: '',
        source: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTip) {
        const response = await axios.put(`/api/tips/${editingTip.id}`, formData);
        setTips(tips.map(tip => tip.id === editingTip.id ? response.data : tip));
      } else {
        const response = await axios.post(`/api/goals/${goalId}/tips`, formData);
        setTips([...tips, response.data]);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save tip');
    }
  };

  const handleDeleteTip = async (tipId) => {
    try {
      await axios.delete(`/api/tips/${tipId}`);
      setTips(tips.filter(tip => tip.id !== tipId));
    } catch (err) {
      setError('Failed to delete tip');
    }
  };

  if (loading) return <LinearProgress />;

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Tips & Advice
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Tip
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {tips.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No tips or advice yet. Add your first one with the button above!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {tips.map((tip) => (
            <Grid item xs={12} md={6} key={tip.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1">
                    {tip.advice}
                  </Typography>
                  {tip.source && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      Source: {tip.source}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(tip)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    color="error" 
                    onClick={() => handleDeleteTip(tip.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTip ? 'Edit Tip' : 'Add New Tip'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Advice/Tip"
              name="advice"
              multiline
              rows={4}
              value={formData.advice}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Source (optional)"
              name="source"
              placeholder="Book, website, person..."
              value={formData.source}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingTip ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TipList;
