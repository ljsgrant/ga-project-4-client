import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import UserSightingPhoto from './common/UserSightingPhoto';
import { Link } from 'react-router-dom';

export default function ViewSingleSightingModal({
  setIsModalOpen,
  sightingId
}) {
  const [sightingData, setSightingData] = useState(null);

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
            <Link to={`/edit-sighting/${sightingData?.id}`}>
              <button onClick={handleClose}>Edit Sighting</button>
            </Link>
            <button>Delete Sighting</button>
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
    </>
  );
}
