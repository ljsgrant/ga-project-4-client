import 'leaflet/dist/leaflet.css';
import '../styles/NewSighting.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import { API } from '../lib/api';
import EXIF from 'exif-js';

export default function NewSighting() {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    bird_sighted: null,
    sighted_at_datetime: null,
    location_lat: 0,
    location_long: 0,
    notes: '',
    image: ''
  });

  const handleTextChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    API.POST(API.ENDPOINTS.sightings, formFields, API.getHeaders())
      .then(({ data }) => {
        console.log(data);
        console.log('created sighting!');
        navigate(`/birds/${formFields.bird_sighted}`);
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className='NewSighting'>
        <div className='left-column'>
          <h2>New Sighting</h2>
          <form className='sighting-form' onSubmit={handleSubmit}>
            <label htmlFor='common-name'>Common Name</label>
            <input
              type='text'
              id='common-name'
              name='name'
              onChange={handleTextChange}
              required
            />
            <label htmlFor='scientific-name'>Scientific Name</label>
            <input
              type='text'
              id='scientific-name'
              name='scientific_name'
              onChange={handleTextChange}
              required
            />
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              name='description'
              onChange={handleTextChange}
              required
            />
            <label htmlFor='image'>Image URL</label>
            <textarea
              id='image'
              name='image'
              onChange={handleTextChange}
              required
            />
            <button type='submit'>Add bird to database</button>
          </form>
        </div>
        <div className='right-column'></div>
      </div>
    </>
  );
}
