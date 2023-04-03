import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { usersWithRolesState } from "../../store/selectors";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";

const User = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const navigate = useNavigate();

    const usersWithRoles = useSelector(usersWithRolesState);

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
                    <Box sx={{ color: color }}>
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

    const [usersToShow, setUsersToShow] = useState([]);

    const [roleFilter, setRoleFilter] = useState(-1);
    const [dateFilter, setDateFilter] = useState(-1);
    const [keywordFilter, setKeywordFilter] = useState("");

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleChangeDateFilter = (e) => {
        setDateFilter(e.target.value);

        if (e.target.value !== -2) {
            var today = new Date();
            if (e.target.value === 0) {
                setDateRange([today.getTime() - (7 * 24 * 60 * 60 * 1000), today]);
            } else if (e.target.value === 1) {
                setDateRange([today.getTime() - (30 * 24 * 60 * 60 * 1000), today])
            } else {
                setDateRange([null, null])
            }
        }
    }

    useEffect(() => {
        if (startDate === null && endDate === null) {
            setDateFilter(-1)
        }
    }, [startDate, endDate])

    useEffect(() => {
        // Filter roles
        const step1 = roleFilter === 0
            ? usersWithRoles.filter(item => item.role.includes("ADMIN"))
            : roleFilter === 1
                ? usersWithRoles.filter(item => item.role.includes("USER"))
                : usersWithRoles

        // Filter date
        const startTime = new Date(startDate).getTime();
        const endDateTypeDate = new Date(endDate);
        const endTime = new Date(endDateTypeDate.setDate(endDateTypeDate.getDate() + 1)).getTime();

        const step2 = (startDate !== null && endDate !== null)
            ? step1.filter(item => {
                const createDate = new Date(item.createDate).getTime();
                return createDate >= startTime && createDate <= endTime;
            })
            : step1;

        // Search
        const result = keywordFilter === ""
            ? step2
            : step2.filter(item => {
                const { fullname, email, phone } = item;
                const searchRegex = new RegExp(keywordFilter, 'i');
                return searchRegex.test(fullname) || searchRegex.test(email) || searchRegex.test(phone);
            });

        setUsersToShow(Object.values(result).sort((a, b) => new Date(b.createDate) - new Date(a.createDate)));
    }, [roleFilter, usersWithRoles, startDate, endDate, keywordFilter]);

    return (
        <Box m="20px">
            <Header title="MANAGEMENT YOUR USERS" />
            <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }}>
                <Grid xs={12} sm={6} md={6} xl={3}>
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TextField
                            label="Search by name, email or phone"
                            variant="filled"
                            sx={{ width: "100%" }}
                            value={keywordFilter}
                            onChange={(e) => setKeywordFilter(e.target.value)}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6} xl={3}>
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <FormControl
                            variant="filled"
                            sx={{
                                width: "100%",
                                "& .Mui-focused.css-1m1f1hj-MuiFormLabel-root-MuiInputLabel-root": {
                                    color: colors.grey[100],
                                    fontSize: "1rem"
                                }
                            }}
                        >
                            <InputLabel id="roles-filter-label">Roles</InputLabel>
                            <Select
                                labelId="roles-filter-label"
                                id="roles-filter"
                                value={roleFilter}
                                label="Roles"
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <MenuItem value={-1}>All</MenuItem>
                                <MenuItem value={0}>Admin only</MenuItem>
                                <MenuItem value={1}>User only</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6} xl={3}>
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <FormControl
                            variant="filled"
                            sx={{
                                width: "100%",
                                "& .Mui-focused.css-1m1f1hj-MuiFormLabel-root-MuiInputLabel-root": {
                                    color: colors.grey[100],
                                    fontSize: "1rem"
                                }
                            }}
                        >
                            <InputLabel id="date-filter-label">Date</InputLabel>
                            <Select
                                labelId="date-filter-label"
                                id="date-filter-select"
                                value={dateFilter}
                                label="Date"
                                onChange={handleChangeDateFilter}
                            >
                                <MenuItem value={-2}>Custom range</MenuItem>
                                <MenuItem value={-1}>All</MenuItem>
                                <MenuItem value={0}>Last 7 days</MenuItem>
                                <MenuItem value={1}>Last 30 days</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                {dateFilter === -2 && (
                    <Grid xs={12} sm={6} md={6} xl={3}>
                        <Box
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Box sx={{ width: "100%" }}>
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                    withPortal
                                    isClearable
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    fixedHeight
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="From - To"
                                    maxDate={new Date()}
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}
            </Grid>
            <Box
                m="20px 0 0 0"
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
                    rows={usersToShow}
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
