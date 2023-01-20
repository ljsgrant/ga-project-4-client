import '../styles/BirdDetails.scss';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useState, useEffect } from 'react';

import { useParams } from 'react-router';
import { API } from '../lib/api';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';

export default function BirdDetails() {
  const { pk } = useParams();
  const [birdData, setBirdData] = useState(null);

  console.log(pk);

  const DefaultMarkerIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleBird(pk))
      .then(({ data }) => setBirdData(data))
      .catch((err) => console.error(err));
  }, [pk]);

  //************************
  // DEVELOPMENT
  useEffect(() => {
    console.log(birdData);
  }, [birdData]);
  //************************

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
            <p>{birdData?.description}</p>
          </div>
        </div>
        <div className='right-column'>
          <div className='sightings-container'>
            {/* {birdData?.sightings?.map((sighting) => (
              <p key={sighting.id}>
              {sighting.sighted_at_datetime} - {sighting.location_lat},{' '}
              {sighting.location_long}
              </p>
            ))} */}
          </div>
          <div className='map-header'>
            <h3>User sightings of the {birdData?.name}</h3>
          </div>
          <MapContainer
            center={[51.505, -0.09]}
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
                  Seen by {sighting.owner} at {sighting.sighted_at_datetime}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
