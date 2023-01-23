import '../styles/UserProfile.scss';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';
import UserSightingPhoto from './common/UserSightingPhoto';

export default function UserProfile() {
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
      <h3>{userData?.username}'s Profile Page</h3>
      <p>
        Full name: {userData?.first_name} {userData?.last_name}
      </p>
      <p>User ID: {pk}</p>
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
            <Popup>
              <div className='map-popup-content'>
                <h4>{sighting?.bird_sighted.name}</h4>
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
        {userData?.sightings.length < 1 && (
          <p className='no-sightings-message'>No sightings yet!</p>
        )}
      </MapContainer>
    </div>
  );
}
