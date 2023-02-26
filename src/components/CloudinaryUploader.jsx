import { Box, Button, TextField } from "@mui/material";
import React, { useState } from 'react';
import { Image } from 'cloudinary-react';
import { useDispatch } from 'react-redux';
import { confirmationClick } from '../store/CloudinaryUploaderSlice/slice';
import { useSelector } from "react-redux/es/hooks/useSelector";

const CloudinaryUploader = () => {
  const urlUploaded = useSelector((state) => state.uploadImageStore.url)
  
  const dispatch = useDispatch();

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [fileUpload, setFileUpload] = useState(new File([""], ""))

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileUpload(file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    setIsConfirmed(true);
  };

  const handleConfirmationClick = (event) => {
    event.preventDefault();
    setIsConfirmed(false);
    const formData = new FormData();
    formData.append('file', fileUpload);
    formData.append('upload_preset', `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`);
    try {
      dispatch(confirmationClick(formData))

    } catch (error) {
      console.log('Error uploading image to Cloudinary: ', error);
    }
    setImagePreviewUrl("");
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" height="300px">
      <Box display="flex" justifyContent="space-between" flexDirection="column" gap="10px">
        <TextField type="file" variant="filled" onChange={handleFileInputChange} />
        {isConfirmed && <Button variant="contained" color="secondary" onClick={handleConfirmationClick}>Confirm And Upload</Button> }
      </Box>
      <Box>
        {imagePreviewUrl && <img width={200} height={200} src={imagePreviewUrl} alt="preview" />}
        {urlUploaded && <Image width={200} height={200} cloudName="YOUR_CLOUD_NAME" publicId={urlUploaded} />}
      </Box>
    </Box>
  );
};

export default CloudinaryUploader;