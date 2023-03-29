import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
// import { useState } from "react";
import {
  categoriesState,
  productsState,
  productItemsState,
} from "../../store/selectors";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
// import { useTheme } from "@emotion/react";
// import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { brandsState, subCategoriesState } from "../../store/selectors";
import { brandGetAll, createOrUpdateProduct } from "../../store/apis";
import { Button } from "@mui/material";
import AvatarEditor from "react-avatar-editor";

const Product = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(brandGetAll());
  }, [dispatch]);

  // Get data
  const categories = useSelector(categoriesState);
  const brands = useSelector(brandsState);
  const subCategories = useSelector(subCategoriesState);
  const products = useSelector(productsState);
  // const subCategories = useSelector(subCategoriesState);
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  const handleFilterCategory = (e) => {
    if (e.target.checked) {
      // Check
      // e.target.value
    } else {
      // Uncheck
      // e.target.value
    }
  };

  //create product
  const [listSubCre, setListSubCre] = useState([]);
  const [prodNameCre, setProdNameCre] = useState("");
  const [brandIdCre, setBrandIdCre] = useState(0);
  const [cateNameCre, setCateNameCre] = useState("");
  const [subCateIdCre, setSubCateIdCre] = useState(0);
  const [proddescCre, setProddescCre] = useState("");
  //image
  const [prodImageCre, setProdImageCre] = useState(null);
  const [productEditorCre, setProductEditorCre] = useState(null);
  const [changeProImageCre, setChangeProImageCre] = useState(false);
  //-------

  useEffect(() => {
    if (subCategories.length) {
      const listSubCre = subCategories.filter(
        (sub) => sub.category.name === "Men"
      );
      setListSubCre(listSubCre);

      setSubCateIdCre(listSubCre[0].id);
    }

    if (brands.length) {
      setBrandIdCre(brands[0].id);
    }
  }, [brands.length > 0, subCategories.length > 0]);

  //CREATE PRODUCT
  const handleProImageChangeCre = (event) => {
    setProdImageCre(event.target.files[0]);
    setChangeProImageCre(true);
  };

  const handleOnchangeProdNameCre = (e) => {
    setProdNameCre(e.target.value);
  };

  const handleChangeBrandCre = (e) => {
    setBrandIdCre(e.target.value);
  };

  const handleChangeCategoryCre = (e) => {
    setCateNameCre(e.target.value);

    const listSub = subCategories.filter(
      (sub) => sub.category.name === e.target.value
    );
    setListSubCre(listSub);
    setSubCateIdCre(listSub[0].id);
  };

  const handleChangeSubCategoryCre = (e) => {
    setSubCateIdCre(e.target.value);
  };

  const handleOnchangeDescCre = (e) => {
    setProddescCre(e.target.value);
  };

  const handleCreateProduc = (e) => {
    if (
      changeProImageCre === true &&
      prodNameCre !== "" &&
      proddescCre !== ""
    ) {
      const canvas = productEditorCre.getImageScaledToCanvas();
      const image = canvas.toDataURL();

      const sub = subCategories.find((sub) => sub.id === +subCateIdCre);
      const brand = brands.find((br) => br.id === +brandIdCre);

      const productCreate = {
        name: prodNameCre,
        description: proddescCre,
        image: image,
        subcategory: sub,
        brand: brand,
      };

      dispatch(
        createOrUpdateProduct({ product: productCreate})
      );
      setChangeProImageCre(false);
      setProdNameCre("");
      setBrandIdCre(0);
      setCateNameCre("");
      setSubCateIdCre(0);
      setProddescCre("");
      setProdImageCre(null);
      setProductEditorCre(null);
    }
  };

  return (
    <Box m="20px">
      <Box>
        <Header title={"MANAGEMENT YOUR PRODUCTS"} />

        <Box
          style={{ marginBottom: "15px" }}
          display="flex"
          flexWrap="wrap"
          alignItems="center"
        >
          <div>
            <Typography variant="h5" component="h5" marginRight="20px">
              Categories
            </Typography>
          </div>
          <div>
            <FormGroup sx={{ flexDirection: "row" }}>
              {categories.map((category) => (
                <FormControlLabel
                  sx={{
                    background: "gray",
                    paddingRight: "16px",
                    borderRadius: "5px",
                  }}
                  key={category.id}
                  control={<Checkbox />}
                  label={category.name}
                  value={category.id}
                  onChange={(e) => handleFilterCategory(e)}
                />
              ))}
            </FormGroup>
          </div>
          <div className="ms-auto" style={{ color: "black" }}>
            <Button
              className="border border-1"
              style={{ background: "#1F2A40", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#createProductModal"
            >
              Create product
            </Button>

            {/* Modal */}
            <div
              className="modal fade"
              id="createProductModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="card-body row">
                    <div className="fw-bold">CREATE PRODUCT</div>
                    <div className="text-center">Choose Image:</div>
                    <div className="col-12 pb-4 text-center">
                      {prodImageCre && (
                        <AvatarEditor
                          ref={setProductEditorCre}
                          image={prodImageCre}
                          border={0}
                        />
                      )}
                      <br />
                      <div className="chooseImage">
                        <input type="file" onChange={handleProImageChangeCre} />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            value={prodNameCre}
                            onChange={handleOnchangeProdNameCre}
                            className="form-control"
                            id="name"
                          />
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                          <label className="form-label">Brands</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={brandIdCre}
                            onChange={handleChangeBrandCre}
                          >
                            {brands.map((br) => (
                              <option value={br.id} key={br.id}>
                                {br.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                          <label className="form-label">Categories</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={cateNameCre}
                            onChange={handleChangeCategoryCre}
                          >
                            {categories.map((cate) => (
                              <option value={cate.name} key={cate.id}>
                                {cate.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                          <label className="form-label">Subcategories</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={subCateIdCre}
                            onChange={handleChangeSubCategoryCre}
                          >
                            {listSubCre.map((subCate) => (
                              <option value={subCate.id} key={subCate.id}>
                                {subCate.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-12 mb-3">
                          <label htmlFor="stock" className="form-label">
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            value={proddescCre}
                            onChange={handleOnchangeDescCre}
                            id="proddesc"
                            name="proddesc"
                            rows="4"
                          ></textarea>
                        </div>
                      </div>
                      <Button
                        style={{ background: "#1F2A40", color: "white" }}
                        className="float-end"
                        onClick={handleCreateProduc}
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>

        <Box className="row" display="flex" flexWrap="wrap">
          {products.map((item) => (
            <Box
              className="col-lg-3 col-md-4 col-sm-6 col-12 p-2"
              key={item.id}
            >
              <ProductCard product={item} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
