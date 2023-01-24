import './styles/FontStyles.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';
import Login from './components/Login';
import Register from './components/Register';
import BirdDetails from './components/BirdDetails';
import NewSighting from './components/NewSighting';
import UserProfile from './components/UserProfile';
import AdminControls from './components/AdminControls';
import NewBird from './components/NewBird';
import PageTitle from './components/common/PageTitle';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route
            path='/admin'
            element={
              <PageTitle
                titleText={'Admin Controls'}
                content={<AdminControls />}
              ></PageTitle>
            }
          />
          <Route path='/admin/new-bird' element={<NewBird />} />
          <Route
            path='/login'
            element={
              <PageTitle titleText={'Log In'} content={<Login />}></PageTitle>
            }
          />
          <Route path='/register' element={<Register />} />
          <Route path='/user/:pk' element={<UserProfile />} />
          <Route
            path='/birds'
            element={
              <PageTitle titleText={'Birds'} content={<BirdList />}></PageTitle>
            }
          />
          <Route path='/birds/:pk' element={<BirdDetails />} />
          <Route
            path='/add-new-sighting'
            element={
              <PageTitle
                titleText={'New Sighting'}
                content={<NewSighting />}
              ></PageTitle>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
