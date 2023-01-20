import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/birds' element={<BirdList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
