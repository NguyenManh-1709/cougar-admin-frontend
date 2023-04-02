import { Box, Button, Card, CardContent, CardMedia, Grid, List, ListItem, Modal, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { invoicesState, invoiceDetailsState } from "../../store/selectors";
import { useSelector } from "react-redux";
import { invoiceStatusPut } from "../../store/apis";
import { useDispatch } from "react-redux";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";

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
  const invoiceDetails = useSelector(invoiceDetailsState);
  const invoices = useSelector(invoicesState).filter(item => item.orderStatus !== null);

  const invoicesSorted = Object.values(invoices).sort((a, b) => new Date(b.createDate) - (new Date(a.createDate)));

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
      field: "image",
      headerName: "IMAGE",
      renderCell: ({ row: { image } }) => {
        return (
          <img src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${image}`} alt="" width="50px" />
        );
      },
    },
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

  return (
    <Box m="20px">
      <Header title="MANAGEMENT YOUR INVOICES" />
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
          rows={invoicesSorted}
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
            <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }} sx={{ maxHeight: "80vh", overflow: "auto", padding: "10px", backgroundColor: colors.grey[400] }}>
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
                        <Box sx={{ minWidth: "150px" }}>Create date</Box> {new Date(invoiceSelected.createDate).toLocaleDateString('en-GB')}
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
