import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';


function Overlay({setAddFlag}) {
    const [showOverlay, setShowOverlay] = useState(false);
    const [formData, setFormData] = useState({
      id: '',
      name: '',
      location: ''
    });
  
    const handleClick = () => {
      setShowOverlay(true);
    };
  
    const handleClose = () => {
      setShowOverlay(false);
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      setAddFlag(0)
      e.preventDefault();
      console.log(formData)
      // Sending a POST request to your backend server with the form data
      axios.post('http://localhost:4000/users', formData)
        .then(response => {
          console.log(response.data);
          setAddFlag(1)
          setFormData({
            id: '',
            name: '',
            location: ''
          });
          // Close the overlay
          setShowOverlay(false);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    };
  
    return (
        <div className="my-button-container">
        <button  className="my-button" onClick={handleClick}>Add User</button>
  
        {showOverlay && (
          <div className="overlay">
            <div className="form-container">
              <button className="close-button" onClick={handleClose}>&times;</button>
              <h2>Add User</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="id">ID:</label>
                  <input type="text" id="id" name="id" value={formData.id} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="location">Location:</label>
                  <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
        </div>
    );
  
}

export default Overlay;
