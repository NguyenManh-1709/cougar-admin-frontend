import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import { useState } from "react";

const FormCreateUser = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  

  return (
    <Box m="20px">
      <Header title="CREATE ACCOUNT" subtitle="For administrator only" />
      <Box display="flex" mb='30px' justifyContent="center" style={{minHeight: '300px', background:'#1F2A40'}}>
        {avatarPreview && <img style={{width: '300px'}} src={avatarPreview} alt={avatarFile.name} />}
        {!avatarPreview && <img style={{width: '300px'}} src={"../../assets/user.png"} alt="Default" />}
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
          <form onSubmit={handleSubmit}>
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
                type="text"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 1" }}
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
                sx={{ gridColumn: "span 1" }}
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
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                type="file"
                label="Avatar"
                variant="outlined"
                value={values.image}
                inputProps={{
                  multiple: false
                }}
                onChange={(event) => {
                  const file = event.target.files[0];
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
                sx={{ gridColumn: "span 1" }}
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
                sx={{ gridColumn: "span 2" }}
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
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Create date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.createdate}
                name="createdate"
                error={!!touched.createdate && !!errors.createdate}
                helperText={touched.createdate && errors.createdate}
                sx={{ gridColumn: "span 4" }}
              />
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
                  <Box ml="5px">Back to list users</Box>
                </Box>
              </Link>
              <Button type="submit" variant="contained" style={{
                background: "#1F2A40",
                color: "white",
              }}>
                <Box display="flex" alignItems="center">
                  <CreateIcon></CreateIcon>
                  <Box ml="5px">Create</Box>
                </Box>
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
  fullname: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
});

const initialValues = {
  username: "",
  password: "",
  fullname: "",
  email: "",
  phone: "",
  createdate: new Date().toISOString().slice(0, 10),
  image: "",
};

export default FormCreateUser;
