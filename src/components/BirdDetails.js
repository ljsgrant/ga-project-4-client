import '../styles/BirdDetails.scss';

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { API } from '../lib/api';

export default function BirdDetails() {
  const { pk } = useParams();
  const [birdData, setBirdData] = useState(null);

  console.log(pk);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleBird(pk))
      .then(({ data }) => setBirdData(data))
      .catch((err) => console.error(err));
  }, [pk]);

  useEffect(() => {
    console.log(birdData);
  }, [birdData]);

  return (
    <div className='BirdDetails'>
      <div className='left-column'>
        <h2>{birdData?.name}</h2>
        <div className='hero-image-container'>
          <img
            className='hero-image'
            src={birdData?.image}
            alt={birdData?.name}
          />
        </div>
        <p>{birdData?.description}</p>
      </div>
      <div className='right-column'>
        <p>This is the right column</p>
      </div>
    </div>
  );
}
