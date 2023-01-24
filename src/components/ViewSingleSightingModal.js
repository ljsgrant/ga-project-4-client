import { useState, useEffect } from 'react';
import { API } from '../lib/api';
import UserSightingPhoto from './common/UserSightingPhoto';

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
            <h2>{sightingData?.bird_sighted.name}</h2>
          </div>
          <div className='modal-content'>
            <div className='image-container'>
              {sightingData?.image === '0' ? (
                <p>(No photo was added for this sighting)</p>
              ) : (
                <UserSightingPhoto cloudinaryImageId={sightingData?.image} />
              )}
            </div>
          </div>
          <p>{sightingData?.id}</p>
        </div>
      </div>
    </>
  );
}
