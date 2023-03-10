import { Box, Button, Slider, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { uploadAvatarToCloud, userPost, userPut } from "../../store/apis";
import { useParams } from 'react-router-dom';
import { usersWithRolesState, urlAvatarUploadedState } from "../../store/selectors";
import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const FormCreateUser = () => {
  const { id } = useParams();
  const idTypeNumber = +id;
  const navigate = useNavigate();

  const usersWithRoles = useSelector(usersWithRolesState);

  const initialValues = {
    id: "",
    password: "",
    fullname: "",
    phone: "",
    email: "",
    createDate: new Date().toISOString().split('T')[0],
    avatar: "",
    resetPasswordToken: "",
  }

  const userSelected = (idTypeNumber === 0) ? initialValues : (() => {
    const temp = usersWithRoles.filter(item => item.id === idTypeNumber)[0];
    if (temp && temp !== undefined) {
      const { role, ...userWithoutRole } = temp;
      return userWithoutRole;
    }
    return initialValues;
  })();


  // UPLOAD AVATAR
  const dispatch = useDispatch();

  const [file, setFile] = useState(() => { return (userSelected.avatar === "" ? null : `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${userSelected.avatar}`) });
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [errorFile, setErrorFile] = useState();
  const [avatarChangedStatus, setAvatarChangedStatus] = useState(false);

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

  function handleUploadAvatarToCloud() {
    if (editor) {
      const canvas = editor.getImage();
      const dataURL = canvas.toDataURL();
      try {
        dispatch(uploadAvatarToCloud(dataURL));
        setAvatarChangedStatus(true);
      } catch (error) {
        console.log('Error uploading image to Cloudinary: ', error);
      }
    }
  }

  const baseUploadImageUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`;
  const avatarUrl = useSelector(urlAvatarUploadedState);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    if (avatarChangedStatus) {
      values.avatar = avatarUrl.replace(baseUploadImageUrl, "");
    }

    values.id === "" ? dispatch(userPost(values)) : dispatch(userPut(values));
    navigate("/users");
  };

  return (
    <Box m="20px">
      <Header title="FORM USER" subtitle="For administrator only" />

      {userSelected && (
        <Box display="flex" gap="30px">
          <Box>
            <Box display="flex" justifyContent="space-between" flexDirection="column" gap="10px">
              <AvatarEditor
                ref={setEditor}
                image={file}
                width={300}
                height={300}
                border={25}
                color={[180, 180, 180, 0.5]}
                borderRadius={360}
                scale={scale}
                position={position}
                onPositionChange={handlePositionChange}
              />
              {errorFile && <h3 style={{ background: "#B4B4B4", color: "#8B0000", textAlign: "center", padding: "2px" }}>{errorFile}</h3>}
              <TextField type="file" variant="outlined" onChange={handleFileChange} style={{ width: "350px" }} />
              <Box display="flex" alignItems="center" gap="10px" style={{ width: "350px" }}>
                <RemoveCircleOutlineIcon onClick={() => { setScale(((scale - 0.05) < 0.5) ? 0.5 : (scale - 0.05)) }} style={{ cursor: "pointer" }} />
                <Slider value={scale} onChange={handleScaleChange} min={0.5} max={2} step={0.01} color="success" />
                <AddCircleOutlineIcon onClick={() => { setScale(((scale + 0.05) > 2 ? 2 : (scale + 0.05))) }} style={{ cursor: "pointer" }} />
              </Box>
              {file && <Button variant="contained" style={{ background: "#1F2A40", color: "white", width: "350px" }} onClick={handleUploadAvatarToCloud}>Confirm And Upload</Button>}
            </Box>
          </Box>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={userSelected}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    label="Id will be generated automatically."
                    disabled
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.id}
                    name="id"
                    sx={{ gridColumn: "span 4" }}
                  /> */}
                  <TextField
                    fullWidth
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Fullname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fullname}
                    name="fullname"
                    error={!!touched.fullname && !!errors.fullname}
                    helperText={touched.fullname && errors.fullname}
                    sx={{ gridColumn: "span 4" }}
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 4" }}
                  />
                  {/* <TextField
                    fullWidth
                    disabled
                    variant="outlined"
                    type="text"
                    label="Avatar link will be automatically generated when uploading an image successfully!"
                    value={values.avatar}
                    name="avatar"
                    sx={{ gridColumn: "span 4" }}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    label="Create date (MM-dd-yyyy)"
                    disabled
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.createDate}
                    name="createDate"
                    sx={{ gridColumn: "span 4" }}
                  /> */}
                </Box>
                <Box display="flex" justifyContent="space-between" mt="20px">
                  <Link
                    to={"/users"}
                    style={{
                      textDecoration: 'none',
                      background: "#1F2A40",
                      color: "white",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <ArrowBackIcon></ArrowBackIcon>
                      <Box ml="5px">Back to management users</Box>
                    </Box>
                  </Link>
                  <Button type="submit" variant="contained" style={{
                    background: "#1F2A40",
                    color: "white",
                  }}>
                    <Box display="flex" alignItems="center">
                      <SaveAltIcon></SaveAltIcon>
                      <Box ml="5px">Save</Box>
                    </Box>
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      )}
    </Box>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  password: yup.string().required("required"),
  fullname: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phone: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
});

export default FormCreateUser;
