import React from 'react';
import { Button } from '../../components/Branded';
import { useUIState } from './useUIState';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

// Flow 1: Create
// Flow 2: Edit
export const Editor = () => {
  const { toggleDrawer, openDrawer, seeDrawer } = useUIState();

  return (
    <>
      <Button onClick={() => toggleDrawer('nodeEditor')}>Create New Node</Button>
      <Dialog open={seeDrawer('nodeEditor')} onClose={() => openDrawer('nodeEditor', false)}>
        <DialogTitle>Create</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a node.</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openDrawer('nodeEditor', false)}>Cancel</Button>
          <Button onClick={() => openDrawer('nodeEditor', false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
