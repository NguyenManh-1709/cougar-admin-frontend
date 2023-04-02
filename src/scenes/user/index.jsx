import { Box, Typography, useTheme } from "@mui/material";
import { usersWithRolesState } from "../../store/selectors";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const User = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();

    const usersWithRoles = useSelector(usersWithRolesState);

    const usersSorted = Object.values(usersWithRoles).sort((a, b) => new Date(b.createDate) - (new Date(a.createDate)));

    const usersColumns = [
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
            renderCell: ({ row: { createDate } }) => {
                return (
                    new Date(createDate).toLocaleDateString('en-GB')
                );
            },
        },
        {
            field: "role",
            headerName: "ROLES",
            flex: 1,
            renderCell: ({ row: { role } }) => {
                const color = (role[0] === "ADMIN") ? colors.greenAccent[400] : colors.redAccent[400];
                return (
                    <Box sx={{color: color}}>
                        {role}
                    </Box>
                );
            },
        }
    ];

    const [pageSize, setPageSize] = useState(10);

    const handlePageSizeChange = (params) => {
        setPageSize(params.pageSize);
    };

    const handleCellClick = (params) => {
        navigate(`/edit-admin/${params.row.id}`);
    };

    return (
        <Box m="20px">
            <Header title="MANAGEMENT YOUR USERS" />
            <Box
                m="40px 0 0 0"
                height="65vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        cursor: "pointer"
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .css-57oisa-MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
                        outline: "none !important"
                    },
                    "& .MuiDataGrid-root .MuiDataGrid-cell:focus": {
                        outline: "none !important"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                    "& .MuiDataGrid-selectedRowCount": {},
                    "& .MuiDataGrid-columnSeparator--sideRight": {
                        display: "none !important"
                    },
                    "& .MuiDataGrid-menuIcon": {
                        display: "none !important"
                    },
                    "& .MuiTablePagination-selectLabel.css-1rt5bto-MuiTablePagination-selectLabel": {
                        marginBottom: "0"
                    },
                    "& .MuiTablePagination-displayedRows.css-7ms3qr-MuiTablePagination-displayedRows": {
                        marginBottom: "0"
                    }
                }}
            >
                <DataGrid
                    sx={{ fontSize: "1rem" }}
                    rows={usersSorted}
                    columns={usersColumns}
                    getRowId={(row) => row.id}
                    onCellClick={handleCellClick}
                    isRowSelectable={() => { return false }}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    onPageSizeChange={handlePageSizeChange}
                />
            </Box>

            <Typography mt="1rem">
                Click on the row to edit.
            </Typography>

            <Box display="flex" justifyContent="end" mt="10px">
                <Link
                    to="/create-admin"
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
            </Box>
        </Box >
    );
};

export default User;
