import { Box, Button, FormControl, InputLabel, List, ListItem, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { customListOfUsersWithRolesState } from "../../store/User/selector";
import { productItemsState } from "../../store/ProductItem/selector"
import { invoicesState } from "../../store/Invoice/selector";
import { invoicesDetailsState } from "../../store/InvoiceDetail/selector";
import { categoriesState } from "../../store/Category/selector";
import { subCategoriesState } from "../../store/SubCategory/selector";
import MyTable from "../../components/MyTable";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    p: 1,
    background: "#FFF",
    borderRadius: "8px"
};

const Management = () => {
    // Get data
    const invoicesDetails = useSelector(invoicesDetailsState);
    const usersRows = useSelector(customListOfUsersWithRolesState);
    const invoicesRows = useSelector(invoicesState);
    const productItems = useSelector(productItemsState);
    const categories = useSelector(categoriesState);
    const subCategories = useSelector(subCategoriesState);

    const navigate = useNavigate();

    // Show Invoice Details
    const [openInvoiceDetails, setOpenInvoiceDetails] = useState(false);
    const [invoiceDetailsToShow, setInvoiceDetailsToShow] = useState([{ productItemId: "", name: "", qty: "", price: "" }])
    const [invoiceSelected, setInvoiceSelected] = useState(
        {
            "id": "",
            "createDate": "",
            "orderTotal": "",
            "orderStatus": "",
            "userPaymentMethod": {
                "id": "",
                "provider": "",
                "accountNumber": "",
                "expiryDate": "",
                "isDefault": "",
                "user": {
                    "id": "",
                    "password": "",
                    "fullname": "",
                    "phone": "",
                    "email": "",
                    "createDate": "",
                    "avatar": "",
                    "resetPasswordToken": ""
                },
                "paymentType": {
                    "id": 2,
                    "value": ""
                }
            },
            "user": {
                "id": 1,
                "password": "",
                "fullname": "",
                "phone": "",
                "email": "",
                "createDate": "",
                "avatar": "",
                "resetPasswordToken": ""
            },
            "address": {
                "id": 1,
                "unitNumber": "",
                "addressLine": "",
                "district": "",
                "province": "",
                "countryName": "",
                "isDefault": "",
                "user": {
                    "id": "",
                    "password": "",
                    "fullname": "",
                    "phone": "",
                    "email": "",
                    "createDate": "",
                    "avatar": "",
                    "resetPasswordToken": ""
                }
            },
            "deliveryMethod": {
                "id": "",
                "name": "",
                "price": ""
            }
        }
    )

    const handleOpenInvoiceDetails = (id) => {
        const temp = invoicesRows.find(item => item.id === id);
        setInvoiceSelected(temp);

        setOpenInvoiceDetails(true);
        const resultToShow = invoicesDetails
            .filter(({ shopOrder }) => shopOrder.id === id)
            .map(({ qty, price, productItem }) => {
                const { id: productItemId, product: { name } } = productItem;
                return { productItemId, name, qty, price };
            });
        setInvoiceDetailsToShow(resultToShow);
    };

    const handleCloseInvoiceDetails = () => setOpenInvoiceDetails(false);


    const usersColumns = [
        {
            field: "id",
            headerName: "ID",
        },
        {
            field: "fullname",
            headerName: "FULLNAME",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phone",
            headerName: "PHONE",
            flex: 1,
        },
        {
            field: "email",
            headerName: "EMAIL",
            flex: 1,
        },
        {
            field: "createDate",
            headerName: "CREATEDATE",
            flex: 1,
        },
        {
            field: "role",
            headerName: "ROLES",
            flex: 1,
        },
        {
            field: "edit",
            headerName: "EDIT",
            flex: 1,
            renderCell: ({ row: { id, role } }) => {
                if (role.includes('ADMIN')) {
                    return (
                        <Link
                            to="/form-user"
                            onClick={(e) => {
                                e.preventDefault();
                                const user = usersRows.find(u => u.id === id);
                                navigate(`/form-user/${encodeURIComponent(JSON.stringify(user))}`);
                            }}
                            style={{
                                textDecoration: 'none',
                                background: "#1F2A40",
                                color: "white",
                                padding: "10px",
                                borderRadius: "5px"
                            }}
                        >
                            EDIT
                        </Link>
                    );
                } else { return (<Box></Box>); }
            },
        },
    ];

    const invoicesColumns = [
        {
            field: "id",
            headerName: "ID"
        },
        {
            field: "user",
            headerName: "USER",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: ({ row: { user } }) => {
                return (
                    user.fullname
                );
            },
        },
        {
            field: "userPaymentMethod",
            headerName: "PAYMENT METHOD",
            flex: 1,
            renderCell: ({ row: { userPaymentMethod } }) => {
                if (userPaymentMethod != null) {
                    return (
                        userPaymentMethod.paymentType.value
                    );
                }
            },
        },
        {
            field: "createDate",
            headerName: "CREATE DATE",
        },
        {
            field: "address",
            headerName: "ADDRESS",
            flex: 1,
            renderCell: ({ row: { address } }) => {
                if (address != null) {
                    return (
                        address.unitNumber + ", " +
                        address.addressLine + ", " +
                        address.district
                    );
                }
            },
        },
        {
            field: "deliveryMethod",
            headerName: "DELIVERY MOTHOD",
            flex: 1,
            renderCell: ({ row: { deliveryMethod } }) => {
                if (deliveryMethod != null) {
                    return (
                        deliveryMethod.name
                    );
                }
            },
        },
        {
            field: "orderTotal",
            headerName: "TOTAL",
            renderCell: ({ row: { orderTotal } }) => {
                return (
                    <Box>$ {orderTotal}</Box>
                );
            },
        },
        {
            field: "orderStatus",
            headerName: "STATUS",
            renderCell: ({ row: { orderStatus } }) => {
                return (
                    <Box>
                        {orderStatus === null ? "Pending" : orderStatus ? "Completed" : "Processing"}
                    </Box>
                );
            },
        },
        {
            field: "",
            headerName: "",
            renderCell: ({ row: { id } }) => {
                return (
                    <Button
                        variant="contained"
                        sx={{ background: "#3E4396", color: "#FFF" }}
                        onClick={() => handleOpenInvoiceDetails(id)}
                    >SHOW DETAILS</Button>
                );
            },
        },
    ];

    const [whatToManage, setWhatToManage] = useState("USERS")

    const [rows, setRows] = useState(usersRows);
    const [columns, setColumns] = useState(usersColumns);

    const handleChangeWhatToManage = (table) => {
        setWhatToManage(table);

        if (table === "INVOICES") {
            setRows(invoicesRows);
            setColumns(invoicesColumns);
        } else {
            setRows(usersRows);
            setColumns(usersColumns);
        }
    }

    const [categorySelected, setCategorySelected] = useState(() => { return (categories != null ? categories[0].id : 0) });
    const [subcategoriesBySelectedCategory, setSubcategoriesBySelectedCategory] = useState(() => { return (categorySelected !== 0 ? (subCategories.filter(subCategory => subCategory.category.id === categorySelected)) : []) });
    const [subCategorySelected, setSubCategorySelected] = useState(() => { return (subcategoriesBySelectedCategory != null ? subcategoriesBySelectedCategory[0].id : 0) });
    const [productsToShow, setProductsToShow] = useState(() => { return (subCategorySelected !== 0 ? (productItems.filter(productItem => productItem.product.subcategory.id === subCategorySelected)) : []) });

    return (
        <Box m="20px">
            {/* List buttons to change what to manage */}
            <Box border={"1px solid gray"}>
                <Button variant="filled" color="success" onClick={() => handleChangeWhatToManage("USERS")}>USERS</Button>
                <Button variant="filled" color="success" onClick={() => handleChangeWhatToManage("PRODUCTS")}>PRODUCTS</Button>
                <Button variant="filled" color="success" onClick={() => handleChangeWhatToManage("INVOICES")}>INVOICES</Button>
            </Box>

            {/* Show list USERS or INVOICES */}
            {(whatToManage === "USERS" || whatToManage === "INVOICES") && (
                <MyTable
                    rows={rows}
                    columns={columns}
                    title={"MANAGEMENT YOUR " + whatToManage}
                />
            )}

            {/* Show list PRODUCTS* */}
            {whatToManage === "PRODUCTS" && (
                <Box>
                    <Header title={"MANAGEMENT YOUR " + whatToManage} />

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
                                <WarningAmberIcon sx={{marginRight: "25px", fontSize: "30px"}}/>
                                <Box sx={{fontSize: "20px"}}>This category has no products!</Box>
                            </Box>
                        )}
                        {productsToShow.map((item) => (
                            <Box key={item.id} sx={{ width: "25%", padding: "15px" }}>
                                <ProductCard productItem={item} />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )
            }

            <Box display="flex" justifyContent="end" mt="10px">
                {whatToManage === "USERS" && (
                    <Link
                        to="/form-user"
                        onClick={(e) => {
                            e.preventDefault();
                            const user = {
                                id: "",
                                password: "",
                                fullname: "",
                                email: "",
                                phone: "",
                                createDate: new Date().toISOString().slice(0, 10),
                                avatar: "",
                            }
                            navigate(`/form-user/${encodeURIComponent(JSON.stringify(user))}`);
                        }}
                        style={{
                            textDecoration: 'none',
                            background: "#1F2A40",
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px"
                        }}
                    >
                        Create a new admin account
                    </Link>
                )}
            </Box>



            {/* Modal to show invoice details */}
            <Modal
                open={openInvoiceDetails}
                onClose={handleCloseInvoiceDetails}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ minWidth: 650, background: "black", color: "white", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
                        <List>
                            <ListItem>
                                <Box sx={{minWidth: "200px"}}>Invoice id</Box> {invoiceSelected.id}
                            </ListItem>
                            <ListItem>
                                <Box sx={{minWidth: "200px"}}>User</Box> {invoiceSelected.user.fullname}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Payment method</Box> {invoiceSelected.userPaymentMethod.paymentType.value}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Create date</Box> {invoiceSelected.createDate}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Address</Box> {invoiceSelected.address.unitNumber} {invoiceSelected.address.addressLine}, {invoiceSelected.address.district}, {invoiceSelected.address.province}, {invoiceSelected.address.countryName}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Delivery method</Box> {invoiceSelected.deliveryMethod.name}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Total</Box> ${invoiceSelected.orderTotal}
                            </ListItem>
                            <ListItem>
                            <Box sx={{minWidth: "200px"}}>Status</Box> {invoiceSelected.orderStatus === null ? "Pending" : invoiceSelected.orderStatus ? "Completed" : "Processing"}
                            </ListItem>
                        </List>
                    </Box>
                    <TableContainer >
                        <Table sx={{ minWidth: 650, background: "gray", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: "1rem", color: "white" }}>Product-item-id</TableCell>
                                    <TableCell sx={{ fontSize: "1rem", color: "white" }}>Product-name</TableCell>
                                    <TableCell sx={{ fontSize: "1rem", color: "white" }} align="right">Price</TableCell>
                                    <TableCell sx={{ fontSize: "1rem", color: "white" }} align="right">Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceDetailsToShow.map((item) => (
                                    <TableRow
                                        key={item.productItemId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontSize: "1rem", color: "white" }}>{item.productItemId}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", color: "white" }} component="th" scope="row">{item.name}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", color: "white" }} align="right">{item.price}</TableCell>
                                        <TableCell sx={{ fontSize: "1rem", color: "white" }} align="right">{item.qty}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </Box >
    );
};

export default Management;
