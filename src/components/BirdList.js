import '../styles/BirdList.scss';
import { API } from '../lib/api';
import { useState, useEffect } from 'react';
import BirdListCard from './BirdListCard';

export default function BirdList() {
  const [birdData, setBirdData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className='title-container'>
        <h2>Browse All Birds</h2>
      </div>
      <div className='content-container'>
        <div className='search-container'>
          <label htmlFor="search-filter-birds">Search birds: </label>
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
            <h3>Bird Name</h3>
            <h3>Latin Name</h3>
          </div>
          {birdData?.map((bird) => (
            <BirdListCard key={bird.id} bird={bird} />
          ))}
        </div>
      </div>
    </div>
  );
}
