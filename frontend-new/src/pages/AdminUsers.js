import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { 
    Container, Typography, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, InputLabel, Box, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState({ email: '', password: '', role: 'user' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setError('');
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error al obtener usuarios:', err.response ? err.response.data : err.message);
            setError(err.response ? `Error del servidor: ${err.response.data.msg}` : 'No se pudieron cargar los usuarios. Revisa la conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenDialog = (user = null) => {
        setIsEditing(!!user);
        setCurrentUser(user ? { ...user, password: '' } : { email: '', password: '', role: 'user' });
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveUser = async () => {
        try {
            if (isEditing) {
                await userService.updateUserRole(currentUser._id, currentUser.role);
            } else {
                await userService.createUser(currentUser);
            }
            fetchUsers();
            handleCloseDialog();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                await userService.deleteUser(userId);
                fetchUsers();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Crear Usuario
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {loading ? (
                <Typography sx={{ mt: 3 }}>Cargando usuarios...</Typography>
            ) : (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(user)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user._id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {users.length === 0 && !loading && (
                    <Typography sx={{ p: 2, textAlign: 'center' }}>No se encontraron usuarios.</Typography>
                )}
            </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={currentUser.email}
                        disabled={isEditing}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    />
                    {!isEditing && (
                        <TextField
                            margin="dense"
                            label="Contraseña"
                            type="password"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                        />
                    )}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={currentUser.role}
                            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                        >
                            <MenuItem value="user">Usuario</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSaveUser}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminUsers;
