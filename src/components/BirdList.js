import { API } from '../lib/api';
import { useState, useEffect } from 'react';

export default function BirdList() {
  const [birdData, setBirdData] = useState(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.allBirds)
      .then(({ data }) => {
        setBirdData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className='BirdList'>
      {birdData?.map((bird) => (
        <p key={bird.id}>{bird.name}</p>
      ))}
    </div>
  );
}
