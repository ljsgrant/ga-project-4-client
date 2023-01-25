import '../styles/UserProfile.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import UserSightingPhoto from './common/UserSightingPhoto';
import MapPopup from './common/MapPopup';

export default function UserProfile({
  setSightingIdForModal,
  setIsSightingModalOpen
}) {
  const { pk } = useParams();
  const [userData, setUserData] = useState(null);
  console.log(AUTH.getPayload());

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleUser(pk))
      .then(({ data }) => setUserData(data))
      .catch((err) => console.error(err));
  }, [pk]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <div className='UserProfile'>
      <div className='left-column'>
        <h3>{userData?.username}'s sightings</h3>
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
        <h3>{userData?.username}'s info</h3>
        <p>
          Full name: {userData?.first_name} {userData?.last_name}
        </p>
        <p>User ID: {userData?.id}</p>
        <p>First joined (dd/mm/yyyy): {userData?.date_joined}</p>
      </div>
    </div>
  );
}
