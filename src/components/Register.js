import '../styles/Login.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../lib/api';
import { AUTH } from '../lib/auth';

export default function Register() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    profile_picture: '',
    password: '',
    password_confirmation: ''
  });

  const handleTextChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    console.log(formFields);
  }, [formFields]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.POST(API.ENDPOINTS.register, formFields);

      const loginData = await API.POST(API.ENDPOINTS.login, {
        email: formFields.email,
        password: formFields.password
      });

      AUTH.setToken(loginData.data.token);

      console.log(`Logged you in, ${formFields.username}`);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='Login'>
      <form className='login-form' onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='text'
          onChange={handleTextChange}
          required
        />
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          onChange={handleTextChange}
          required
        />
        <label htmlFor='first-name'>First Name</label>
        <input
          id='first-name'
          name='first_name'
          type='text'
          onChange={handleTextChange}
          required
        />
        <label htmlFor='last-name'>Last Name</label>
        <input
          id='last-name'
          name='last_name'
          type='text'
          onChange={handleTextChange}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          onChange={handleTextChange}
          required
        />
        <label htmlFor='password-confirmation'>Confirm Password</label>
        <input
          id='password-confirmation'
          name='password_confirmation'
          type='password'
          onChange={handleTextChange}
          required
        />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}
