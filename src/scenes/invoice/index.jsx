import { Box, Button, Card, CardContent, CardMedia, FormControl, InputLabel, List, ListItem, MenuItem, Modal, Select, Step, StepLabel, Stepper, TextField, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { invoicesState, invoiceDetailsState } from "../../store/selectors";
import { useSelector } from "react-redux";
import { invoiceStatusPut } from "../../store/apis";
import { useDispatch } from "react-redux";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%",
  bgcolor: 'background.paper',
  borderRadius: "8px",
  zIndex: 1001,
};

const Invoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const invoices = useSelector(invoicesState);
  const invoiceDetails = useSelector(invoiceDetailsState);

  const [openInvoiceDetails, setOpenInvoiceDetails] = useState(false);
  const [invoiceDetailsToShow, setInvoiceDetailsToShow] = useState();
  const [invoiceSelected, setInvoiceSelected] = useState();

  const handleCloseInvoiceDetails = () => setOpenInvoiceDetails(false);

  const handleChangeInvoiceStatus = (id) => {
    const temp = invoices.find(item => item.id === id);
    const invoiceToUpdate = {
      ...temp,
      orderStatus: temp.orderStatus + 1
    };
    dispatch(invoiceStatusPut(invoiceToUpdate));
  }

  const invoicesColumns = [
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
          userPaymentMethod === null ? "Cash on delivery" : userPaymentMethod.paymentType.value
        );
      },
    },
    {
      field: "createDate",
      headerName: "CREATE DATE",
      flex: 1,
      renderCell: ({ row: { createDate } }) => {
        return (
          new Date(createDate).toLocaleDateString('en-GB')
        );
      },
    },
    {
      field: "deliveryMethod",
      headerName: "DELIVERY METHOD",
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
      flex: 1,
      renderCell: ({ row: { orderStatus } }) => {
        const text = orderStatus === 0
          ? "PENDING"
          : orderStatus === 1
            ? "PROCESSING"
            : orderStatus === 2
              ? "IN TRANSIT"
              : orderStatus === 3
                ? "COMPLETED"
                : "";

        const color = orderStatus === 0
          ? colors.primary[100]
          : orderStatus === 1
            ? colors.redAccent[300]
            : orderStatus === 2
              ? colors.blueAccent[300]
              : orderStatus === 3
                ? colors.greenAccent[400]
                : "";
        return (
          <Box sx={{ color: color }}>
            {text}
          </Box>
        );
      },
    },
    {
      field: "ACTION",
      headerName: "ACTION",
      flex: 1,
      renderCell: ({ row: { id, orderStatus } }) => {
        const text = orderStatus === 0
          ? "Change to Processing"
          : orderStatus === 1
            ? "Change to In transit"
            : orderStatus === 2
              ? "Change to Completed"
              : "";
        return (
          <Box sx={{ width: "100%" }}>
            {(orderStatus in [1, 2, 3]) &&
              <Button
                variant="contained"
                sx={{ background: "#3E4396", color: "#FFF", width: "100%" }}
                onClick={() => handleChangeInvoiceStatus(id)}
              >
                {text}
              </Button>
            }
          </Box>
        );
      },
    },
  ];

  const invoiceDetailsColumns = [
    {
      field: "sku",
      headerName: "SKU",
      renderCell: ({ row: { sku } }) => {
        return (
          sku
        );
      },
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { name } }) => {
        return (
          name
        );
      },
    },
    {
      field: "qty",
      headerName: "QUANTITY",
      renderCell: ({ row: { qty } }) => {
        return (
          qty
        );
      },
    },
    {
      field: "price",
      headerName: "PRICE",
      renderCell: ({ row: { price } }) => {
        return (
          "$ " + price
        );
      },
    },
  ];

  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  const handleCellClick = (params) => {
    if (params.field !== "ACTION") {
      const temp = invoices.find(item => item.id === params.row.id);
      setInvoiceSelected(temp);

      setOpenInvoiceDetails(true);
      const resultToShow = invoiceDetails
        .filter(({ shopOrder }) => shopOrder.id === params.row.id)
        .map(({ qty, price, productItem }) => {
          const { id: productItemId, product: { name }, image, sku } = productItem;
          return { productItemId, name, qty, price, image, sku };
        });
      setInvoiceDetailsToShow(resultToShow);
    }
  };

  const [invoicesToShow, setInvoicesToShow] = useState([]);

  const [statusFilter, setStatusFilter] = useState(-1);
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
    // Filter status
    const step1 = statusFilter === -1
      ? invoices
      : invoices.filter(item => item.orderStatus === statusFilter);

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
        const { user: { fullname } } = item;

        const searchRegex = new RegExp(keywordFilter, 'i');
        return searchRegex.test(fullname);
      });

    setInvoicesToShow(Object.values(result).sort((a, b) => new Date(b.createDate) - new Date(a.createDate)));
  }, [keywordFilter, invoices, statusFilter, startDate, endDate]);

  return (
    <Box m="20px">
      <Header title="MANAGEMENT YOUR INVOICES" />

      <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }}>
        <Grid xs={12} sm={6} md={6} xl={3}>
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              label="Search by customer name"
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
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value={-1}>All</MenuItem>
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>Processing</MenuItem>
                <MenuItem value={2}>In transit</MenuItem>
                <MenuItem value={3}>Completed</MenuItem>
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
                <MenuItem value={-2}>
                  Custom range
                </MenuItem>
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
          rows={invoicesToShow}
          columns={invoicesColumns}
          getRowId={(row) => row.id}
          onCellClick={handleCellClick}
          isRowSelectable={() => { return false }}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      <Typography mt="1rem">
        Click on the row to see details.
      </Typography>

      {invoiceSelected && (
        <Modal
          open={openInvoiceDetails}
          onClose={handleCloseInvoiceDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }} sx={{ maxHeight: "80vh", overflow: "auto", backgroundColor: colors.grey[400] }}>
              <Grid xs={12} xl={5}>
                <Card sx={{ background: "#FFF", height: "70vh" }}>
                  <Box sx={{ display: "flex" }}>
                    <CardMedia
                      sx={{ width: "150px", objectFit: "contain", padding: "10px 0 0 10px" }}
                      component="img"
                      image={`https://res.cloudinary.com/dmjh7imwd/image/upload/v1678996695/CougarStore/logo512_jiqu4e.png`}
                      alt=""
                    />
                    <Typography variant="h1" color={"#008B8B"} display="flex" alignItems="center">
                      Cougar Store
                    </Typography>
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "end", alignItems: "center" }}>
                      <CardMedia
                        sx={{ width: "150px", objectFit: "contain", padding: "10px 10px 0 0" }}
                        component="img"
                        image={`https://res.cloudinary.com/dmjh7imwd/image/upload/v1679013232/CougarStore/seal_xkpiqc.png`}
                        alt=""
                      />
                    </Box>
                  </Box>
                  <CardContent sx={{ color: "#000", padding: "0 16px" }}>
                    <List>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>ID</Box> {invoiceSelected.id}
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>User</Box> {invoiceSelected.user.fullname}
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>Payment method</Box> {invoiceSelected.userPaymentMethod === null ? "Cash on delivery" : invoiceSelected.userPaymentMethod.paymentType.value}
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>Create date</Box>
                        {new Date(invoiceSelected.createDate).toLocaleDateString('en-GB')}
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{new Date(invoiceSelected.createDate).getHours() + ":" + new Date(invoiceSelected.createDate).getMinutes() + ":" + new Date(invoiceSelected.createDate).getSeconds()}</span>
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>Delivery method</Box> {invoiceSelected.deliveryMethod.name}
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>Total</Box> $ {invoiceSelected.orderTotal}
                      </ListItem>
                      <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                        <Box sx={{ minWidth: "150px" }}>Address</Box> {invoiceSelected.address.unitNumber} {invoiceSelected.address.addressLine}, {invoiceSelected.address.district}, {invoiceSelected.address.province}, {invoiceSelected.address.countryName}
                      </ListItem>
                    </List>
                    <Stepper activeStep={invoiceSelected.orderStatus + 1} alternativeLabel sx={{ marginTop: "50px" }}>
                      <Step sx={{ padding: 0 }}>
                        <StepLabel>Pending</StepLabel>
                      </Step>
                      <Step sx={{ padding: 0 }}>
                        <StepLabel>Processing</StepLabel>
                      </Step>
                      <Step sx={{ padding: 0 }}>
                        <StepLabel>In transit</StepLabel>
                      </Step>
                      <Step sx={{ padding: 0 }}>
                        <StepLabel>Completed</StepLabel>
                      </Step>
                    </Stepper>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} xl={7}>
                <Box
                  height="70vh"
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
                    sx={{ fontSize: "0.9rem" }}
                    rows={invoiceDetailsToShow}
                    columns={invoiceDetailsColumns}
                    getRowId={(row) => row.productItemId}
                    isRowSelectable={() => { return false }}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </Box >
  );
};

export default Invoice;
