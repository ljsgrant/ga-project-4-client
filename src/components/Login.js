import '../styles/Login.scss';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      API.POST(API.ENDPOINTS.login, formFields).then(({ data }) => {
        console.log(data.message);
        AUTH.setToken(data.token);
        navigate('/birds');
        console.log('Logged in successfully');
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(formFields);
  }, [formFields]);

  return (
    <div className='Login'>
      <form className='login-form' onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          onChange={handleChange}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          onChange={handleChange}
          required
        />
        <button type='submit'>Log In</button>
        Not registered? <Link to='/register'>Sign up here</Link>.
      </form>
    </div>
  );
}
