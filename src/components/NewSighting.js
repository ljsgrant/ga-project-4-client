import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import { useState, useEffect, useRef } from 'react';
import { API } from '../lib/api';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';

export default function NewSighting() {
  const [allBirds, setAllBirds] = useState(null);
  const [selectedBird, setSelectedBird] = useState('');
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
  const markerRef = useRef(null);

  const handleTextChange = (event) => {};

  const handleBirdSelectChange = (event) => {
    setSelectedBird(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    API.GET(API.ENDPOINTS.allBirds)
      .then(({ data }) => setAllBirds(data))
      .catch((err) => console.error(err));
  }, []);

  // ******************
  // DEBUGGING
  useEffect(() => {
    console.log(allBirds);
  }, [allBirds]);

  useEffect(() => {
    console.log(selectedBird);
  }, [selectedBird]);

  useEffect(() => {
    console.log(markerPosition);
  }, [markerPosition]);
  // ******************

  function moveMarker(event) {
    const marker = markerRef.current;
    if (marker != null) {
      setMarkerPosition(marker.getLatLng());
    }
  }

  return (
    <>
      <div className='NewSighting'>
        <div className='left-column'>
          <h2>New Sighting</h2>
          <form className='sighting-form' onSubmit={handleSubmit}>
            <label htmlFor='select-bird'>Bird</label>
            <select
              id='select-bird'
              value={selectedBird}
              onChange={handleBirdSelectChange}
            >
              {allBirds?.map((bird) => (
                <option key={bird.id} value={bird.id}>
                  {bird.name}
                </option>
              ))}
            </select>
            <label htmlFor='sighted-at-datetime'>Date & time seen:</label>
            <input
              id='sighted-at-datetime'
              name='sighted_at_datetime'
              type='datetime-local'
              onChange={handleTextChange}
              required
            />

            <label htmlFor='notes'>Notes</label>
            <textarea
              id='notes'
              name='notes'
              onChange={handleTextChange}
              required
            />

            <button type='submit'>Post this sighting</button>
          </form>
        </div>
        <div className='right-column'>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={5}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
              draggable={true}
              icon={DefaultMarkerIcon}
              position={markerPosition}
              ref={markerRef}
              eventHandlers={{
                dragend: moveMarker
              }}
            ></Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
