import './styles/FontStyles.scss';
import './styles/App.scss'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './styles/ViewSingleSightingModal.scss';
import ViewSingleSightingModal from './components/ViewSingleSightingModal';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
  const [sightingIdForModal, setSightingIdForModal] = useState(null);

  return (
    <div id='app'>
      <Router>
        {isSightingModalOpen && (
          <ViewSingleSightingModal
            sightingId={sightingIdForModal}
            setIsModalOpen={setIsSightingModalOpen}
          />
        )}
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
          <Route
            path='/birds/:pk'
            element={
              <PageTitle
                content={
                  <BirdDetails
                    setIsSightingModalOpen={setIsSightingModalOpen}
                    setSightingIdForModal={setSightingIdForModal}
                  />
                }
              ></PageTitle>
            }
          />
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
