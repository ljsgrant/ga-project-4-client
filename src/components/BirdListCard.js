import '../styles/BirdListCard.scss';
import { Link } from 'react-router-dom';

export default function BirdListCard({ bird, setSingleBirdData }) {
  const handleMouseEnter = () => {
    setSingleBirdData(bird);
  };

  // const handleMouseLeave = () => {
  //   setSingleBirdData(null)
  // }
  return (
    <div className='BirdListCard' onMouseEnter={handleMouseEnter}>
      <Link className='Link' key={bird.id} to={`/birds/${bird.id}`}>
        <div className='bird-name-wrapper'>
          <p>{bird.name}</p>
        </div>
        <img src={bird.image} alt={bird.name} />
        <div className='sci-name-wrapper'>
          <p className='sci-name-text'>{bird.scientific_name}</p>
        </div>
      </Link>
    </div>
  );
}
