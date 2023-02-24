import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateIcon from '@mui/icons-material/Create';
import { mockDataSubcategory } from "../../data/mockData";

const FormCreateProduct = () => {
  
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT"/>

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
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                select
                label="Sub category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.subcategory.id}
                sx={{ gridColumn: "span 1" }}
              >
                {mockDataSubcategory.map((mockDataSubcategory) => (
                  <MenuItem key={mockDataSubcategory.id} value={mockDataSubcategory.id}>
                    {mockDataSubcategory.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 1" }}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" mt="20px">
              <Link
                to={"/products"}
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
                  <Box ml="5px">Back to list products</Box>
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

const checkoutSchema = yup.object().shape({
  // username: yup.string().required("required"),
  // password: yup.string().required("required"),
  // fullname: yup.string().required("required"),
  // email: yup.string().email("invalid email").required("required"),
  // phone: yup
  //   .string()
  //   .required("required"),
});

const initialValues = {
  id: "",
  name: "",
  subcategory: {id: 1, name: 'Category 1'},
  createdate: new Date().toISOString().slice(0, 10),
  price: "",
  description: "",
  image: "",
};

export default FormCreateProduct;
