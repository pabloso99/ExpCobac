import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardActions, Grid, Select, MenuItem, IconButton, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/api/production';

const Production = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching production tasks:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Plan de Producción</Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item key={task._id} xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{task.recipeName}</Typography>
                    {task.steps && task.steps.length > 0 && (
                      <Tooltip 
                        title={
                          <React.Fragment>
                            <Typography color="inherit">Pasos</Typography>
                            <ol style={{ paddingLeft: '20px', margin: 0 }}>
                              {task.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </React.Fragment>
                        }
                      >
                        <HelpOutlineIcon color="action" sx={{ cursor: 'pointer' }} />
                      </Tooltip>
                    )}
                  </Box>
                  <Select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    size="small"
                    sx={{
                      minWidth: 150,
                      '& .MuiSelect-select': {
                        backgroundColor: 
                          task.status === 'Pendiente' ? '#FFDDC1' : // Amarillo pastel
                          task.status === 'En Progreso' ? '#D1E4FF' : // Azul pastel
                          '#D4EDDA', // Verde pastel
                        color: '#333', // Un color de texto oscuro que funcione con todos los fondos
                        borderRadius: 1,
                      }
                    }}
                  >
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                    <MenuItem value="En Progreso">En Progreso</MenuItem>
                    <MenuItem value="Completado">Completado</MenuItem>
                  </Select>
                </Box>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton onClick={() => handleDelete(task._id)}><DeleteIcon /></IconButton>
                <IconButton
                  onClick={() => handleExpandClick(task._id)}
                  aria-expanded={expandedId === task._id}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expandedId === task._id} timeout="auto" unmountOnExit>
                <CardContent>

                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ingrediente</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell>Unidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {task.ingredients.map((ing, index) => (
                          <TableRow key={index}>
                            <TableCell>{ing.name}</TableCell>
                            <TableCell align="right">{ing.quantity.toFixed(2)}</TableCell>
                            <TableCell>{ing.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Production;
