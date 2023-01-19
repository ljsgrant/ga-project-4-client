import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';

function App() {
  axios
    .get('/api/birds/')
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => console.error(err));

  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/birds' element={<BirdList/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
