import '../styles/BirdDetails.scss';
import 'leaflet/dist/leaflet.css';
import '../styles/common/containerStyles.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';

import { useParams } from 'react-router';
import { API } from '../lib/api';

import UserSightingPhoto from './common/UserSightingPhoto';

export default function BirdDetails({
  setSightingIdForModal,
  setIsSightingModalOpen,
  isBirdDataUpdated,
  setIsBirdDataUpdated
}) {
  const { pk } = useParams();
  const [birdData, setBirdData] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const successCallback = (position) => {
    setMapCenter([position.coords.latitude, position.coords.longitude]);
    console.log('Setting center of the map to your location');
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  useMemo(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleBird(pk))
      .then(({ data }) => {
        setBirdData(data);
      })
      .catch((err) => console.error(err));
    setIsBirdDataUpdated(false);
    // eslint-disable-next-line
  }, [pk, isBirdDataUpdated]);

  const handleOpenSightingModal = (event) => {
    setSightingIdForModal(event.target.value);
    setIsSightingModalOpen(true);
  };

  return (
    <>
      <div className='BirdDetails'>
        <div className='left-column'>
          <div className='title-container'>
            <h2>{birdData?.name}</h2>
            {birdData && (
              <h3>
                (
                <span className='scientific-name'>
                  {birdData?.scientific_name}
                </span>
                )
              </h3>
            )}
          </div>
          <div className='hero-image-container photo-container-style'>
            <img
              className='hero-image'
              src={birdData?.image}
              alt={birdData?.name}
            />
          </div>
          <div className='info-text-container'>
            <h4>Description</h4>
            <p>{birdData?.description}</p>
          </div>
        </div>
        <div className='right-column'>
          <div className='map-header '>
            <h3>User sightings of the {birdData?.name}</h3>
          </div>
          <MapContainer
            center={mapCenter ? mapCenter : [51.505, -0.09]}
            zoom={5}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {birdData?.sightings?.map((sighting) => (
              <Marker
                key={sighting.id}
                icon={DefaultMarkerIcon}
                position={[sighting.location_lat, sighting.location_long]}
              >
                <Popup>
                  <div className='map-popup-content'>
                    <p>
                      Seen by{' '}
                      <Link to={`/user/${sighting.owner.id}`}>
                        {sighting.owner.username}
                      </Link>
                    </p>
                    <p>
                      at{' '}
                      {sighting?.sighted_at_datetime.split('T')[1].substr(0, 5)}{' '}
                      on{' '}
                      {sighting?.sighted_at_datetime
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
                        cloudinaryImageId={sighting.image}
                      />
                    </div>
                    <button
                      value={sighting.id}
                      onClick={handleOpenSightingModal}
                    >
                      View Details & Notes
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {birdData?.sightings.length < 1 && (
              <p className='no-sightings-message'>No sightings yet!</p>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
