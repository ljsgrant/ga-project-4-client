import '../styles/NewSighting.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../lib/api';

export default function NewSighting() {
  const [allBirds, setAllBirds] = useState(null);
  const [selectedBird, setSelectedBird] = useState("");

  const handleTextChange = (event) => {};

  const handleBirdSelectChange = (event) => {
    setSelectedBird(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    API.GET(API.ENDPOINTS.allBirds)
      .then(({ data }) => setAllBirds(data))
      .catch((err) => console.error(err));
  }, []);

  // ******************
  // DEBUGGING
  useEffect(() => {
    console.log(allBirds);
  }, [allBirds]);

  useEffect(() => {
    console.log(selectedBird);
  }, [selectedBird]);
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
              onChange={handleBirdSelectChange}
            >
              {allBirds?.map((bird) => (
                <option key={bird.id} value={bird.id}>
                  {bird.name}
                </option>
              ))}
            </select>
            <label htmlFor='sighted-at-datetime'>Date & time seen:</label>
            <input
              id='sighted-at-datetime'
              name='sighted_at_datetime'
              type='datetime-local'
              onChange={handleTextChange}
              required
            />

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
        <div className='right-column'></div>
      </div>
    </>
  );
}
