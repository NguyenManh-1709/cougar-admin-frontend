import { Box, Button, Slider, TextField } from "@mui/material";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmationClick } from '../store/CloudinaryUploader/slice';
import AvatarEditor from 'react-avatar-editor';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
          color={[180,180,180,0.5]}
          borderRadius={360}
          scale={scale}
          position={position}
          onPositionChange={handlePositionChange}
        />
        {errorFile && <h3 style={{background: "#B4B4B4", color: "#8B0000", textAlign: "center", padding: "2px"}}>{errorFile}</h3>}
        <TextField type="file" variant="outlined" onChange={handleFileChange} style={{ width: "350px" }} />
        <Box display="flex" alignItems="center" gap="10px" style={{ width: "350px" }}>
          <RemoveCircleOutlineIcon onClick={() => {setScale(((scale - 0.05)<0.5) ? 0.5 : (scale - 0.05))}} style={{cursor: "pointer"}}/>
          <Slider value={scale} onChange={handleScaleChange} min={0.5} max={2} step={0.01}  color="success"/>
          <AddCircleOutlineIcon onClick={() => {setScale(((scale + 0.05)>2 ? 2 : (scale + 0.05)))}} style={{cursor: "pointer"}}/>
        </Box>
        {file && <Button variant="contained" style={{ background: "#1F2A40", color: "white", width: "350px" }} onClick={handleSave}>Confirm And Upload</Button>}
      </Box>
    </Box>
  );
};

export default CloudinaryUploader;