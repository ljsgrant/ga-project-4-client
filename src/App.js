import './styles/FontStyles.scss';
import './styles/App.scss';
import './styles/ViewSingleSightingModal.scss';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdList from './components/BirdList';
import Login from './components/Login';
import Register from './components/Register';
import BirdDetails from './components/BirdDetails';
import NewSighting from './components/NewSighting';
import EditSighting from './components/EditSighting';
import UserProfile from './components/UserProfile';
import AdminControls from './components/admin/AdminControls';
import NewBird from './components/admin/NewBird';
import PageTitle from './components/common/PageTitle';
import ViewSingleSightingModal from './components/ViewSingleSightingModal';
import Landing from './components/Landing';

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  const [isSightingModalOpen, setIsSightingModalOpen] = useState(false);
  const [sightingIdForModal, setSightingIdForModal] = useState(null);
  const [isBirdDataUpdated, setIsBirdDataUpdated] = useState(false);

  return (
    <div id='app'>
      <Router>
        {isSightingModalOpen && (
          <ViewSingleSightingModal
            sightingId={sightingIdForModal}
            setIsModalOpen={setIsSightingModalOpen}
            setIsBirdDataUpdated={setIsBirdDataUpdated}
          />
        )}
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route
            path='/admin'
            element={<PageTitle content={<AdminControls />}></PageTitle>}
          />
          <Route path='/admin/new-bird' element={<NewBird />} />
          <Route
            path='/login'
            element={
              <PageTitle titleText={'Log In'} content={<Login />}></PageTitle>
            }
          />
          <Route
            path='/register'
            element={
              <PageTitle
                titleText={'Register'}
                content={<Register />}
              ></PageTitle>
            }
          />
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
                    isBirdDataUpdated={isBirdDataUpdated}
                    setIsBirdDataUpdated={setIsBirdDataUpdated}
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
          <Route
            path='/edit-sighting/:id'
            element={
              <PageTitle
                titleText={'Edit Sighting'}
                content={<EditSighting />}
              ></PageTitle>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
