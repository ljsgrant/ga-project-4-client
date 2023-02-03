import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import '../styles/common/containerStyles.scss';
import '../styles/common/buttonStyles.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import PageMessage from './common/PageMessage';
import { API } from '../lib/api';
import EXIF from 'exif-js';

export default function NewSighting() {
  const navigate = useNavigate();
  const [isLoggedIn] = useAuthenticated();
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 51.53606314086357,
    lng: -0.3515625
  });

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

  const handleDateTimeCheckbox = (event) => {
    setIsDateTimeInputDisabled(event.target.checked);

    const fileInput = fileInputRef.current;
    if (event.target.checked && fileInput.files[0]) {
      EXIF.getData(fileInput.files[0], function () {
        const metadataTimestamp = EXIF.getAllTags(this).DateTime;

        //format timestamp to match data from date/time input
        const dateTimeArray = metadataTimestamp.split(' ');
        dateTimeArray[0] = dateTimeArray[0].replaceAll(':', '-');
        dateTimeArray[1] = dateTimeArray[1].split(':');
        dateTimeArray[1].splice(2);
        dateTimeArray[1] = dateTimeArray[1].join(':');
        const dataFormatTimestamp = dateTimeArray.join('T');
        setFormFields({
          ...formFields,
          sighted_at_datetime: dataFormatTimestamp
        });
      });
    } else {
      setFormFields({
        ...formFields,
        sighted_at_datetime: null
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let requestBody;
    if (fileToUpload) {
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
        requestBody = {
          ...formFields,
          image: imageId
        };
        console.log(requestBody);
      } catch (error) {
        console.error(error);
      }
    } else {
      requestBody = {
        ...formFields
      };
    }

    API.POST(API.ENDPOINTS.sightings, requestBody, API.getHeaders())
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
    // eslint-disable-next-line
  }, [markerPosition]);

  const handleSelect = (event) => {
    handleBirdSelectChange(event);
    handleTextChange(event);
  };

  useEffect(() => {
    console.log(formFields);
  }, [formFields]);

  if (isLoggedIn) {
    return (
      <>
        <div className='NewSighting'>
          <div className='left-column'>
            <form className='sighting-form' onSubmit={handleSubmit}>
              <div className='container-style-all container-style-top'>
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
              </div>
              <div className='datetime-wrapper container-style-all'>
                <label htmlFor='sighted-at-datetime'>Date & time seen:</label>
                {isDateTimeInputDisabled ? (
                  <p>
                    {formFields.sighted_at_datetime &&
                      formFields.sighted_at_datetime
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('/') +
                        ' at ' +
                        formFields.sighted_at_datetime.split('T')[1]}
                  </p>
                ) : (
                  <input
                    id='sighted-at-datetime'
                    name='sighted_at_datetime'
                    type='datetime-local'
                    onChange={handleTextChange}
                    disabled={isDateTimeInputDisabled}
                    required
                  />
                )}
              </div>
              <div className='lat-long-inputs container-style-all container-style-mid'>
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
              <div className='photo-upload-container container-style-all container-style-column'>
                <div>
                  <label htmlFor='sighting-photo-upload'>
                    <h3>Upload photo:</h3>
                  </label>
                  <input
                    type='file'
                    id='sighting-photo-upload'
                    name='sighting-photo-upload'
                    accept='image/png, image/jpeg, image/tiff'
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  ></input>
                </div>
                {fileToUpload && (
                  <div>
                    <label htmlFor='datetime-metadata-checkbox'>
                      Use JPEG metadata for sighting timestamp?
                    </label>
                    <input
                      type='checkbox'
                      id='datetime-metadata-checkbox'
                      name='datetime-metadata-checkbox'
                      onChange={handleDateTimeCheckbox}
                    />
                  </div>
                )}
                <p>
                  (
                  <em>
                    This isn't required, but we encourage it as proof of the
                    sighting - and it's nicer for other users to look at!
                  </em>
                  )
                </p>
              </div>
              <div className='container-style-all container-style-column'>
                <label htmlFor='notes'>
                  <h3>Notes</h3>
                </label>
                <textarea
                  id='notes'
                  name='notes'
                  onChange={handleTextChange}
                  required
                />
              </div>
              <div className='container-style-all container-style-bot'>
                <div className='button-wrapper'>
                  <button className='button-style-1' type='submit'>
                    Post this sighting
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className='right-column'>
            <div className='map-header'>
              <p>Drag the marker on the map to set sighting location</p>
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
  } else {
    return (
      <PageMessage
        title={'Oops'}
        text={'You need to be logged in to do this!'}
      />
    );
  }
}
