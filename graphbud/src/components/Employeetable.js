import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Overlay from './Overlay';

function Employeetable() {
  const [users, setUsers] = useState([]);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [addFlag, setAddFlag] = useState(0)
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    location: ''
  });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [flag, setFlag] = useState(0)
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    axios.get('http://localhost:4000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [flag, addFlag]); 

  const handleEdit = (id) => {
    // Fetch the user data by id and set it in the edit form state
    const userToEdit = users.find(user => user.id === id);
    setEditFormData({
      id: userToEdit.id,
      name: userToEdit.name,
      location: userToEdit.location
    });
    // Show the edit overlay
    setShowEditOverlay(true);
  };

  const handleDelete = (id) => {
    // Set the id of the user to be deleted
    setDeleteUserId(id);
    
    console.log(`Delete user with id: ${id}`);
  };

  const handleCloseEditOverlay = () => {
    // Close the edit overlay and reset the edit form data
    setShowEditOverlay(false);
    setEditFormData({
      id: '',
      name: '',
      location: ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = (e) => {
    setFlag(0)
    e.preventDefault();
    axios.put(`http://localhost:4000/users/${editFormData.id}`, editFormData)
        .then(response => {
          console.log(response.data);
          setFlag(1)
          handleCloseEditOverlay()
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    console.log('Edit form data submitted:', editFormData);
  };

  const handleDeleteConfirm = () => {
    setFlag(0)
    axios.delete(`http://localhost:4000/users/${deleteUserId}`)
        .then(response => {
          console.log(response.data);
          setDeleteUserId("")
          setFlag(1)
          setShowEditOverlay(false);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });
    console.log(`Confirmed delete user with id: ${deleteUserId}`);
    // Close the delete confirmation or perform any other cleanup
    setDeleteUserId(null);
  };

  const handleDeleteCancel = () => {
    // Reset the delete user id
    setDeleteUserId(null);
  };

  return (
    <div>
      <Overlay setAddFlag={setAddFlag}/>
      <Table striped>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.location}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(data.id)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showEditOverlay && (
        <div className="overlay">
          <div className="form-container">
            <button className="close-button" onClick={handleCloseEditOverlay}>&times;</button>
            <h2>Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label htmlFor="id">ID:</label>
                <input type="text" id="id" name="id" value={editFormData.id} onChange={handleEditInputChange} />
              </div>
              <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={editFormData.name} onChange={handleEditInputChange} />
              </div>
              <div>
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" value={editFormData.location} onChange={handleEditInputChange} />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {deleteUserId && (
        <div className="overlay">
          <div className="confirmation-container">
            <p>Are you sure you want to delete this user?</p>
            <button onClick={handleDeleteConfirm}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employeetable;
