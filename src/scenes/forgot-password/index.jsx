import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../store/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormForgotPassword = () => {
  const dispatch = useDispatch();

  const handleFormSubmit = (values) => {
    dispatch(forgotPassword(values)).then((response) => {
      if (response.type === "forgotPassword/rejected") {
        toast.error("Email not found!", {
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
        toast.success("Check your email to reset your password", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    })
  };

  const initialValues = { email: "" };
  return (
    <Box m="20px">
      <Header title="Forgot password" />
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
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ width: "100%" }}
              />
              <Button type="submit" variant="contained" style={{
                background: "#1F2A40",
                color: "white",
              }}>
                <Box display="flex" alignItems="center">
                  <LoginIcon />
                  <Box ml="5px">Send</Box>
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
  email: yup.string().email("invalid email").required("required"),
});

export default FormForgotPassword;
