import { Link } from 'react-router-dom';
import { Popup } from 'react-leaflet';
import UserSightingPhoto from './UserSightingPhoto';

export default function MapPopup({
  sightingData,
  setSightingIdForModal,
  setIsSightingModalOpen
}) {
  const handleOpenSightingModal = (event) => {
    setSightingIdForModal(event.target.value);
    setIsSightingModalOpen(true);
  };

  return (
    <Popup>
      <div className='map-popup-content'>
        {sightingData?.owner.id && (
          <p>
            Seen by{' '}
            <Link to={`/user/${sightingData?.owner.id}`}>
              {sightingData?.owner.username}
            </Link>
          </p>
        )}
        {sightingData?.bird_sighted.name && (
          <Link to={`/birds/${sightingData?.bird_sighted.id}`}>
            <h4>{sightingData?.bird_sighted.name}</h4>
          </Link>
        )}
        <p>
          at {sightingData?.sighted_at_datetime.split('T')[1].substr(0, 5)} on{' '}
          {sightingData?.sighted_at_datetime
            .split('T')[0]
            .substr(0, 10)
            .split('-')
            .reverse()
            .join('/')}
          .
        </p>
        <div className='photo-container'>
          <UserSightingPhoto
            className='UserSightingPhoto'
            cloudinaryImageId={sightingData?.image}
          />
        </div>
        <button value={sightingData?.id} onClick={handleOpenSightingModal}>
          View Details & Notes
        </button>
      </div>
    </Popup>
  );
}
