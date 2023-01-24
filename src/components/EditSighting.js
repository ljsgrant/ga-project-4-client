import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import '../styles/EditSighting.scss';
import '../styles/common/containerStyles.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { API } from '../lib/api';
import UserSightingPhoto from './common/UserSightingPhoto';
import PageMessage from './common/PageMessage';
import EXIF from 'exif-js';

export default function EditSighting() {
  const navigate = useNavigate();
  const [isLoggedIn] = useAuthenticated();
  const { id } = useParams();
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [markerPosition, setMarkerPosition] = useState({
    lat: 51.53606314086357,
    lng: -0.3515625
  });

  const [initialSightingData, setInitialSightingData] = useState(null);
  const [allBirds, setAllBirds] = useState(null);
  const [formFields, setFormFields] = useState({
    bird_sighted: '',
    sighted_at_datetime: '',
    location_lat: 0,
    location_long: 0,
    notes: '',
    image: ''
  });
  const [selectedBird, setSelectedBird] = useState('');
  const [fileToUpload, setFileToUpload] = useState('');
  const [isDateTimeInputDisabled, setIsDateTimeInputDisabled] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleSighting(id))
      .then(({ data }) => {
        setInitialSightingData(data);
        setFormFields({
          bird_sighted: data.bird_sighted.id,
          sighted_at_datetime:
            data.sighted_at_datetime.length > 16
              ? data.sighted_at_datetime.slice(0, 16)
              : data.sighted_at_datetime,
          location_lat: data.location_lat,
          location_long: data.location_long,
          notes: data.notes,
          image: data.image
        });
        setMarkerPosition({
          lat: data.location_lat,
          lng: data.location_long
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

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
        sighted_at_datetime: ''
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        const requestBody = {
          ...formFields,
          image: imageId
        };

        API.PUT(API.ENDPOINTS.singleSighting(id), requestBody, API.getHeaders())
          .then(({ data }) => {
            console.log(data);
            console.log('edited sighting!');
            navigate(`/birds/${formFields.bird_sighted}`);
          })
          .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(formFields);
      API.PUT(API.ENDPOINTS.singleSighting(id), formFields, API.getHeaders())
        .then(({ data }) => {
          console.log(data);
          console.log('edited sighting!');
          navigate(`/birds/${formFields.bird_sighted}`);
        })
        .catch((error) => console.error(error));
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

  const handleEditingPhotoToggle = () => {
    setIsEditingPhoto(!isEditingPhoto);
  };

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
                  value={formFields.bird_sighted && formFields.bird_sighted}
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
                    value={
                      formFields.sighted_at_datetime &&
                      formFields.sighted_at_datetime
                    }
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
                  value={formFields.location_lat && formFields.location_lat}
                  required
                />
                <label htmlFor='long'>Longitude:</label>
                <input
                  id='long'
                  name='lng'
                  onChange={handleLatLongTextChange}
                  value={formFields.location_long && formFields.location_long}
                  required
                />
              </div>
              <div className='photo-upload-container container-style-all container-style-column'>
                <div>
                  {isEditingPhoto ? (
                    <>
                      {' '}
                      <label htmlFor='sighting-photo-upload'>
                        Photo Upload
                      </label>
                      <input
                        type='file'
                        id='sighting-photo-upload'
                        name='sighting-photo-upload'
                        accept='image/png, image/jpeg, image/tiff'
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      ></input>
                    </>
                  ) : (
                    <>
                      <div className='old-photo'>
                        <UserSightingPhoto
                          cloudinaryImageId={initialSightingData?.image}
                        />
                      </div>
                      <button type='button' onClick={handleEditingPhotoToggle}>
                        Change photo
                      </button>
                    </>
                  )}
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
              </div>
              <div className='container-style-all container-style-column'>
                <label htmlFor='notes'>
                  <h3>Notes</h3>
                </label>
                <textarea
                  id='notes'
                  name='notes'
                  onChange={handleTextChange}
                  value={formFields.notes && formFields.notes}
                  required
                />
              </div>
              <div className='container-style-all container-style-bot'>
                <button type='submit'>Update Sighting</button>
              </div>
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
  } else {
    return (
      <PageMessage
        title={'Oops'}
        text={'You need to be logged in to do this!'}
      />
    );
  }
}
