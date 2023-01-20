import '../styles/Login.scss';

import { useState } from 'react';

export default function Register() {
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: ''
  });

  const handleTextChange = (event) => {};

  const handleSubmit = (event) => {};

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
