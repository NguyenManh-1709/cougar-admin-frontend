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
  brandsState,
  optionsState,
} from "../../store/selectors";
import {
  brandGetAll,
  getOptions,
  createOrUpdateProduct,
  createOrUpdateProductItem,
  updateProduct,
} from "../../store/apis";
import AvatarEditor from "react-avatar-editor";

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

  useEffect(() => {
    dispatch(getOptions());
  }, [dispatch]);

  const brands = useSelector(brandsState);
  const options = useSelector(optionsState);

  const [listSub, setListSub] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  const [checkChange2, setCheckChange2] = useState(false);
  //product
  const [prodName, setProdName] = useState("");
  const [proddesc, setProddesc] = useState("");
  const [prodCrDate, setprodCrDate] = useState("");
  const [subCateId, setSubCateId] = useState(0);
  const [brandId, setBrandId] = useState(0);
  const [cateName, setCateName] = useState("");

  //item
  const [proItemId, setProItemId] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [itemCrDate, setItemCrDate] = useState("");
  const [sku, setSku] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [listColor, setListColor] = useState([]);
  const [listSize, setListSize] = useState([]);

  const [borderColor, setBorderColor] = useState(0);

  //up image
  const [fileImage, setFileImage] = useState(null);
  const [prodImage, setProdImage] = useState(null);
  const [productEditor, setProductEditor] = useState(null);
  const [proItemImage, setProItemImage] = useState(null);
  const [proItemEditor, setProItemEditor] = useState(null);
  const [changeProImage, setChangeProImage] = useState(false);

  const getProduct = useSelector(getProductByIdSelector(id));

  useEffect(() => {
    if (getProduct) {
      setProdName(getProduct.name);
      setProddesc(getProduct.description);
      setprodCrDate(getProduct.createDate);
      setBrandId(getProduct.brand.id);
      setSubCateId(getProduct.subcategory.id);
      setCateName(getProduct.subcategory.category.name);
      setProdImage(
        `https://res.cloudinary.com/dmjh7imwd/image/upload/${getProduct.image}`
      );
        setFileImage(getProduct.image);
      const listSub = subCategories.filter(
        (sub) => sub.category.id === getProduct.subcategory.category.id
      );

      setListSub(listSub);

      if (options.length) {
        const listCo = options.filter(
          (op) =>
            op.variation.name === "color" &&
            op.variation.subcategory.id === getProduct.subcategory.id
        );
        setListColor(listCo);

        const listSi = options.filter(
          (op) =>
            op.variation.name === "size" &&
            op.variation.subcategory.id === getProduct.subcategory.id
        );
        setListSize(listSi);
      }
    }
  }, [getProduct, options.length > 0]);

  useEffect(() => {
    if (productItems.length) {
      setProItemId(productItems[0].id);
      setPrice(productItems[0].price);
      setProItemImage(productItems[0].image);
      setStock(productItems[0].qtyInStock);
      setItemCrDate(productItems[0].createDate);
      setColor(productItems[0].color);
      setSize(productItems[0].size);
      setSku(productItems[0].sku);
      setBorderColor(productItems[0].id);
    }
  }, [productItems.length > 0]);

  const handleCickProductItem = (proItem) => {
    setProItemId(proItem.id);
    setItemCrDate(proItem.createDate);
    setPrice(proItem.price);
    setProItemImage(proItem.image);
    setStock(proItem.qtyInStock);
    setColor(proItem.color);
    setSize(proItem.size);
    setSku(proItem.sku);
    setBorderColor(proItem.id);
  };

  const handleOnchangeProdName = (e) => {
    setProdName(e.target.value);
    setCheckChange(true);
  };

  const handleOnchangeDesc = (e) => {
    setProddesc(e.target.value);
    setCheckChange(true);
  };

  const handleOnchangeProdCrDate = (e) => {
    setprodCrDate(e.target.value);
    setCheckChange(true);
  };

  const handleChangeCategory = (e) => {
    setCateName(e.target.value);

    const listSub = subCategories.filter(
      (sub) => sub.category.name === e.target.value
    );
    setListSub(listSub);
    setSubCateId(listSub[0].id);
    setCheckChange(true);
  };
  const handleChangeSubCategory = (e) => {
    setSubCateId(e.target.value);
    setCheckChange(true);
  };
  const handleChangeBrand = (e) => {
    setBrandId(e.target.value);
    setCheckChange(true);
  };

  //set image
  const handleProImageChange = (event) => {
    setProdImage(event.target.files[0]);
    setCheckChange(true);
    setChangeProImage(true);
    setFileImage(event.target.files[0]);
  };

  //ProductItem
  const handleOnchangeSku = (e) => {
    setSku(e.target.value.toUpperCase());
    setCheckChange2(true);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeItemCrDate = (e) => {
    setItemCrDate(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeStock = (e) => {
    setStock(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeColor = (e) => {
    setColor(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeSize = (e) => {
    setSize(e.target.value);
    setCheckChange2(true);
  };

  const handleProItemImageChange = (event) => {
    setProItemImage(event.target.files[0]);
    setCheckChange2(true);
  };

  const handleUpdateProduct = (e) => {
    if (!checkChange) {
      e.preventDefault();
    } else {
      if (prodName !== "" && prodCrDate !== "" && proddesc !== "") {
        if (changeProImage) {
          const canvas = productEditor.getImageScaledToCanvas();
          const image = canvas.toDataURL();
          const productUpdate = {
            id: id,
            name: prodName,
            createDate: prodCrDate,
            description: proddesc,
            image: image,
            subcategory: { id: subCateId },
            brand: { id: brandId },
          };
         
          dispatch(updateProduct(productUpdate));
          setCheckChange(false);
          setChangeProImage(false);
          alert("ok");
        } else {
          const productUpdate = {
            id: id,
            name: prodName,
            createDate: prodCrDate,
            description: proddesc,
            image: fileImage,
            subcategory: { id: subCateId },
            brand: { id: brandId },
          };
          
          dispatch(createOrUpdateProduct(productUpdate));
          setCheckChange(false);
          alert("ok");
        }
      }
    }
  };

  const handleUpdateProductItem = () => {
    if (checkChange2) {
      var avat = null;
      if (proItemEditor) {
        const canvas = proItemEditor.getImageScaledToCanvas();
        avat = canvas.toDataURL();
        console.log(avat);
        // Lưu hình ảnh tại đây hoặc thực hiện các xử lý khác với hình ảnh
      }

      const productItemUpdate = {
        id: proItemId,
        sku: sku,
        createDate: itemCrDate,
        qtyInStock: stock,
        price: price,
        image: proItemImage,
        product: { id: id },
      };

      dispatch(createOrUpdateProductItem(productItemUpdate));
      alert("ok");
      setCheckChange2(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="EDIT PRODUCT" />

      <div className="card text-dark mb-3">
        <div className="card-header align-items-center justify-content-between d-flex">
          <div className="fw-bold">PRODUCT</div>

          <Button
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
                  <div className="col-12 pb-4 text-center">
                    {prodImage && (
                      <AvatarEditor
                        // ref={setProductEditor}
                        image={prodImage}
                        border={0}
                      />
                    )}
                    <br />
                    <div className="chooseImage">
                      <input
                        type="file"
                        onChange={handleProImageChange}
                        style={{ width: "160px" }}
                      />
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
                          value={prodName}
                          onChange={handleOnchangeProdName}
                          className="form-control"
                          id="name"
                        />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <label className="form-label">Brands</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={brandId}
                          onChange={handleChangeBrand}
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
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <label className="form-label">Subcategories</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={subCateId}
                          onChange={handleChangeSubCategory}
                        >
                          {listSub.map((subCate) => (
                            <option value={subCate.id} key={subCate.id}>
                              {subCate.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
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
                      onClick={handleUpdateProduct}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body row">
          <div className="col-3 col-md-3 col-sm-6 col-12 pb-4 text-center">
            {prodImage && (
              <AvatarEditor
                ref={setProductEditor}
                image={prodImage}
                border={0}
              />
            )}
            <br />
            <div className="chooseImage">
              <input
                type="file"
                onChange={handleProImageChange}
                style={{ width: "160px" }}
              />
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-6 col-12">
            <div className="row">
              <div className="col-12 mb-3">
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

              <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                <label className="form-label">Brands</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={brandId}
                  onChange={handleChangeBrand}
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
              <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                <label className="form-label">Subcategories</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={subCateId}
                  onChange={handleChangeSubCategory}
                >
                  {listSub.map((subCate) => (
                    <option value={subCate.id} key={subCate.id}>
                      {subCate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
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
              onClick={handleUpdateProduct}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      <div className="card text-dark">
        <div className="row card-header fw-bold align-items-center">
          <div className="col-lg-2 col-md-12 col-sm-12 col-12">
            PRODUCTITEMS:
          </div>
          <div className="col-10">
            <div className="row">
              {productItems.map((it) => (
                <div key={it.id} className="col-lg-2 col-md-3 col-sm-4 col-8">
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCickProductItem(it)}
                    className={`img-fluid pt-1 ${
                      borderColor === it.id ? "border border-danger" : ""
                    }`}
                    src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${it.image}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body row">
          <div className="col-3 col-md-3 col-sm-6 col-12 text-center pb-4">
            {proItemImage && (
              <AvatarEditor
                ref={setProItemEditor}
                image={`https://res.cloudinary.com/dmjh7imwd/image/upload/${proItemImage}`}
                border={0}
              />
            )}
            <br />
            <div className="chooseImage">
              <input
                type="file"
                onChange={handleProItemImageChange}
                style={{ width: "160px" }}
              />
            </div>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-6 col-12">
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
                <select
                  className="form-select"
                  aria-label="Color"
                  value={color}
                  onChange={handleChangeColor}
                >
                  {listColor.map((color) => (
                    <option value={color.value} key={color.id}>
                      {color.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 mb-3">
                <label htmlFor="size" className="form-label">
                  Size
                </label>
                <select
                  className="form-select"
                  aria-label="size"
                  value={size}
                  onChange={handleChangeSize}
                >
                  {listSize.map((size) => (
                    <option value={size.value} key={size.id}>
                      {size.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="card-header">
          <div className="float-end">
            <Button
              className="me-3"
              style={{ background: "#1F2A40", color: "white" }}
            >
              Create productItem
            </Button>
            <Button
              style={{ background: "#1F2A40", color: "white" }}
              onClick={handleUpdateProductItem}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default FormCreateProduct;
