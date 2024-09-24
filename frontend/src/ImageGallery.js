import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch images on component mount
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/images`)
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
  
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData)
      .then((response) => {
        setImages((prevImages) => [...prevImages, response.data.image]); 
         })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };
  
  // Handle image deletion
  const deleteImage = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete it?");
  
    if (isConfirmed) {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete/${id}`)
        .then((response) => {
          // Update the state to remove the deleted image
          setImages((prevImages) => prevImages.filter((image) => image._id !== id));
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
        });
    }
  };
  
  return (
    <>
      <h2 className='text-center text-success mt-5'>Image Gallery</h2>
    <div className='container mt-5 text-center'>
      <form onSubmit={handleUpload}>
        <input type="file"
          className='form-input'
         onChange={handleFileChange}
            ref={fileInputRef} 
         />
        <button type="submit" className='btn btn-primary'>Upload</button>
      </form>

   <div className="gallery mt-5">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image._id} className="image-card">
              <img src={`${process.env.REACT_APP_BACKEND_URL}${image.imageUrl}`} alt={image.name} />
              <p>{image.name}</p>
              <button onClick={() => deleteImage(image._id)} className='w-100'>Delete</button>
            </div>
          ))
        ) : (
          <p className='text-danger fs-3'>No images found.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ImageGallery;
