import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { 
    Container, Typography, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, Select, MenuItem, FormControl, 
    InputLabel, Box, Chip, OutlinedInput, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ROLES = ['user', 'chef', 'admin', 'produc', 'compras', 'almacen'];

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState({ email: '', password: '', roles: ['user'] });
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
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenDialog = (user = null) => {
        setIsEditing(!!user);
        setCurrentUser(user ? { ...user, password: '' } : { email: '', password: '', roles: ['user'] });
        setError('');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleSaveUser = async () => {
        try {
            if (isEditing) {
                await userService.updateUserRoles(currentUser._id, currentUser.roles);
            } else {
                await userService.createUser(currentUser);
            }
            fetchUsers();
            handleCloseDialog();
        } catch (err) {
            setError(err.message || 'Error al guardar el usuario.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await userService.deleteUser(userId);
                fetchUsers();
            } catch (err) {
                setError(err.message || 'Error al eliminar el usuario.');
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Crear Usuario</Button>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {loading ? (
                <Typography sx={{ mt: 3 }}>Cargando usuarios...</Typography>
            ) : (
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(user.roles || []).map((role) => <Chip key={role} label={role} />)}
                                    </Box>
                                </TableCell>
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
                <DialogTitle>{isEditing ? 'Editar Roles de Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField autoFocus margin="dense" label="Email" type="email" fullWidth value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} disabled={isEditing} />
                    {!isEditing && <TextField margin="dense" label="Contraseña" type="password" fullWidth onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })} />}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Roles</InputLabel>
                        <Select
                            multiple
                            value={currentUser.roles || []}
                            onChange={(e) => setCurrentUser({ ...currentUser, roles: e.target.value })}
                            input={<OutlinedInput label="Roles" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => <Chip key={value} label={value} />)}
                                </Box>
                            )}
                        >
                            {ROLES.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}
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
