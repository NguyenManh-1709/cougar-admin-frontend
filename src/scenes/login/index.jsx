import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/apis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = (values) => {
        dispatch(login(values)).then((response) => {
            if (response.type === "login/rejected") {
                toast.error("Please check your email or password again!", {
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
                if (response.payload === null) {
                    toast.error("Please login with admin account!", {
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
                    toast.success("Successfully!", {
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
            }
        });
        setTimeout(()=>{navigate("/dashboard")}, 1000);
    };

    const initialValues = { email: "", password: "" };
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
