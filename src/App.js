import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';
import Login from './components/Login';
import Register from './components/Register';
import BirdDetails from './components/BirdDetails';
import NewSighting from './components/NewSighting';
import UserProfile from './components/UserProfile';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/:pk' element={<UserProfile />} />
          <Route path='/birds' element={<BirdList />} />
          <Route path='/birds/:pk' element={<BirdDetails />} />
          <Route path='/add-new-sighting' element={<NewSighting />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
