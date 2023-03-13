import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
// import { useState } from "react";
import { categoriesState, productsState } from "../../store/selectors";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { useSelector } from "react-redux";

const Product = () => {
  // Get data
  // const productItems = useSelector(productItemsState);
  const categories = useSelector(categoriesState);
  // const subCategories = useSelector(subCategoriesState);
  const products = useSelector(productsState);

  // const [filterCategory, setFilterCategory] = useState();
  const handleFilterCategory = (e) => {
    if (e.target.checked) {
      // Check 
      // e.target.value
    } else {
      // Uncheck
      // e.target.value
    }
  }

  return (
    <Box m="20px">
      <Box>
        <Header title={"MANAGEMENT YOUR PRODUCTS"} />

        <Box display="flex" flexWrap="wrap" alignItems="center">
          <Typography variant="h5" component="h5" marginRight="20px">
            Categories
          </Typography>

          <FormGroup sx={{ flexDirection: "row" }}>
            {categories.map((category) => (
              <FormControlLabel 
                sx={{ background: "gray", paddingRight: "16px", borderRadius: "5px" }} 
                key={category.id} control={<Checkbox />} 
                label={category.name}
                value={category.id}
                onChange={(e) => handleFilterCategory(e)}
              />
            ))}
          </FormGroup>
        </Box>

        <Box display="flex" flexWrap="wrap">
          {products.map((item) => (
            <Box key={item.id} sx={{ width: "25%", padding: "15px" }}>
              <ProductCard product={item} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box >
  );
};

export default Product;
