import '../styles/BirdDetails.scss';
import 'leaflet/dist/leaflet.css';
import '../styles/common/containerStyles.scss';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { DefaultMarkerIcon } from './common/DefaultMarkerIcon';
import MapPopup from './common/MapPopup';
import { API } from '../lib/api';

export default function BirdDetails({
  setSightingIdForModal,
  setIsSightingModalOpen,
  isBirdDataUpdated,
  setIsBirdDataUpdated
}) {
  const { pk } = useParams();
  const [birdData, setBirdData] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [filters, setFilters] = useState({
    forBirdId: '',
    byMySightings: false,
    dateFrom: '',
    dateTo: '',
    timeFrom: '',
    timeTo: ''
  });
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);

  const successCallback = (position) => {
    setMapCenter([position.coords.latitude, position.coords.longitude]);
    console.log('Setting center of the map to your location');
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  useMemo(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleBird(pk))
      .then(({ data }) => {
        setBirdData(data);
      })
      .catch((err) => console.error(err));
    setIsBirdDataUpdated(false);
    // eslint-disable-next-line
  }, [pk, isBirdDataUpdated]);

  const handleTimeDateFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleMySightingFilterChange = (event) => {
    setFilters({ ...filters, byMySightings: event.target.checked });
  };

  const handleApplyFilters = () => {
    API.POST(
      API.ENDPOINTS.filterBirdSightings,
      { ...filters, forBirdId: pk },
      API.getHeaders()
    )
      .then(({ data }) => {
        setBirdData(data);
        setAreFiltersApplied(true);
      })
      .catch((err) => console.error(err));
  };

  const handleRemoveFilters = () => {
    setFilters({
      forBirdId: '',
      byMySightings: false,
      dateFrom: '',
      dateTo: '',
      timeFrom: '',
      timeTo: ''
    });

    API.GET(API.ENDPOINTS.singleBird(pk))
      .then(({ data }) => {
        setBirdData(data);
        setAreFiltersApplied(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    console.log(birdData);
  }, [birdData]);

  return (
    <>
      <div className='BirdDetails'>
        <div className='left-column'>
          <div className='title-container'>
            <h2>{birdData?.name}</h2>
            {birdData && (
              <h3>
                (
                <span className='scientific-name'>
                  {birdData?.scientific_name}
                </span>
                )
              </h3>
            )}
          </div>
          <div className='hero-image-container photo-container-style'>
            <img
              className='hero-image'
              src={birdData?.image}
              alt={birdData?.name}
            />
          </div>
          <div className='info-text-container'>
            <h4>Description</h4>
            <p>{birdData?.description}</p>
          </div>
        </div>
        <div className='right-column'>
          <div className='map-header '>
            <h3>User sightings of the {birdData?.name}</h3>
          </div>
          <div className='map-filters'>
            <label htmlFor='user-sightings-checkbox'>My sightings only</label>
            <input
              id='user-sightings-checkbox'
              className='checkbox'
              type='checkbox'
              disabled={areFiltersApplied}
              checked={filters.byMySightings}
              onChange={handleMySightingFilterChange}
            />
            <p>Sightings from:</p>
            <input
              name='dateFrom'
              disabled={areFiltersApplied}
              value={filters.dateFrom}
              onChange={handleTimeDateFilterChange}
              type='date'
            />
            <p>until:</p>
            <input
              name='dateTo'
              disabled={areFiltersApplied}
              value={filters.dateTo}
              onChange={handleTimeDateFilterChange}
              type='date'
            />
          </div>
          <div className='map-filters'>
            <p>Sightings between:</p>
            <input
              name='timeFrom'
              disabled={areFiltersApplied}
              value={filters.timeFrom}
              onChange={handleTimeDateFilterChange}
              type='time'
            />
            <p>and:</p>
            <input
              name='timeTo'
              disabled={areFiltersApplied}
              value={filters.timeTo}
              onChange={handleTimeDateFilterChange}
              type='time'
            />
            <button onClick={handleApplyFilters} disabled={areFiltersApplied}>
              Apply
            </button>
            <button onClick={handleRemoveFilters} disabled={!areFiltersApplied}>
              Clear All
            </button>
          </div>
          <MapContainer
            center={mapCenter ? mapCenter : [51.505, -0.09]}
            zoom={5}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {birdData?.sightings?.map((sighting) => (
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
            {birdData?.sightings.length < 1 && (
              <p className='no-sightings-message'>No sightings yet!</p>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
