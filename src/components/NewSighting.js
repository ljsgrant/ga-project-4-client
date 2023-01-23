import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { API } from '../lib/api';
import { Resource } from '@cloudinary/react';

export default function NewSighting() {
  const navigate = useNavigate();
  const [allBirds, setAllBirds] = useState(null);
  const [formFields, setFormFields] = useState({
    bird_sighted: null,
    sighted_at_datetime: null,
    location_lat: 0,
    location_long: 0,
    notes: '',
    image: ''
  });
  const [selectedBird, setSelectedBird] = useState('');
  const [fileToUpload, setFileToUpload] = useState('');
  const [isDateTimeInputDisabled, setIsDateTimeInputDisabled] = useState(false);
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
    // eslint-disable-next-line
  }, []);

  const handleTextChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const handleBirdSelectChange = (event) => {
    setSelectedBird(event.target.value);
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    setFileToUpload(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const imageData = new FormData();
    imageData.append('file', fileToUpload);
    imageData.append(
      'upload_preset',
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      const cloudinaryResponse = await API.POST(
        API.ENDPOINTS.cloudinary,
        imageData
      );
      console.log(cloudinaryResponse.data);
      const imageId = cloudinaryResponse.data.public_id;
      const requestBody = {
        ...formFields,
        image: imageId
      };
      console.log(requestBody);

      API.POST(API.ENDPOINTS.sightings, requestBody, API.getHeaders())
        .then(({ data }) => {
          console.log(data);
          console.log('created sighting!');
          navigate(`/birds/${formFields.bird_sighted}`);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
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
    // eslint-disable-next-line
  }, [markerPosition]);

  const handleSelect = (event) => {
    handleBirdSelectChange(event);
    handleTextChange(event);
  };

  const handleUseMetadataDateTime = async () => {};

  const handleDateTimeCheckbox = (event) => {
    setIsDateTimeInputDisabled(event.target.checked);
  };

  // ******************
  //#region UNCOMMENT FOR DEBUGGING
  useEffect(() => {
    console.log(isDateTimeInputDisabled);
  }, [isDateTimeInputDisabled]);
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
              {allBirds?.map((bird) => (
                <option key={bird.id} value={bird.id}>
                  {bird.name}
                </option>
              ))}
            </select>
            <label htmlFor='sighted-at-datetime'>Date & time seen:</label>
            <div className='datetime-wrapper'>
              <input
                id='sighted-at-datetime'
                name='sighted_at_datetime'
                type='datetime-local'
                onChange={handleTextChange}
                disabled={isDateTimeInputDisabled}
                required
              />
            </div>
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
            <div className='photo-upload-container'>
              <label htmlFor='sighting-photo-upload'>Upload a photo:</label>
              <input
                type='file'
                id='sighting-photo-upload'
                name='sighting-photo-upload'
                accept='image/png, image/jpeg'
                onChange={handleFileChange}
              ></input>
              {fileToUpload && (
                <>
                  <label htmlFor='datetime-metadata-checkbox'>
                    Use photo metadata for sighting timestamp?
                  </label>
                  <input
                    type='checkbox'
                    id='datetime-metadata-checkbox'
                    name='datetime-metadata-checkbox'
                    onChange={handleDateTimeCheckbox}
                    disabled={fileToUpload ? false : true}
                  />
                </>
              )}
              <p>
                <em>
                  This isn't required, but we encourage it as proof of the
                  sighting - and it's nicer for other users to look at!
                </em>
              </p>
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
