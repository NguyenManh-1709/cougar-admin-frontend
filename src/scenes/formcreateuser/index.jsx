import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloudinaryUploader from "../../components/CloudinaryUploader";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { userPost } from "../../store/User/api";
import { userPut } from "../../store/User/api";
import { useParams } from 'react-router-dom';

const FormCreateUser = () => {
  const { user } = useParams();
  const decodedUser = JSON.parse(decodeURIComponent(user));

  const baseUploadImageUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/`
  const imageUrl = useSelector((state) => state.uploadImageStore.url).slice(baseUploadImageUrl.length).trim()

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();

  const handleFormSubmit = (values) => {
    values.avatar = imageUrl;
    values.id === "" ? dispatch(userPost(values)) : dispatch(userPut(values));
  };

  return (
    <Box m="20px">
      <Header title="CREATE ACCOUNT" subtitle="For administrator only" />
      <Box display="flex" gap="30px">
        <CloudinaryUploader />
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={decodedUser}
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
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Id will be generated automatically."
                  disabled
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.id}
                  name="id"
                  sx={{ gridColumn: "span 4" }}
                />
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
                <TextField
                  fullWidth
                  disabled
                  variant="filled"
                  type="text"
                  label="The image URL will be generated automatically when you upload avartar successfully."
                  value={imageUrl}
                  name="avatar"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label="Create date"
                  disabled
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.createDate}
                  name="createDate"
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt="20px">
                <Link
                  to={"/management"}
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
                    <Box ml="5px">Back to management</Box>
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
