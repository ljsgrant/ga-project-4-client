

export default function MapPopup() {
  return (
    <Popup>
      <div className='map-popup-content'>
        <p>
          Seen by{' '}
          <Link to={`/user/${sighting.owner.id}`}>
            {sighting.owner.username}
          </Link>
        </p>
        <p>at {sighting.sighted_at_datetime}.</p>
        <UserSightingPhoto
          className='UserSightingPhoto'
          cloudinaryImageId={sighting.image}
          imageWidth={180}
          imageHeight={180}
        />
      </div>
      <button value={sighting.id} onClick={handleOpenSightingModal}>
        View sighting details
      </button>
    </Popup>
  );
}
