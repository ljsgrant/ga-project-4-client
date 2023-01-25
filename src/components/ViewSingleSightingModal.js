import '../styles/DeleteDialog.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UserSightingPhoto from './common/UserSightingPhoto';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
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
  const [isPhotoOpen, setIsPhotoOpen] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const mapButtonRef = useRef(null);
  const photoButtonRef = useRef(null);

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

  const showPhoto = () => {
    const photoButton = photoButtonRef.current;
    const mapButton = mapButtonRef.current;
    photoButton.classList.remove('unclicked-tab');
    mapButton.classList.add('unclicked-tab');
    setIsPhotoOpen(true);
    setIsMapOpen(false);
  };
  const showMap = () => {
    const photoButton = photoButtonRef.current;
    const mapButton = mapButtonRef.current;
    photoButton.classList.add('unclicked-tab');
    mapButton.classList.remove('unclicked-tab');
    setIsPhotoOpen(false);
    setIsMapOpen(true);
  };

  if (!sightingData) {
    return <p>Loading data...</p>;
  }

  return (
    <>
      <div className='ViewSingleSightingModal'>
        <div className='modal-container'>
          <div className='modal-header'>
            <button
              aria-label='close sighting'
              id='close-sighting-button'
              onClick={handleClose}
            >
              X
            </button>
            <h3>Sighting Details</h3>
            <h2>{sightingData?.bird_sighted.name}</h2>
            <p>
              Sighting recorded by{' '}
              <Link
                to={`/user/${sightingData?.owner.id}`}
                onClick={handleClose}
              >
                {sightingData?.owner.username}
              </Link>{' '}
              at {sightingData?.sighted_at_datetime.split('T')[1].substr(0, 5)}{' '}
              on{' '}
              {sightingData?.sighted_at_datetime
                .split('T')[0]
                .substr(0, 10)
                .split('-')
                .reverse()
                .join('/')}
            </p>
          </div>
          <div className='modal-controls'></div>
          <div className='modal-content'>
            <div className='content-controls'>
              <div className='left'>
                <button ref={photoButtonRef} onClick={showPhoto}>
                  Photo
                </button>
                <button
                  ref={mapButtonRef}
                  className='unclicked-tab'
                  onClick={showMap}
                >
                  Map
                </button>
              </div>
              <div className='right'>
                {' '}
                {AUTH.getPayload().sub === sightingData?.owner.id && (
                  <Link to={`/edit-sighting/${sightingData?.id}`}>
                    <button onClick={handleClose}>Edit Sighting</button>
                  </Link>
                )}
                {(AUTH.getPayload().sub === sightingData?.owner.id ||
                  AUTH.getPayload().isAdmin) && (
                  <button onClick={handleDeleteAlertOpen}>
                    Delete Sighting
                  </button>
                )}
              </div>
            </div>
            <div className='image-container'>
              {isPhotoOpen &&
                (sightingData?.image === '0' ? (
                  <p>(No photo was added for this sighting)</p>
                ) : (
                  <UserSightingPhoto
                    className='photo-component'
                    cloudinaryImageId={sightingData?.image}
                  />
                ))}

              {isMapOpen && (
                <MapContainer
                  center={[
                    sightingData?.location_lat,
                    sightingData?.location_long
                  ]}
                  zoom={5}
                  scrollWheelZoom={false}
                  dragging={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />

                  <Marker
                    icon={DefaultMarkerIcon}
                    position={[
                      sightingData?.location_lat,
                      sightingData?.location_long
                    ]}
                  ></Marker>
                </MapContainer>
              )}
            </div>
            <div className='info-container'>
              <h3>Sighting Notes</h3>
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
