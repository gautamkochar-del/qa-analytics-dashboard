import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import axios from 'axios';

export default function TestCases() {
  const [folders, setFolders] = useState(['API', 'UI', 'Regression', 'Smoke']);
  const [selectedFolder, setSelectedFolder] = useState('All Test Cases');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    expectedResult: '',
    priority: 'Medium',
    automationStatus: 'Manual',
    folder: 'API'
  });

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('qa_dash_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.get('/api/testcases', config);
      setTestCases(data);
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('qa_dash_token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post('/api/testcases', formData, config);
      setOpenDialog(false);
      setFormData({ title: '', expectedResult: '', priority: 'Medium', automationStatus: 'Manual', folder: 'API' });
      fetchTestCases();
    } catch (error) {
      console.error('Error creating test case:', error);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
    }
    setOpenFolderDialog(false);
    setNewFolderName('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Test Case Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<CreateNewFolderIcon />} onClick={() => setOpenFolderDialog(true)}>New Folder</Button>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenDialog(true)}>Create Test Case</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Typography variant="subtitle1" fontWeight={700}>Folders</Typography>
            </Box>
            <List disablePadding>
              <ListItem button selected={selectedFolder === 'All Test Cases'} onClick={() => setSelectedFolder('All Test Cases')}>
                <ListItemIcon><FolderIcon color={selectedFolder === 'All Test Cases' ? 'primary' : 'action'} /></ListItemIcon>
                <ListItemText primary="All Test Cases" primaryTypographyProps={{ fontWeight: selectedFolder === 'All Test Cases' ? 700 : 500 }} />
              </ListItem>
              <Divider />
              {folders.map(folder => (
                <React.Fragment key={folder}>
                  <ListItem button selected={selectedFolder === folder} onClick={() => setSelectedFolder(folder)}>
                    <ListItemIcon><FolderIcon color={selectedFolder === folder ? 'primary' : 'action'} /></ListItemIcon>
                    <ListItemText primary={folder} primaryTypographyProps={{ fontWeight: selectedFolder === folder ? 700 : 500 }} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ borderRadius: 3, p: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>{selectedFolder} Test Cases</Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Title / Expected Result</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Automation</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Links</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                    </TableRow>
                  ) : testCases.filter(tc => selectedFolder === 'All Test Cases' || tc.folder === selectedFolder).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No test cases found in this folder.</TableCell>
                    </TableRow>
                  ) : testCases.filter(tc => selectedFolder === 'All Test Cases' || tc.folder === selectedFolder).map(tc => (
                    <TableRow key={tc.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{tc.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{tc.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Steps: 5 • Expected: Success</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={tc.priority} color={tc.priority === 'Critical' ? 'error' : tc.priority === 'High' ? 'warning' : 'primary'} />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" label={tc.automationStatus} color={tc.automationStatus === 'Automated' ? 'success' : tc.automationStatus === 'Manual' ? 'default' : 'primary'} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                          {tc.linkedBugs > 0 && <Chip size="small" label={`${tc.linkedBugs} Bugs`} color="error" />}
                          {tc.linkedRuns > 0 && <Chip size="small" label={`${tc.linkedRuns} Runs`} color="info" />}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                        {tc.automationStatus === 'Automated' && <IconButton size="small" color="success"><PlayCircleFilledWhiteIcon fontSize="small" /></IconButton>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Test Case</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField 
            label="Title" 
            fullWidth 
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            autoFocus
          />
          <TextField 
            label="Expected Result" 
            fullWidth 
            multiline 
            rows={3} 
            value={formData.expectedResult}
            onChange={e => setFormData({ ...formData, expectedResult: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Folder</InputLabel>
            <Select 
              value={formData.folder} 
              label="Folder"
              onChange={e => setFormData({ ...formData, folder: e.target.value })}
            >
              {folders.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select 
                  value={formData.priority} 
                  label="Priority"
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Automation Status</InputLabel>
                <Select 
                  value={formData.automationStatus} 
                  label="Automation Status"
                  onChange={e => setFormData({ ...formData, automationStatus: e.target.value })}
                >
                  <MenuItem value="Manual">Manual</MenuItem>
                  <MenuItem value="Automated">Automated</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.title}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFolderDialog} onClose={() => setOpenFolderDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField 
            label="Folder Name" 
            fullWidth 
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenFolderDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Add Folder</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
