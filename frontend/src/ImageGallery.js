import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch images on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/images')
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  
  // Handle image upload
  const fileInputRef = useRef(null);
  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('No file selected!');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', selectedFile);
  
    axios.post('http://localhost:5000/api/upload', formData)
      .then((response) => {
        setImages((prevImages) => [...prevImages, response.data.image]); // Add new image to the state
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  
    // Optionally reset the file input after the upload
    setSelectedFile(null);
    fileInputRef.current.value = "";
    // document.getElementById('file-input').value = '';  // Clear the file input
  };
  
  // Handle image deletion
  const deleteImage = (id) => {
    axios.delete(`http://localhost:5000/api/delete/${id}`)
      .then((response) => {
        setImages(images.filter(image => image._id !== id)); // Remove deleted image from state
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  return (
    <div className='container mt-3'>
      {/* Image upload form */}
      <form onSubmit={handleUpload}>
        <input type="file"
          className='form-input'
         onChange={handleFileChange}
            ref={fileInputRef}  // Set ref to the file input
        //  required
         />
        <button type="submit" className='btn btn-primary'>Upload</button>
      </form>

      {/* Image gallery */}
   <div className="gallery mt-5">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image._id} className="image-card">
              <img src={`http://localhost:5000${image.imageUrl}`} alt={image.name} />
              <p>{image.name}</p>
              <button onClick={() => deleteImage(image._id)} className='btn btn-danger w-100'>Delete</button>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
