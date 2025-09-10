import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Box, Container, Typography, Button, Grid, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:5000/api/ingredients';

const categories = ['proteínas', 'vegetales', 'frutas', 'cereales', 'lacteos', 'especias', 'aceites', 'otros'];
const units = ['gramos', 'kilogramos', 'litros', 'mililitros', 'unidades', 'cucharadas', 'cucharaditas', 'tazas'];

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);

    const fetchIngredients = useCallback(async () => {
        try {
            const response = await axios.get(API_URL);
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleOpenDialog = (ingredient = null) => {
        if (ingredient) {
            setIsEditing(true);
            setCurrentIngredient(ingredient);
        } else {
            setIsEditing(false);
            setCurrentIngredient({ name: '', unit: 'gramos', price: 0, category: 'otros', supplier: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentIngredient(null);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${currentIngredient._id}`, currentIngredient);
            } else {
                await axios.post(API_URL, currentIngredient);
            }
            fetchIngredients();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving ingredient:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchIngredients();
            } catch (error) {
                console.error('Error deleting ingredient:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentIngredient(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">Gestión de Ingredientes</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Añadir Ingrediente</Button>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Unidad</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Proveedor</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients.map((ing) => (
                            <TableRow key={ing._id}>
                                <TableCell>{ing.name}</TableCell>
                                <TableCell>${ing.price}</TableCell>
                                <TableCell>{ing.unit}</TableCell>
                                <TableCell>{ing.category}</TableCell>
                                <TableCell>{ing.supplier || '-'}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(ing)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(ing._id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField label="Nombre" name="name" value={currentIngredient?.name || ''} onChange={handleChange} fullWidth margin="normal" />
                        <TextField label="Precio" name="price" type="number" value={currentIngredient?.price || 0} onChange={handleChange} fullWidth margin="normal" />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Unidad</InputLabel>
                            <Select name="unit" value={currentIngredient?.unit || ''} onChange={handleChange} label="Unidad">
                                {units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Categoría</InputLabel>
                            <Select name="category" value={currentIngredient?.category || ''} onChange={handleChange} label="Categoría">
                                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Proveedor" name="supplier" value={currentIngredient?.supplier || ''} onChange={handleChange} fullWidth margin="normal" />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Ingredients;
