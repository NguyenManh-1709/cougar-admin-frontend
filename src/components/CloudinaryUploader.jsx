import { Box, Button, TextField } from "@mui/material";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmationClick } from '../store/CloudinaryUploader/slice';
import AvatarEditor from 'react-avatar-editor';

const CloudinaryUploader = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [errorFile, setErrorFile] = useState();

  function handleFileChange(event) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (event.target.files[0] && allowedTypes.includes(event.target.files[0].type)) {
      setFile(event.target.files[0]);
      setErrorFile("");
    } else {
      event.target.value = "";
      setErrorFile("Please choose an image file! .JPG or .PNG");
    }
  }

  function handleScaleChange(event) {
    setScale(parseFloat(event.target.value));
  }

  function handlePositionChange(position) {
    setPosition(position);
  }

  function handleSave() {
    if (editor) {
      const canvas = editor.getImage();
      const dataURL = canvas.toDataURL();
      try {
        dispatch(confirmationClick(dataURL))
      } catch (error) {
        console.log('Error uploading image to Cloudinary: ', error);
      }
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" flexDirection="column" gap="10px">
        <AvatarEditor
          ref={setEditor}
          image={file}
          width={300}
          height={300}
          border={25}
          color={[180,180,180]}
          borderRadius={360}
          scale={scale}
          position={position}
          onPositionChange={handlePositionChange}
        />
        {errorFile && <h3 style={{background: "#B4B4B4", color: "#8B0000", textAlign: "center", padding: "2px"}}>{errorFile}</h3>}
        <TextField type="file" variant="outlined" onChange={handleFileChange} style={{ width: "350px" }} />
        <TextField type="range" variant="outlined" min="1" max="1.1" step="0.1" value={scale} onChange={handleScaleChange} style={{ width: "350px" }} />
        {file && <Button variant="contained" style={{ background: "#1F2A40", color: "white", width: "350px" }} onClick={handleSave}>Confirm And Upload</Button>}
      </Box>
    </Box>
  );
};

export default CloudinaryUploader;