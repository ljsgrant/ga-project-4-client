import '../styles/Login.scss';

import { useState } from 'react';

export default function Login() {
  const [formFields, setFormFields] = useState()

  const handleChange = (event) => {

  }

  return (
    <div className='Login'>
      <div className='login-form-container'>
        <input
          id='email'
          name='email'
          label='Email'
          type='email'
          variant='standard'
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
}
