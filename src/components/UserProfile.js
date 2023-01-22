import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const { userId } = useParams();

  useEffect(() => {}, []);

  return <p>User profile for user: {userId}</p>;
}
