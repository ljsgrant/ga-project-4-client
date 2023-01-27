import '../styles/UserProfile.scss';
import 'leaflet/dist/leaflet.css';
import '../styles/common/containerStyles.scss';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import MapPopup from './common/MapPopup';

export default function UserProfile({
  setSightingIdForModal,
  setIsSightingModalOpen,
  isBirdDataUpdated,
  setIsBirdDataUpdated
}) {
  const { pk } = useParams();
  const [userData, setUserData] = useState(null);
  console.log(AUTH.getPayload());

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleUser(pk))
      .then(({ data }) => setUserData(data))
      .catch((err) => console.error(err));
    setIsBirdDataUpdated(false);
    // eslint-disable-next-line
  }, [pk, isBirdDataUpdated]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div className='UserProfile'>
      <div className='left-column'>
        <div className='map-header'>
          <h3>{userData?.username}'s sightings</h3>
        </div>
        <MapContainer center={[51.505, -0.09]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {userData?.sightings?.map((sighting) => (
            <Marker
              key={sighting.id}
              icon={DefaultMarkerIcon}
              position={[sighting.location_lat, sighting.location_long]}
            >
              <MapPopup
                sightingData={sighting}
                setSightingIdForModal={setSightingIdForModal}
                setIsSightingModalOpen={setIsSightingModalOpen}
              />
            </Marker>
          ))}
          {userData?.sightings.length < 1 && (
            <p className='no-sightings-message'>No sightings yet!</p>
          )}
        </MapContainer>
      </div>
      <div className='right-column'>
        <div className='container-style-all container-style-top'>
          <h3>{userData?.username}'s info</h3>
        </div>
        <div className='container-style-all container-style-column'>
          <p>Name: </p>
          {userData?.first_name && userData?.last_name ? (
            <p>
              {userData?.first_name} {userData?.last_name}
            </p>
          ) : (
            <p>Not provided</p>
          )}
        </div>
        <div className='container-style-all container-style-column'>
          <p>User ID: {userData?.id}</p>
        </div>
        <div className='container-style-all container-style-column'>
          <p>
            Joined on:{' '}
            {userData?.date_joined.slice(0, 10).split('-').reverse().join('/')}{' '}
            (dd/mm/yyyy)
          </p>
        </div>
        <div className='container-style-all container-style-column container-style-bot'>
          <p>Sightings: {userData?.sightings?.length}</p>
        </div>
      </div>
    </div>
  );
}
