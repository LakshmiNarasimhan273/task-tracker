import React, { useState } from 'react';
import { TextField, MenuItem, FormControl, Select, InputLabel, Container, Typography, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient'; // Axios instance
import Button from '../../components/Button/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      toast.error('All fields are required!');
      return; // Prevent form submission if fields are empty
    }

    try {
      await apiClient.post('http://localhost:3001/api/user/register', formData);
      toast.success('Registration successful!');
      setFormData({ username: '', email: '', password: '', role: '' });
      console.log(formData);
      
    } catch (error) {
      toast.error('Registration failed!');
      console.error(error);
      
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        TaskTracker
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              // required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              // required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              // required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="team-lead">Team Lead</MenuItem>
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="tester">Tester</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" bgColor="blue">Register</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Register;
