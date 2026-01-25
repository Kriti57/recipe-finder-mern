import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {register as registerService} from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

const RegisterPage =() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    if (error) setError(null);
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,
      //e.target.value` is a "computed property name" that dynamically sets the key (e.g., 'name', 'email', 'password') and updates its value
    });
  };

  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior, which causes a page reload.
    e.preventDefault();
    setError(null);

    try {
      const data = await registerService(formData);
      console.log('Registration Successful!', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        
        login({
          id: data._id,
          name: data.name,
          email: data.email,
        });

        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
           />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;