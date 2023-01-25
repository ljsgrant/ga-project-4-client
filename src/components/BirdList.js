import '../styles/BirdList.scss';
import '../styles/common/containerStyles.scss';
import { API } from '../lib/api';
import { useState, useEffect } from 'react';
import BirdListCard from './BirdListCard';
import { Link } from 'react-router-dom';

export default function BirdList() {
  const [birdData, setBirdData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [singleBirdData, setSingleBirdData] = useState(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.allBirds)
      .then(({ data }) => {
        setBirdData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    API.POST(API.ENDPOINTS.searchBirds, { searchTerm }, API.getHeaders)
      .then(({ data }) => {
        setBirdData(data);
      })
      .catch((err) => console.error(err));
  }, [searchTerm]);

  return (
    <div className='BirdList'>
      <div className='left-column'>
        <div className='title-container'>
          <h2>Browse All</h2>
        </div>
        <div className='content-container'>
          <div className='search-container'>
            <label htmlFor='search-filter-birds'>Search birds: </label>
            <input
              id='search-filter-birds'
              type='text'
              value={searchTerm}
              onChange={handleSearch}
              className='search-input'
            />
          </div>
          <div className='list-container'>
            <div className='list-headers'>
              <h3>Common Name</h3>
              <h3>Latin Name</h3>
            </div>
            {birdData?.map((bird) => (
              <BirdListCard
                setSingleBirdData={setSingleBirdData}
                key={bird.id}
                bird={bird}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='right-column'>
        <div className='bird-name-container'>
          <div className='bird-names'>
            {singleBirdData && (
              <>
                <h2>{singleBirdData?.name}</h2>
                <h3>
                  (<em>{singleBirdData?.scientific_name}</em>)
                </h3>
              </>
            )}
          </div>

          {singleBirdData && (
            <Link
              className='view-sightings-link'
              to={`/birds/${singleBirdData?.id}`}
            >
              <p className='sightings-link-text'>View Sightings</p>
              <p className='sightings-link-icon'>&#8658;</p>
            </Link>
          )}
        </div>
        <div className='image-container'>
          {singleBirdData && (
            <img
              className='bird-image'
              src={singleBirdData?.image}
              alt={singleBirdData.name}
            />
          )}
        </div>

        <div className='info-container'>
          <p>{singleBirdData?.description}</p>
        </div>
      </div>
    </div>
  );
}
