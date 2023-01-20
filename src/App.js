import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';

function App() {
  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/birds' element={<BirdList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
