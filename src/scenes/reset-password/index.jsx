import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";
import { resetPassword } from "../../store/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const FormResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const handleFormSubmit = (values) => {
    const data = { password: values.password, token: token }

    dispatch(resetPassword(data)).then((response) => {
      if (response.type === "resetPassword/rejected") {
        toast.error(response.payload.message, {
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
        toast.success(response.payload.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => { navigate("/") }, 1000);
      }
    })
  };

  const initialValues = { password: "", };
  return (
    <Box m="20px">
      <Header title="Reset Password" />
      <Box display="flex" justifyContent="center" alignItems="center" gap="30px" height="100%">
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={loginSchema}
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
                type="password"
                label="Your new password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ width: "100%" }}
              />
              <Button type="submit" variant="contained" style={{
                background: "#1F2A40",
                color: "white",
              }}>
                <Box display="flex" alignItems="center">
                  <LoginIcon />
                  <Box ml="5px">Confirm</Box>
                </Box>
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const loginSchema = yup.object().shape({
  password: yup.string().required("required"),
});

export default FormResetPassword;
