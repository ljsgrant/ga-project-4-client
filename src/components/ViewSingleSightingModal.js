import '../styles/DeleteDialog.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSightingPhoto from './common/UserSightingPhoto';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

export default function ViewSingleSightingModal({
  setIsModalOpen,
  sightingId, 
  setIsBirdDataUpdated
}) {
  const [sightingData, setSightingData] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);


  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleSighting(sightingId))
      .then(({ data }) => {
        setSightingData(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, [sightingId]);

  const deleteSighting = () => {
    console.log('deleted sighting');
    API.DELETE(API.ENDPOINTS.singleSighting(sightingId), API.getHeaders())
      .then(() => {
        setIsModalOpen(false);
        setIsBirdDataUpdated(true);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteAlertOpen = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteAlertClose = () => {
    setIsDeleteAlertOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteSighting();
    handleDeleteAlertClose();
  };

  const handleDeleteCancel = () => {
    handleDeleteAlertClose();
  };

  return (
    <>
      <div className='ViewSingleSightingModal'>
        <div className='modal-container'>
          <div className='modal-header'>
            <button aria-label='close sighting' onClick={handleClose}>
              X
            </button>
            <h2>Sighting Details</h2>
            <h2>{sightingData?.bird_sighted.name}</h2>
            <p>{sightingData?.sighted_at_datetime}</p>
            <p>Sighting recorded by {sightingData?.owner.username}</p>
          </div>
          <div className='modal-controls'>
            {AUTH.getPayload().sub === sightingData?.owner.id && (
              <Link to={`/edit-sighting/${sightingData?.id}`}>
                <button onClick={handleClose}>Edit Sighting</button>
              </Link>
            )}

            {(AUTH.getPayload().sub === sightingData?.owner.id ||
              AUTH.getPayload().isAdmin) && (
              <button onClick={handleDeleteAlertOpen}>Delete Sighting</button>
            )}
          </div>
          <div className='modal-content'>
            <div className='image-container'>
              {sightingData?.image === '0' ? (
                <p>(No photo was added for this sighting)</p>
              ) : (
                <UserSightingPhoto
                  className='photo-component'
                  cloudinaryImageId={sightingData?.image}
                />
              )}
            </div>
            <div className='info-container'>
              <button>Notes</button>
              <button>Map Marker</button>
              <p>{sightingData?.notes}</p>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        className='DeleteDialog'
        open={isDeleteAlertOpen}
        onClose={handleDeleteAlertClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle color='lightseagreen' id='alert-dialog-title'>
          {'Delete Sighting'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete this sighting? You can't undo this
            action!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
