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
  getconfigurationsSelector,
  getVariationsSelector,
} from "../../store/selectors";
import {
  brandGetAll,
  getOptions,
  createOrUpdateProductItem,
  createOrUpdateProduct,
  getAllProductConfigurations,
  getAllVariation,
  updateProductConfigurations,
} from "../../store/apis";
import AvatarEditor from "react-avatar-editor";
import mySlice from "../../store/slices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { useTheme } from "@emotion/react";
// import { tokens } from "../../theme";

const FormCreateProduct = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOptions());
    dispatch(brandGetAll());
    dispatch(getAllProductConfigurations());
    dispatch(getAllVariation());
  }, [dispatch]);

  const productItems = useSelector(getProductItemByProductIdSelector(id));
  const categories = useSelector(categoriesState);
  const subCategories = useSelector(subCategoriesState);
  const brands = useSelector(brandsState);
  const options = useSelector(optionsState);
  const configurations = useSelector(getconfigurationsSelector);
  const getProduct = useSelector(getProductByIdSelector(id));
  const variations = useSelector(getVariationsSelector);

  const [listVariation, setListVariation] = useState([]);
  const [listSub, setListSub] = useState([]);
  const [listConfigurationCurrent, setListConfigurationCurrent] = useState([]);
  const [listOption, setListOption] = useState({});

  const [checkChange, setCheckChange] = useState(false);
  const [checkChange2, setCheckChange2] = useState(false);
  const [checkChangeOption, setCheckChangeOption] = useState(false);
  const [checkChangeCateOrSub, setCheckChangeCateOrSub] = useState(false);
  const [checkChangeCre, setCheckChangeCre] = useState(false);

  //update product
  const [prodName, setProdName] = useState("");
  const [brandId, setBrandId] = useState(0);
  const [cateName, setCateName] = useState("");
  const [subCateId, setSubCateId] = useState(0);
  const [prodCrDate, setprodCrDate] = useState("");
  const [proddesc, setProddesc] = useState("");
  //image
  const [fileImage, setFileImage] = useState(null);
  const [prodImage, setProdImage] = useState(null);
  const [productEditor, setProductEditor] = useState(null);
  const [changeProImage, setChangeProImage] = useState(false);
  //----------

  //update item
  const [proItem, setProItem] = useState({});
  const [sku, setSku] = useState("");
  const [itemUpDate, setItemUpDate] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [option, setOption] = useState([]);

  const [borderColor, setBorderColor] = useState(0);
  //image
  const [proItemImage, setProItemImage] = useState(null);
  const [proItemEditor, setProItemEditor] = useState(null);
  const [changeProItemImage, setChangeProItemImage] = useState(false);
  const [fileImageItem, setFileImageItem] = useState(null);
  //------

  //CREATE ITEM
  const [proItemIdCr, setProItemIdCr] = useState(0);
  const [skuCr, setSkuCr] = useState("");
  const [stockCr, setStockCr] = useState(0);
  const [priceCr, setPriceCr] = useState(0);
  const [listOptionCreate, setListOptionCreate] = useState("");

  //image
  const [proItemImageCr, setProItemImageCr] = useState(null);
  const [proItemEditorCr, setProItemEditorCr] = useState(null);
  //------

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
      const listSubca = subCategories.filter(
        (sub) => sub.category.id === getProduct.subcategory.category.id
      );

      setListSub(listSubca);

      const variationsBySubID = variations.filter(
        (va) => va.subcategory.id === getProduct.subcategory.id
      );
      if (variationsBySubID.length > 0) {
        setListVariation(variationsBySubID);
      }

      if (options.length) {
        const listOp = options.filter(
          (op) => op.variation.subcategory.id === getProduct.subcategory.id
        );
        setListOption(listOp);
      }
      if (configurations.length) {
        const listConCurrentSub = configurations.filter(
          (con) =>
            con.option.variation.subcategory.id === getProduct.subcategory.id
        );
        setListConfigurationCurrent(listConCurrentSub);
      }
    }
  }, [getProduct, options.length > 0, configurations.length > 0]);

  useEffect(() => {
    if (productItems.length) {
      setProItem(productItems[0]);
      setPrice(productItems[0].price);
      setProItemImage(
        `https://res.cloudinary.com/dmjh7imwd/image/upload/${productItems[0].image}`
      );
      setStock(productItems[0].qtyInStock);
      setItemUpDate(productItems[0].createDate);

      if (configurations.length) {
        const exit = configurations
          .filter((con) => con.productItem.id === productItems[0].id)
          .map((p) => p.option);

        if (exit.length > 0) {
          setOption(exit);
          setListOptionCreate(exit);
        }
      }

      setSku(productItems[0].sku);
      setBorderColor(productItems[0].id);
      setFileImageItem(productItems[0].image);
    }
  }, [productItems.length > 0, configurations.length > 0]);

  //HANDLE UPDATE PRODUCT
  const handleOnchangeProdName = (e) => {
    setProdName(e.target.value);
    setCheckChange(true);
  };

  const handleChangeBrand = (e) => {
    setBrandId(e.target.value);
    setCheckChange(true);
  };

  //CHANG CATEGORY
  const handleChangeCategory = (e) => {
    setCateName(e.target.value);

    const listSub = subCategories.filter(
      (sub) => sub.category.name === e.target.value
    );
    setListSub(listSub);
    setSubCateId(listSub[0].id);
    setCheckChange(true);

    if (listSub.length > 0) {
      const variationsBySubID = variations.filter(
        (va) => va.subcategory.id === listSub[0].id
      );
      if (variationsBySubID.length > 0) {
        setListVariation(variationsBySubID);
      }

      if (options.length > 0) {
        const listOp = options.filter(
          (op) => op.variation.subcategory.id === listSub[0].id
        );
        setListOption(listOp);

        //check neu sub da co option
        if (
          listOp.some(
            (op) =>
              op.variation.subcategory.id === proItem.product.subcategory.id
          )
        ) {
          if (configurations.length > 0) {
            const exit = configurations
              .filter((con) => con.productItem.id === proItem.id)
              .map((p) => p.option);

            if (exit.length > 0) {
              setOption(exit);
              console.log("category co thang da chon");

              setCheckChangeCateOrSub(false); //neu chon cate ma co option roi thif check lai false de khong cap nhat
            }
          }
        } else {//khong co option trong sub dang chon
          console.log("khong chon gi category");
          if (listOp.length > 0) {
            const liop = listOp.reduce((accumulator, currentValue) => {
              if (
                !accumulator.some(
                  (item) => item.variation.id === currentValue.variation.id
                )
              ) {
                accumulator.push(currentValue);
              }
              return accumulator;
            }, []);
            setOption(liop);//set cho item dang chon
            setListOptionCreate(liop);//set cho create item

            setCheckChangeOption(true);//cap nhat option cho item dang chon
            setCheckChangeCateOrSub(true);//check de cap nhat cac item k chon
          } else {
            alert("Chua co option, chon sub khac");
            setCheckChange(false);
          }
        }
      }
    }
    if (configurations.length) {
      const listConCurrentSub = configurations.filter(
        (con) =>
          con.option.variation.subcategory.id === proItem.product.subcategory.id
      );
      setListConfigurationCurrent(listConCurrentSub);
    }
  };

  const handleChangeSubCategory = (e) => {
    const subID = +e.target.value;
    setSubCateId(subID);
    setCheckChange(true);

    
    if (listSub.length > 0) {
      const variationsBySubID = variations.filter(
        (va) => va.subcategory.id === subID
      );
      if (variationsBySubID.length > 0) {
        setListVariation(variationsBySubID);
      }

      if (options.length) {
        const listOp = options.filter(
          (op) => op.variation.subcategory.id === subID
        );
        setListOption(listOp);

        if (
          listOp.some(
            (op) =>
              op.variation.subcategory.id === proItem.product.subcategory.id
          )
        ) {
          if (configurations.length) {
            const exit = configurations
              .filter((con) => con.productItem.id === proItem.id)
              .map((p) => p.option);

            if (exit.length > 0) {
              setOption(exit);
              setCheckChangeCateOrSub(false); //neu chon cate ma co option roi thif check lai false de khong cap nhat
            }
          }
        } else {
          if (listOp.length > 0) {
            const liop = listOp.reduce((accumulator, currentValue) => {
              if (
                !accumulator.some(
                  (item) => item.variation.id === currentValue.variation.id
                )
              ) {
                accumulator.push(currentValue);
              }
              return accumulator;
            }, []);
            setOption(liop);
            setListOptionCreate(liop);

           setCheckChangeOption(true);//cap nhat option cho item dang chon
          setCheckChangeCateOrSub(true);//check de cap nhat cac item k chon
          } else {
            alert("Chua co option, chon sub khac");
            setCheckChange(false);
          }
        }
      }
    }
    if (configurations.length) {
      const listConCurrentSub = configurations.filter(
        (con) =>
          con.option.variation.subcategory.id === proItem.product.subcategory.id
      );
      setListConfigurationCurrent(listConCurrentSub);
    }
  };

  const handleOnchangeProdCrDate = (e) => {
    setprodCrDate(e.target.value);
    setCheckChange(true);
  };

  const handleOnchangeDesc = (e) => {
    setProddesc(e.target.value);
    setCheckChange(true);
  };

  //set image
  const handleProImageChange = (event) => {
    setProdImage(event.target.files[0]);
    setCheckChange(true);
    setChangeProImage(true);
    setFileImage(event.target.files[0]);
  };
  //----------

  //HANDLE UPDATE PRODUCT ITEM
  const handleOnchangeSku = (e) => {
    setSku(e.target.value.toUpperCase());
    setCheckChange2(true);
  };

  const handleChangePrice = (e) => {
    setPrice(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeItemCrDate = (e) => {
    setItemUpDate(e.target.value);
    setCheckChange2(true);
  };

  const handleChangeStock = (e) => {
    setStock(e.target.value);
    setCheckChange2(true);
  };

  const handleOptionChange = (opt) => {
    const pop = option;
    //check neu option vua click cung sub voi option dang luu
    if (
      pop.some(
        (op) => op.variation.subcategory.id === opt.variation.subcategory.id
      )
    ) {
      //check neu khong trung thi thay the vao theo variation
      const exit = pop.find((op) => op.id === opt.id);
      if (!exit) {
        const listO = pop.filter((op) => op.variation.id !== opt.variation.id);
        listO.push(opt);
        setOption(listO);//set lai option luu tru cho item dang chon
      }
    } else {//neu khong trung subcate thi tao list option moi cho item dang con
      const listO = [];
      listO.push(opt);
      setOption(listO);
    }
    setCheckChangeOption(true);//check de cap nhat option cho item dang chon
  };

  const handleProItemImageChange = (event) => {
    setProItemImage(event.target.files[0]);
    setCheckChange2(true);
    setChangeProItemImage(true);
    setFileImageItem(event.target.files[0]);
  };

  const handleCickProductItem = (proItem) => {
    setProItem(proItem);
    setItemUpDate(proItem.createDate);
    setPrice(proItem.price);
    setProItemImage(
      `https://res.cloudinary.com/dmjh7imwd/image/upload/${proItem.image}`
    );
    setStock(proItem.qtyInStock);
    setSku(proItem.sku);
    setBorderColor(proItem.id);
    setCheckChange2(false);
    setFileImageItem(proItem.image);

    if (options.length) {
      const listOp = options.filter(
        (op) => op.variation.subcategory.id === subCateId
      );

      if (
        listOp.some(
          (op) => op.variation.subcategory.id === proItem.product.subcategory.id
        )
      ) {
        if (configurations.length) {
          const exit = configurations
            .filter((con) => con.productItem.id === proItem.id)
            .map((p) => p.option);

          if (exit.length > 0) {
            setOption(exit);
          }
        }
      } else {
        if (listOp.length > 0) {
          const liop = listOp.reduce((accumulator, currentValue) => {
            if (
              !accumulator.some(
                (item) => item.variation.id === currentValue.variation.id
              )
            ) {
              accumulator.push(currentValue);
            }
            return accumulator;
          }, []);
          setOption(liop);
          setCheckChangeCateOrSub(true);
          setCheckChangeOption(true);
        }
      }
    }
  };

  const handleUpdate = () => {
    //cap nhat product
    if (checkChange) {
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

          dispatch(
            createOrUpdateProduct({ product: productUpdate, image: true })
          );

          const prdit = productItems.map((it) => {
            return {
              ...it,
              product: { ...it.product, subcategory: { id: subCateId } },
            };
          });

          dispatch(mySlice.actions.updateProItem(prdit));

          setCheckChange(false);
          setChangeProImage(false);
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

          dispatch(
            createOrUpdateProduct({ product: productUpdate, image: false })
          );

          const prdit = productItems.map((it) => {
            return {
              ...it,
              product: { ...it.product, subcategory: { id: subCateId } },
            };
          });

          dispatch(mySlice.actions.updateProItem(prdit));

          setCheckChange(false);
        }

        toast.success('Update Product Successed!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      }
    }

    //capnhat product item
    if (checkChange2) {
      if (
        productItems.length > 0 &&
        sku !== "" &&
        +price !== 0 &&
        !isNaN(price) &&
        price !== "" &&
        +stock !== 0 &&
        stock !== "" &&
        !isNaN(stock) &&
        itemUpDate !== ""
      ) {
        if (changeProItemImage) {
          const canvas = proItemEditor.getImageScaledToCanvas();
          const image = canvas.toDataURL();

          const productItemUpdate = {
            id: proItem.id,
            sku: sku,
            createDate: itemUpDate,
            qtyInStock: stock,
            price: price,
            image: image,
            product: { id: id },
          };

          dispatch(
            createOrUpdateProductItem({ item: productItemUpdate, check: true })
          );
          setCheckChange2(false);
          setChangeProItemImage(false);
        } else {
          const productItemUpdate = {
            id: proItem.id,
            sku: sku,
            createDate: itemUpDate,
            qtyInStock: stock,
            price: price,
            image: fileImageItem,
            product: { id: id },
          };

          dispatch(
            createOrUpdateProductItem({ item: productItemUpdate, check: false })
          );

          setCheckChange2(false);
        }

        toast.success('Update ProductItem Successed!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      }
    }

    //cap nhat option cho item dang chon
    if (checkChangeOption) {
      if (option.length > 0) {
        //list nhung configu cua item dang chon
        const lCon = configurations.filter(
          (con) => con.productItem.id === proItem.id
        );

        if (lCon.length > 0) {
          lCon.forEach((con) => {
            //check neu khong trung voi option nao trong option luu tru thi cap nhat
            if (!option.some((op) => con.option.id === op.id)) {
              const phj = option.find(
                (top) => top.variation.name === con.option.variation.name
              );

              //thay sub khac cho item
              const {
                product: { subcategory, ...product },
                ...rest
              } = proItem;

              var sub = {};
              sub.id = subCateId;
              product.subcategory = sub;
              rest.product = product;
              setProItem(rest);
              //---

              const updateCon = {
                id: con.id,
                productItem: rest,
                option: phj,
              };
              dispatch(updateProductConfigurations(updateCon));
              setCheckChangeOption(false);
              console.log("sua thg dang chon xong", checkChangeOption);

              
            }
          });
          toast.success('Update Option Successed!', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light'
          });
        }
      }
    }

    //cap nhat option cho cac item con lai
    if (checkChangeCateOrSub) {
      const listOp = options.filter(
        (op) => op.variation.subcategory.id === subCateId
      );
      if (listOp.length > 0) {
        const liop = listOp.reduce((accumulator, currentValue) => {
          if (
            !accumulator.some(
              (item) => item.variation.id === currentValue.variation.id
            )
          ) {
            accumulator.push(currentValue);
          }
          return accumulator;
        }, []);

        if (listConfigurationCurrent.length > 0) {
          listConfigurationCurrent.forEach((con) => {
            productItems
              .filter((ite) => ite.id !== proItem.id)
              .forEach((item) => {
                if (con.productItem.id === item.id) {
                  liop.forEach((oppp) => {
                    if (con.option.variation.name === oppp.variation.name) {
                      const upCO = {
                        id: con.id,
                        productItem: item,
                        option: oppp,
                      };
                      dispatch(updateProductConfigurations(upCO));

                      console.log("sua configu con lai");
                      setCheckChangeCateOrSub(false);
                    }
                  });
                }
              });
          });
        }
      }
    }
  };
  //--------------------

  //HANDLE CREATE PRODUCT ITEM
  const handleOnchangeSkuCr = (e) => {
    setSkuCr(e.target.value.toUpperCase());
    setCheckChangeCre(true);
  };

  const handleChangePriceCr = (e) => {
    setPriceCr(e.target.value);
    setCheckChangeCre(true);
  };

  const handleChangeStockCr = (e) => {
    setStockCr(e.target.value);
    setCheckChangeCre(true);
  };

  const handleChooseOpCre = (e) => {
    const opIDChoose = +e.target.value;
    const pop = listOptionCreate;

    const OpCh = listOption.find((op) => op.id === opIDChoose);

    if (OpCh) {
      if (
        pop.some(
          (op) => op.variation.subcategory.id === OpCh.variation.subcategory.id
        )
      ) {
        const exit = pop.find((op) => op.id === OpCh.id);
        if (!exit) {
          const listO = pop.filter(
            (op) => op.variation.id !== OpCh.variation.id
          );
          listO.push(OpCh);
          setListOptionCreate(listO);
          // console.log(listO);
        }
      } else {
        const listO = [];
        listO.push(OpCh);
        setListOptionCreate(listO);
      }
    }
  };

  const handleProItemImageChangeCr = (event) => {
    setProItemImageCr(event.target.files[0]);
    setCheckChangeCre(true);
  };

  const handleCreateProductItem = () => {
    if (checkChangeCre) {
      if (
        skuCr !== "" &&
        +priceCr !== 0 &&
        priceCr !== "" &&
        !isNaN(priceCr) &&
        +stockCr !== 0 &&
        stockCr !== "" &&
        !isNaN(stockCr) &&
        proItemImageCr
      ) {
        const canvas = proItemEditorCr.getImageScaledToCanvas();
        const image = canvas.toDataURL();

        const productItemCreate = {
          sku: skuCr,
          qtyInStock: stockCr,
          price: priceCr,
          image: image,
          product: getProduct,
        };

        dispatch(
          createOrUpdateProductItem({ item: productItemCreate, check: true, listOp: listOptionCreate})
        );
        setCheckChangeCre(false);
        setSkuCr("");
        setStockCr(0);
        setPriceCr(0);

        toast.success('Create Successed!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      }
    }
  };
  //--------------------

  return (
    <Box m="20px">
      <Header title="EDIT PRODUCT" />

      <div className="card text-dark mb-3">
        <div className="card-header">
          <div className="fw-bold">PRODUCT</div>
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
          </div>
        </div>
      </div>
      <div className="card text-dark">
        <div className="row card-header fw-bold align-items-center">
          <div className="col-lg-2 col-md-12 col-sm-12 col-12">
            PRODUCT VARIANTS:
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
                image={proItemImage}
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
                  id="itemUpDate"
                  value={itemUpDate}
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

              {listVariation.map((va) => (
                <div key={va.id} className="col-6 mb-3">
                  <label htmlFor="color" className="form-label text-danger">
                    {va.name}
                  </label>
                  <div className="row">
                    {listOption.map(
                      (op) =>
                        op.variation.id === va.id && (
                          <div key={op.id} className="form-check col-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={va.name}
                              id={`Radio-${op.id}`}
                              checked={option.some((opp) => opp.id === op.id)}
                              onChange={() => handleOptionChange(op)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`Radio-${op.id}`}
                            >
                              {op.value}
                            </label>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-footer d-flex">
          <div className="mx-auto">
            <Button
              className="me-3"
              style={{ background: "#1F2A40", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#createProductItemModal"
            >
              Create productItem
            </Button>
            {/* Modal */}
            <div
              className="modal fade"
              id="createProductItemModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="card-body row">
                    <div className="fw-bold">CREATE PRODUCT ITEM</div>
                    <div className="text-center">Choose Image:</div>
                    <div className="col-12 text-center pb-4">
                      {proItemImageCr && (
                        <AvatarEditor
                          ref={setProItemEditorCr}
                          image={proItemImageCr}
                          border={0}
                        />
                      )}
                      <br />
                      <div className="chooseImage">
                        <input
                          type="file"
                          onChange={handleProItemImageChangeCr}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-6 mb-3">
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
                            <label htmlFor="size" className="form-label">
                              {va.name}
                            </label>
                            <select
                              className="form-select"
                              aria-label="size"
                              onChange={handleChooseOpCre}
                            >
                              {listOption.map(
                                (op) =>
                                  op.variation.id === va.id && (
                                    <option value={op.id} key={op.id}>
                                      {op.value}
                                    </option>
                                  )
                              )}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    style={{ background: "#1F2A40", color: "white" }}
                    onClick={handleCreateProductItem}
                    className="text-end"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="ms-auto">
            <Button
              style={{ background: "#1F2A40", color: "white" }}
              onClick={handleUpdate}
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
