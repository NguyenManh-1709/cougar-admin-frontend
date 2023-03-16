import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../store/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userLogedInState } from "../../store/selectors";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogedIn = useSelector(userLogedInState)

  const handleFormSubmit = (values) => {
    dispatch(changePassword(values)).then(response => {
      if (response.type === "changePassword/rejected") {
        toast.error(`${response.payload.message}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        console.log(response);
        toast.success(`${response.payload.data.message}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => { navigate("/dashboard") }, 1000);
      }
    })
  };

  const initialValues = { email: userLogedIn.email, currentPassword: "", newPassword: "" };
  return (
    <Box m="20px">
      <Header title="Change Password" />
      <Box display="flex" justifyContent="center" alignItems="center" gap="30px" height="100%">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} style={{ width: "500px", display: "flex", flexDirection: "column", gap: "30px" }}>
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
                sx={{ width: "100%" }}
                disabled
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Current Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currentPassword}
                name="currentPassword"
                error={!!touched.currentPassword && !!errors.currentPassword}
                helperText={touched.currentPassword && errors.currentPassword}
                sx={{ width: "100%" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="New Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.newPassword}
                name="newPassword"
                error={!!touched.newPassword && !!errors.newPassword}
                helperText={touched.newPassword && errors.newPassword}
                sx={{ width: "100%" }}
              />
              <Button type="submit" variant="contained" style={{
                background: "#1F2A40",
                color: "white",
              }}>
                <Box display="flex" alignItems="center">
                  <SaveAltIcon />
                  <Box ml="5px">Submit</Box>
                </Box>
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const changePasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  newPassword: yup.string().required("required"),
  currentPassword: yup.string().required("required"),
});

export default ChangePassword;
