import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../lib/api';

export default function UserProfile() {
  const { pk } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    API.GET(API.ENDPOINTS.singleUser(pk))
      .then(({ data }) => setUserData(data))
      .catch((err) => console.error(err));
  }, [pk]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return <p>User profile for user: {pk}</p>;
}
