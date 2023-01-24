import '../styles/BirdDetails.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';

import { useParams } from 'react-router';
import { API } from '../lib/api';

import UserSightingPhoto from './common/UserSightingPhoto';

export default function BirdDetails({ setBirdName }) {
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
        setBirdName(data.name);
      })
      .catch((err) => console.error(err));
  }, [pk]);

  return (
    <>
      <div className='BirdDetails'>
        <div className='left-column'>
          <div className='title-container'>
            <h2>{birdData?.name}</h2>
            <h3>
              (
              <span className='scientific-name'>
                {birdData?.scientific_name}
              </span>
              )
            </h3>
          </div>
          <div className='hero-image-container'>
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
          <div className='map-header'>
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
                    <p>Seen by {sighting.owner.username}</p>
                    <p>at {sighting.sighted_at_datetime}.</p>
                    <UserSightingPhoto
                      className='UserSightingPhoto'
                      cloudinaryImageId={sighting.image}
                      imageWidth={180}
                      imageHeight={180}
                    />
                  </div>
                  <Link>View sighting details</Link>
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
