import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const MessageDialog = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onClose={onClose}  
    BackdropProps={{
        style: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Màu nền đen với độ mờ 30% 
        },
    }}>
      <DialogTitle>{"Thông báo"}</DialogTitle>
      <DialogContent>
        <Typography align='center' >{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialog;
