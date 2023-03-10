import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { productItemsState, categoriesState, subCategoriesState } from "../../store/selectors";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Product = () => {
  // Get data
  const productItems = useSelector(productItemsState);
  const categories = useSelector(categoriesState);
  const subCategories = useSelector(subCategoriesState);

  const [categorySelected, setCategorySelected] = useState(() => { return (categories != null ? categories[0].id : 0) });
  const [subcategoriesBySelectedCategory, setSubcategoriesBySelectedCategory] = useState(() => { return (categorySelected !== 0 ? (subCategories.filter(subCategory => subCategory.category.id === categorySelected)) : []) });
  const [subCategorySelected, setSubCategorySelected] = useState(() => { return (subcategoriesBySelectedCategory != null ? subcategoriesBySelectedCategory[0].id : 0) });
  const [productsToShow, setProductsToShow] = useState(() => { return (subCategorySelected !== 0 ? (productItems.filter(productItem => productItem.product.subcategory.id === subCategorySelected)) : []) });

  return (
    <Box m="20px">
      <Box>
        <Header title={"MANAGEMENT YOUR PRODUCTS"} />

        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={categorySelected}
            onChange={(event) => {
              setSubCategorySelected(0);
              const idCategorySelected = event.target.value;
              setCategorySelected(idCategorySelected);
              if (idCategorySelected !== 0) {
                const subcategoriesBySelectedCategoryTemp = subCategories.filter(subCategory => subCategory.category.id === idCategorySelected)
                setSubcategoriesBySelectedCategory(subcategoriesBySelectedCategoryTemp);
                setSubCategorySelected(subcategoriesBySelectedCategoryTemp[0].id);
                setProductsToShow(productItems.filter(productItem => productItem.product.subcategory.id === subcategoriesBySelectedCategoryTemp[0].id));
              } else {
                setSubcategoriesBySelectedCategory([]);
                setSubCategorySelected(0);
                setProductsToShow([]);
              }
            }}
          >
            <MenuItem
              value={0}
            >
              None
            </MenuItem>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {categorySelected !== 0 && (
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={subCategorySelected}
              onChange={(event) => {
                const idSubCategorySelected = event.target.value;
                setSubCategorySelected(idSubCategorySelected);
                setProductsToShow(productItems.filter(productItem => productItem.product.subcategory.id === idSubCategorySelected));
              }}
            >
              <MenuItem
                value={0}
              >
                None
              </MenuItem>
              {subcategoriesBySelectedCategory.map((subCategory) => (
                <MenuItem
                  key={subCategory.id}
                  value={subCategory.id}
                >
                  {subCategory.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box display="flex" flexWrap="wrap">
          {productsToShow.length === 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" padding="100px 0" width="100%">
              <WarningAmberIcon sx={{ marginRight: "25px", fontSize: "30px" }} />
              <Box sx={{ fontSize: "20px" }}>This category has no products!</Box>
            </Box>
          )}
          {productsToShow.map((item) => (
            <Box key={item.id} sx={{ width: "25%", padding: "15px" }}>
              <ProductCard productItem={item} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box >
  );
};

export default Product;
