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
  brandsState,
  subCategoriesState,
  optionsState,
  getOptionsByVariationID,
  getVariationsSelector,
} from "../../store/selectors";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
// import { useTheme } from "@emotion/react";
// import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import {
  brandGetAll,
  createOrUpdateProduct,
  getOptions,
  CreateOption,
  getAllVariation,
} from "../../store/apis";
import { Button } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import Modal from "@mui/material/Modal";
import { Fragment } from "react";
import { optionsData } from "../../until/options";

function ChildModal(props) {
  const { variation } = props;
  const [open, setOpen] = useState(false);
  const options = useSelector(getOptionsByVariationID(variation.id));
  const dispatch = useDispatch();
  const [addOption, setAddOption] = useState("");

  useEffect(() => {
    Object.keys(optionsData).map((propName) => {
      if (propName === variation.name) {
        setAddOption(optionsData[propName][0]);
      }
    });
  }, []);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChooseOption = (e) => {
    setAddOption(e.target.value);
  };

  const handleAddOption = () => {
    const option = {
      variation: variation,
      value: addOption,
    };

    const exit = options.find(
      (op) =>
        op.variation.id === option.variation.id && op.value === option.value
    );
    if (!exit) {
      dispatch(CreateOption(option));
      console.log("them");
    }else{
      console.log("k them");
    }
    handleClose();
  };
  return (
    <Fragment>
      <a
        className="text-danger"
        onClick={handleOpen}
        style={{ cursor: "pointer", textDecoration: "none" }}
      >
        New {variation.name}
      </a>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h6 className="text-center fw-bold" id="child-modal-title">
            Add new {variation.name}
          </h6>
          <hr className="mt-0" />

          <select onChange={handleChooseOption} className="w-100">
            {Object.keys(optionsData).map(
              (propName) =>
                propName === variation.name &&
                optionsData[propName].map((p) => (
                  <option value={p} key={p}>
                    {p}
                  </option>
                ))
            )}
          </select>

          <hr className="mb-1" />
          <Button
            style={{ backgroundColor: "rgb(31, 42, 64)", color: "white" }}
            className="float-end"
            onClick={handleAddOption}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Fragment>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  bgcolor: "white",
  color: "black",
  border: "1px solid #000",
  boxShadow: 24,
  p: 1,
};

const Product = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(brandGetAll());
    dispatch(getOptions());
    dispatch(getAllVariation());
  }, [dispatch]);

  // Get data
  const categories = useSelector(categoriesState);
  const brands = useSelector(brandsState);
  const subCategories = useSelector(subCategoriesState);
  const getProducts = useSelector(productsState);
  const options = useSelector(optionsState);
  const variations = useSelector(getVariationsSelector);
  // const subCategories = useSelector(subCategoriesState);
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [filterByCate, setFilterByCate] = useState([]);

  useEffect(()=>{
    if(getProducts.length){
      setProducts(getProducts);
    }
  },[getProducts.length > 0])

  const handleFilterCategory = (e) => {
    if(e.target.checked){
      const liCa = filterByCate;
      liCa.push(e.target.value);
      setFilterByCate(liCa);
      
      if(getProducts.length > 0){
        const ProFilter = getProducts.reduce((total, pre)=>{
          if(liCa.some(ca=>+ca === pre.subcategory.category.id)){
            total.push(pre);
          }
          return total;
        },[])

        setProducts(ProFilter);
      }
    }else{
      const lica = filterByCate.filter(ca=>ca !== e.target.value);
      setFilterByCate(lica);
      if(lica.length > 0){
        if(getProducts.length > 0){
          const ProFilter = getProducts.reduce((total, pre)=>{
            if(lica.some(ca=>+ca === pre.subcategory.category.id)){
              total.push(pre);
            }
            return total;
          },[])
          setProducts(ProFilter);
        }
      }else{
        setProducts(getProducts);
      }
    }
  };

 
  //option
  const [listVariation, setListVariation] = useState([]);


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

  //CREATE ITEM
  const [skuCr, setSkuCr] = useState("");
  const [stockCr, setStockCr] = useState(0);
  const [priceCr, setPriceCr] = useState(0);
  const [optionCr, setoptionCr] = useState({});

  //------

  useEffect(() => {
    if (subCategories.length && variations.length) {
      
      const listSubCre = subCategories.filter(
        (sub) => sub.category.name === "Men"
      );
      setListSubCre(listSubCre);
      setCateNameCre("Men");
      setSubCateIdCre(listSubCre[0].id);

      const variationsBySubID = variations.filter(
        (va) => va.subcategory.id === listSubCre[0].id
      );
      setListVariation(variationsBySubID);

      if (options.length) {
        const option = {};

        variationsBySubID.forEach((va) => {
          options.forEach((p) => {
            if (p.variation.id === va.id) {
              if (option[va.name] === undefined) {
                const o = {};
                o.id = p.id;
                o.value = p.value;

                option[va.name] = o;
              }
            }
          });
        });
        console.log(option);

        setoptionCr(option);
      }
    }

    if (brands.length) {
      setBrandIdCre(brands[0].id);
    }
  }, [
    brands.length > 0,
    subCategories.length > 0,
    options.length,
    variations.length > 0,
  ]);

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

    const variationsBySubID = variations.filter(
      (va) => va.subcategory.id === listSub[0].id
    );
    setListVariation(variationsBySubID);
      if (options.length) {
        const option = {};

        variationsBySubID.forEach((va) => {
          options.forEach((p) => {
            if (p.variation.id === va.id) {
              if (option[va.name] === undefined) {
                const o = {};
                o.id = p.id;
                o.value = p.value;

                option[va.name] = o;
              }
            }
          });
        });
        console.log(option);

        setoptionCr(option);
      }
  };

  const handleChangeSubCategoryCre = (e) => {
    
    setSubCateIdCre(e.target.value);
    const variationsBySubID = variations.filter(
      (va) => va.subcategory.id === +e.target.value
    );
    setListVariation(variationsBySubID);

      if (options.length) {
        const option = {};

        variationsBySubID.forEach((va) => {
          options.forEach((p) => {
            if (p.variation.id === va.id) {
              
              if (option[va.name] === undefined) {
                const o = {};
                o.id = p.id;
                o.value = p.value;

                option[va.name] = o;
              }
            }
          });
        });
        console.log(option);

        setoptionCr(option);
      }
  };

  const handleOnchangeDescCre = (e) => {
    setProddescCre(e.target.value);
  };

  //HANDLE CREATE PRODUCT ITEM
  const handleOnchangeSkuCr = (e) => {
    setSkuCr(e.target.value.toUpperCase());
  };

  const handleChangePriceCr = (e) => {
    setPriceCr(e.target.value);
  };

  const handleChangeStockCr = (e) => {
    setStockCr(e.target.value);
  };

  const handleChangeOptionCr = (e) => {
    const op = options.find((op) => +e.target.value === op.id);
    if (op) {
      const option = optionCr;

      const o = {};
      o.id = op.id;
      o.value = op.value;

      option[op.variation.name] = o;

      setoptionCr(option);
      console.log(option);
    }
  };

  //CREATE
  const handleCreateProduc = () => {
    if (
      changeProImageCre === true &&
      prodNameCre !== "" &&
      proddescCre !== "" &&
      skuCr !== "" &&
      +priceCr !== 0 &&
      priceCr !== "" &&
      !isNaN(priceCr) &&
      +stockCr !== 0 &&
      stockCr !== "" &&
      !isNaN(stockCr) &&
      Object.keys(optionCr).length > 0
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

      const productItemCreate = {
        sku: skuCr,
        qtyInStock: stockCr,
        price: priceCr,
        image: image,
      };

      dispatch(
        createOrUpdateProduct({
          product: productCreate,
          productItem: productItemCreate,
          option: optionCr,
        })
      );
      setChangeProImageCre(false);
      setProdNameCre("");
      setBrandIdCre(0);
      setCateNameCre("");
      setSubCateIdCre(0);
      setProddescCre("");
      setProdImageCre(null);
      setProductEditorCre(null);
      setSkuCr("");
      setStockCr(0);
      setPriceCr(0);
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
            <Typography
              style={{ backgroundColor: "taupe" }}
              variant="h5"
              component="h5"
              marginRight="20px"
            >
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
                  onChange={handleFilterCategory}
                />
              ))}
            </FormGroup>
          </div>
          <div className="ms-auto" style={{ color: "black" }}>
            <Button
              className="border border-1"
              style={{ background: "#1F2A40", color: "white" }}
              onClick={handleOpen}
            >
              Create product
            </Button>

            <div>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                style={{ overflowY: "scroll", maxHeight: "500px" }}
              >
                <Box
                  className="mx-auto mt-4"
                  sx={{ width: 700 }}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  <div className="card-body row">
                    <div className="fw-bold text-center">
                      CREATE PRODUCT
                      <hr className="mt-0" />
                    </div>
                    <div>Choose Image:</div>
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
                        <div className="col-6">
                          <div className="row">
                            <div className="fw-bold mb-2">
                              PRODUCT
                              <hr style={{ width: "50%", marginTop: 0 }} />
                            </div>

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
                            <div className="col-12 mb-3">
                              <label className="form-label">
                                Subcategories
                              </label>
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
                        </div>
                        {/* product item */}
                        <div className="col-6">
                          <div className="row">
                            <div className="fw-bold mb-2">
                              PRODUCT ITEM
                              <hr style={{ width: "50%", marginTop: 0 }} />
                            </div>
                            <div className="col-12 mb-3">
                              <label htmlFor="name" className="form-label">
                                Sku
                              </label>
                              <input
                                type="text"
                                value={skuCr}
                                onChange={handleOnchangeSkuCr}
                                className="form-control"
                                id="Sku"
                              />
                            </div>
                            <div className="col-6 mb-3">
                              <label htmlFor="price" className="form-label">
                                Price
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="price"
                                value={priceCr}
                                onChange={handleChangePriceCr}
                              />
                            </div>

                            <div className="col-6 mb-3">
                              <label htmlFor="stock" className="form-label">
                                Stock
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="stock"
                                value={stockCr}
                                onChange={handleChangeStockCr}
                              />
                            </div>
                            {listVariation.map((va) => (
                              <div key={va.id} className="col-6 mb-3">
                                <label className="form-label">{va.name}</label>
                                <select
                                  className="form-select"
                                  // value={optionIDCr}
                                  onChange={handleChangeOptionCr}
                                >
                                  {options.map(
                                    (op) =>
                                      op.variation.id === va.id && (
                                        <option value={op.id} key={op.id}>
                                          {op.value}
                                        </option>
                                      )
                                  )}
                                </select>
                                <ChildModal variation={va} />
                              </div>
                            ))}
                          </div>
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
                </Box>
              </Modal>
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
