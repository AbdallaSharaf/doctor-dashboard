import axios from 'axios';

// Set your Cloudinary upload preset and cloud name here
const cloudName = 'dst7k6hj5';
const uploadPreset = 'doctor-dashboard'; // set this in your Cloudinary settings

/**
 * Uploads a photo to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise} - Returns a promise that resolves with the upload response.
 */
export const uploadPhotoToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};
