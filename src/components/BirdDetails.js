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

  let DefaultIcon = L.icon({
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

  useEffect(() => {
    console.log(birdData);
  }, [birdData]);

  return (
    <>
      <div className='BirdDetails'>
        <div className='left-column'>
          <h2>{birdData?.name}</h2>
          <h3>
            (
            <span className='scientific-name'>{birdData?.scientific_name}</span>
            )
          </h3>
          <div className='hero-image-container'>
            <img
              className='hero-image'
              src={birdData?.image}
              alt={birdData?.name}
            />
          </div>
          <p>{birdData?.description}</p>
        </div>
        <div className='right-column'>
          <p>This is the right column</p>
          <div className='sightings-container'>
            {birdData?.sightings?.map((sighting) => (
              <p key={sighting.id}>
                {sighting.sighted_at_datetime} - {sighting.location_lat},{' '}
                {sighting.location_long}
              </p>
            ))}
          </div>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker icon={DefaultIcon} position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
