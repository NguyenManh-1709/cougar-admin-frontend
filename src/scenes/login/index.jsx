import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/apis";
import { loginStatusState } from "../../store/selectors";

const FormLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginStatus = useSelector(loginStatusState);

    const handleFormSubmit = (values) => {
        dispatch(login(values));
        navigate("/dashboard");
    };

    const initialValues = { email: "manhnd@gmail.com", password: "123456" };
    return (
        <Box m="20px">
            <Header title="Login" subtitle="For administrator only" />
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
                                sx={{ width: "100%" }}
                            />
                            <Button type="submit" variant="contained" style={{
                                background: "#1F2A40",
                                color: "white",
                            }}>
                                <Box display="flex" alignItems="center">
                                    <LoginIcon />
                                    <Box ml="5px">Login</Box>
                                </Box>
                            </Button>
                            <Box sx={{textAlign: "center"}}>{loginStatus}</Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

export default FormLogin;
