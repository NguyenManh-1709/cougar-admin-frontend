import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import {
  getProductItemByProductIdSelector,
  getProductByIdSelector,
  categoriesState,
  subCategoriesState,
  brandsState
} from "../../store/selectors";
import { brandGetAll } from "../../store/apis";

// import { useTheme } from "@emotion/react";
// import { tokens } from "../../theme";

const FormCreateProduct = () => {
  const { id } = useParams();
  // const [product, setProduct] = useState(null);
  const productItems = useSelector(getProductItemByProductIdSelector(id));
  const categories = useSelector(categoriesState);
  const subCategories = useSelector(subCategoriesState);
  // const [productItem, setProductItem] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(brandGetAll());
  }, [dispatch]);

  const brands = useSelector(brandsState);

  const [prodName, setProdName] = useState("");
  const [proddesc, setProddesc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodCrDate, setprodCrDate] = useState("");
  const [subCateName, setSubCateName] = useState("");
  const [brand, setBrand] = useState("");
  const [cateName, setCateName] = useState("");

  const [price, setPrice] = useState(0);
  const [itemImage, setItemImage] = useState("");
  const [stock, setStock] = useState(0);
  const [itemCrDate, setItemCrDate] = useState("");
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const getProduct = useSelector(getProductByIdSelector(id));

  useEffect(() => {
    if (getProduct) {
      setProdName(getProduct.name);
      setProddesc(getProduct.description);
      setProdImage(getProduct.image);
      setprodCrDate(getProduct.createDate);
      setBrand(getProduct.brand.name);
      setSubCateName(getProduct.subcategory.name);
      setCateName(getProduct.subcategory.category.name);
    }
  }, [getProduct]);

  useEffect(() => {
    if (productItems.length) {
      setPrice(productItems[0].price);
      setItemImage(productItems[0].image);
      setStock(productItems[0].qtyInStock);
      setItemCrDate(productItems[0].createDate);
      setColor(productItems[0].color);
      setSize(productItems[0].size);
      setSku(productItems[0].sku);
    }
  }, [productItems.length > 0]);

  const handleCickProductItem = (proItem) => {
    setItemCrDate(proItem.createDate);
    setPrice(proItem.price);
    setItemImage(proItem.image);
    setStock(proItem.qtyInStock);
    setColor(proItem.color);
    setSize(proItem.size);
    setSku(proItem.sku);
  };

  const handleOnchangeProdName = (e) => {
    setProdName(e.target.value);
  };

  const handleOnchangeDesc = (e) => {
    setProddesc(e.target.value);
  };

  const handleOnchangeProdCrDate = (e) => {
    setprodCrDate(e.target.value);
    console.log(e.target.value);
  };

  //ProductItem
  const handleOnchangeSku = (e) => {
    setSku(e.target.value);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleChangeItemCrDate = (e) => {
    setItemCrDate(e.target.value);
  };

  const handleChangeStock = (e) => {
    setStock(e.target.value);
  };

  const handleChangeColor = (e) => {
    setColor(e.target.value);
  };

  const handleChangeSize = (e) => {
    setSize(e.target.value);
  };

  const handleChangeCategory = (e) => {
    setCateName(e.target.value);
    console.log(e.target.value);
  };
  const handleChangeSubCategory = (e) => {
    setSubCateName(e.target.value);
    console.log(e.target.value);
  };
  const handleChangeBrand = (e) => {
    setBrand(e.target.value);
    console.log(e.target.value);
  };
  return (
    <Box m="20px">
      <Header title="EDIT PRODUCT" />

      <div className="card text-dark mb-3">
        <div className="card-header fw-bold">PRODUCT</div>
        <div className="card-body row">
          <div className="col-3 col-md-3 col-sm-12 col-12 text-center pb-4">
            <img
              src={
                prodImage
                  ? `https://res.cloudinary.com/dmjh7imwd/image/upload/${prodImage}`
                  : ""
              }
              className="img-fluid"
              alt="..."
            />
            <div>
              <input type="file" />
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-12 col-12">
            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={prodName}
                  onChange={handleOnchangeProdName}
                  className="form-control"
                  id="name"
                />
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Brands</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={brand}
                  onChange={handleChangeBrand}
                >
                  {
                    brands.map(br=>(
                      <option value={br.name} key={br.id}>{br.name}</option>
                    ))
                  }
                  
                </select>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Categories</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={cateName}
                  onChange={handleChangeCategory}
                >
                  {categories.map((cate) => (
                    <option value={cate.name} key={cate.id}>
                      {cate.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Subcategories</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={subCateName}
                  onChange={handleChangeSubCategory}
                >
                  {subCategories.map((subCate) => (
                    <option value={subCate.name} key={subCate.id}>
                      {subCate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 mb-3 ms-auto">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Create Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="exampleInputEmail1"
                  value={prodCrDate}
                  onChange={handleOnchangeProdCrDate}
                />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="stock" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  value={proddesc}
                  onChange={handleOnchangeDesc}
                  id="proddesc"
                  name="proddesc"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <Button
              style={{ background: "#1F2A40", color: "white" }}
              className="float-end"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="card text-dark">
        <div className="row card-header fw-bold align-items-center">
          <div className="col-2">PRODUCTITEMS:</div>
          <div className="col-10">
            <div className="row">
              {productItems.map((it) => (
                <div key={it.id} className="col-2">
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCickProductItem(it)}
                    className="img-fluid"
                    src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${it.image}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body row">
          <div className="col-3 col-md-3 col-sm-12 col-12 text-center pb-4">
            <img
              src={
                itemImage
                  ? `https://res.cloudinary.com/dmjh7imwd/image/upload/${itemImage}`
                  : ""
              }
              className="img-fluid"
              alt="..."
            />
            <div>
              <input type="file" />
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-12 col-12">
            <div className="row">
              <div className="col-6 mb-3">
                <label htmlFor="name" className="form-label">
                  Sku
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={handleOnchangeSku}
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
                  value={price}
                  onChange={handleChangePrice}
                />
              </div>

              <div className="col-6 mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Create Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="itemCrDate"
                  value={itemCrDate}
                  onChange={handleChangeItemCrDate}
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
                  value={stock}
                  onChange={handleChangeStock}
                />
              </div>

              <div className="col-6 mb-3">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  value={color}
                  onChange={handleChangeColor}
                />
              </div>

              <div className="col-6 mb-3">
                <label htmlFor="size" className="form-label">
                  Size
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="size"
                  value={size}
                  onChange={handleChangeSize}
                />
              </div>
            </div>
            <Button
              style={{ background: "#1F2A40", color: "white" }}
              className="float-end"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default FormCreateProduct;
