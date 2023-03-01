import { Box, Button } from "@mui/material";
import { useState } from "react";
import { customListOfUsersWithRolesState } from "../../store/User/selector";
import MyTable from "../../components";
import { invoicesRowsDemoData, productsRowsDemoData } from "../../data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Management = () => {
    
    const navigate = useNavigate();

    const [tableToShow, setTableToShow] = useState("USERS")

    

    const usersRows = useSelector(customListOfUsersWithRolesState);
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
            renderCell: ({ row: { role } }) => {
                const roleString = role.join(' - ');
                return (<Box>{roleString}</Box>);
            },
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

    const invoicesRows = invoicesRowsDemoData;
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
                return (
                    userPaymentMethod.paymentType.value
                );
            },
        },
        {
            field: "createDate",
            headerName: "CREATE DATE",
            flex: 1,
        },
        {
            field: "address",
            headerName: "ADDRESS",
            flex: 1,
            renderCell: ({ row: { address } }) => {
                return (
                    address.addressLine
                );
            },
        },
        {
            field: "deliveryMethod",
            headerName: "DELIVERY MOTHOD",
            flex: 1,
            renderCell: ({ row: { deliveryMethod } }) => {
                return (
                    deliveryMethod.name
                );
            },
        },
        {
            field: "orderTotal",
            headerName: "TOTAL",
            flex: 1,
        },
        {
            field: "orderStatus",
            headerName: "STATUS",
            flex: 1,
        },
        {
            field: "",
            headerName: "",
            flex: 1,
            renderCell: ({ row: { id } }) => {
                return (
                    <Button
                        variant="contained"
                        sx={{ background: "#3E4396", color: "#FFF" }}
                    >SHOW DETAILS {id}</Button>
                );
            },
        },
    ];

    const productsRows = productsRowsDemoData;
    const productsColumns = [
        {
            field: "id",
            headerName: "ID"
        },
        {
            field: "product",
            headerName: "PRODUCT NAME",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: ({ row: { product } }) => {
                return (
                    product.name
                );
            },
        },
        {
            field: "SKU",
            headerName: "SKU",
            flex: 1,
        },
        {
            field: "createDate",
            headerName: "CREATE DATE",
            flex: 1,
        },
        {
            field: "qtyInStock",
            headerName: "QUANTITY IN STOCK",
            flex: 1,
        },
        {
            field: "price",
            headerName: "PRICE",
            flex: 1,
        },
        {
            field: "image",
            headerName: "IMAGE",
            flex: 1,
        },
    ]

    const [rows, setRows] = useState(usersRows);
    const [columns, setColumns] = useState(usersColumns);

    const handleChangeTable = (table) => {
        setTableToShow(table);

        if (table === "INVOICES") {
            setRows(invoicesRows);
            setColumns(invoicesColumns);
        } else if (table === "PRODUCTS") {
            setRows(productsRows);
            setColumns(productsColumns);
        } else {
            setRows(usersRows);
            setColumns(usersColumns);
        }
    }

    return (
        <Box m="20px">
            <Box border={"1px solid gray"}>
                <Button variant="filled" color="success" onClick={() => handleChangeTable("USERS")}>USERS</Button>
                <Button variant="filled" color="success" onClick={() => handleChangeTable("PRODUCTS")}>PRODUCTS</Button>
                <Button variant="filled" color="success" onClick={() => handleChangeTable("INVOICES")}>INVOICES</Button>
            </Box>

            <br></br>

            <MyTable
                rows={rows}
                columns={columns}
                title={"MANAGEMENT YOUR " + tableToShow}
            />


            <Box display="flex" justifyContent="end" mt="10px">
                {tableToShow === "USERS" && (
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
                {tableToShow === "PRODUCTS" && (
                    <Link
                        to={"/"}
                        style={{
                            textDecoration: 'none',
                            background: "#1F2A40",
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px"
                        }}
                    >
                        Create a new product
                    </Link>
                )}
            </Box>

        </Box>
    );
};

export default Management;
