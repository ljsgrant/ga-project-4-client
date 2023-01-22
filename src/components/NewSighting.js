import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { API } from '../lib/api';

export default function NewSighting() {
  const navigate = useNavigate();
  const [allBirds, setAllBirds] = useState(null);
  const [formFields, setFormFields] = useState({
    bird_sighted: null,
    sighted_at_datetime: null,
    location_lat: 0,
    location_long: 0,
    notes: ''
  });
  const [selectedBird, setSelectedBird] = useState('');
  const [markerPosition, setMarkerPosition] = useState({
    lat: 51.53606314086357,
    lng: -0.3515625
  });
  const markerRef = useRef(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.allBirds)
      .then(({ data }) => {
        setAllBirds(data);
        setSelectedBird(data[0].id);
        setFormFields({ ...formFields, bird_sighted: data[0].id });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTextChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const handleBirdSelectChange = (event) => {
    setSelectedBird(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    API.POST(API.ENDPOINTS.sightings, formFields, API.getHeaders())
      .then(({ data }) => {
        console.log(data);
        console.log('created sighting!');
        navigate(`/birds/${formFields.bird_sighted}`);
      })
      .catch((error) => console.error(error));
  };

  function movedMarker(event) {
    const marker = markerRef.current;
    if (marker != null) {
      setMarkerPosition(marker.getLatLng());
    }
  }

  const handleLatLongTextChange = (event) => {
    if (!isNaN(event.target.value)) {
      setMarkerPosition({
        ...markerPosition,
        [event.target.name]: event.target.value
      });
    }
  };

  useEffect(() => {
    setFormFields({
      ...formFields,
      location_lat: markerPosition.lat,
      location_long: markerPosition.lng
    });
  }, [markerPosition]);

  const handleSelect = (event) => {
    handleBirdSelectChange(event);
    handleTextChange(event);
  };

  // ******************
  //#region UNCOMMENT FOR DEBUGGING
  // useEffect(() => {
  //   console.log(allBirds);
  // }, [allBirds]);

  // useEffect(() => {
  //   console.log(selectedBird);
  // }, [selectedBird]);

  useEffect(() => {
    console.log(formFields);
  }, [formFields]);

  // useEffect(() => {
  //   console.log(markerPosition);
  // }, [markerPosition]);
  //#endregion
  // ******************

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
              onChange={handleSelect}
              name='bird_sighted'
            >
              <option disabled selected value={null}>
                None selected
              </option>
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
            <div className='lat-long-inputs'>
              <label htmlFor='lat'>Latitude:</label>
              <input
                id='lat'
                name='lat'
                onChange={handleLatLongTextChange}
                value={markerPosition.lat}
                required
              />
              <label htmlFor='long'>Longitude:</label>
              <input
                id='long'
                name='lng'
                onChange={handleLatLongTextChange}
                value={markerPosition.lng}
                required
              />
            </div>
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
                dragend: movedMarker
              }}
            ></Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
