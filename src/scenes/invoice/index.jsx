import { Box, Button, Card, CardContent, CardMedia, IconButton, List, ListItem, Modal, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { invoicesState, invoiceDetailsState } from "../../store/selectors";
import MyTable from "../../components/MyTable";
import { useSelector } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { invoiceStatusPut } from "../../store/apis";
import { useDispatch } from "react-redux";
import { tokens } from "../../theme";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%",
  bgcolor: 'background.paper',
  borderRadius: "8px"
};

const Invoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const invoiceDetails = useSelector(invoiceDetailsState);
  const invoices = useSelector(invoicesState).filter(item => item.orderStatus !== null);

  const [openInvoiceDetails, setOpenInvoiceDetails] = useState(false);
  const [invoiceDetailsToShow, setInvoiceDetailsToShow] = useState();
  const [invoiceSelected, setInvoiceSelected] = useState();

  const handleOpenInvoiceDetails = (id) => {
    const temp = invoices.find(item => item.id === id);
    setInvoiceSelected(temp);

    setOpenInvoiceDetails(true);
    const resultToShow = invoiceDetails
      .filter(({ shopOrder }) => shopOrder.id === id)
      .map(({ qty, price, productItem }) => {
        const { id: productItemId, product: { name }, image, sku } = productItem;
        return { productItemId, name, qty, price, image, sku };
      });
    setInvoiceDetailsToShow(resultToShow);
  };

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
      flex: 1,
      renderCell: ({ row: { createDate } }) => {
        const temp = new Date(createDate).toISOString().slice(0, 10);
        return (
          temp
        );
      },
    },
    {
      field: "address",
      headerName: "ADDRESS",
      flex: 1,
      renderCell: ({ row: { address } }) => {
        if (address != null) {
          const temp = address.unitNumber + ", " + address.addressLine + ", " + address.district;
          const toShow = temp.length > 15 ? temp.slice(0, 15) + "..." : temp.length;
          return (
            toShow
          );
        }
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
      field: "CHANGE STATUS",
      headerName: "CHANGE STATUS",
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
    {
      field: "SHOW DETAILS",
      headerName: "SHOW DETAILS",
      flex: 1,
      renderCell: ({ row: { id } }) => {
        return (
          <Tooltip title="Show details" placement="right">
            <IconButton onClick={() => handleOpenInvoiceDetails(id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <MyTable
        rows={invoices}
        columns={invoicesColumns}
        title={"MANAGEMENT YOUR INVOICES"}
      />

      {invoiceSelected && (
        <Modal
          open={openInvoiceDetails}
          onClose={handleCloseInvoiceDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ background: colors.primary[300], borderRadius: "8px", padding: "10px", display: "flex", gap: "10px", maxHeight: "70vh" }}>
              <Card sx={{ background: "#FFF", width: "50%" }}>
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
                      <Box sx={{ minWidth: "150px" }}>Payment method</Box> {invoiceSelected.userPaymentMethod.paymentType.value}
                    </ListItem>
                    <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                      <Box sx={{ minWidth: "150px" }}>Create date</Box> {invoiceSelected.createDate}
                    </ListItem>
                    <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                      <Box sx={{ minWidth: "150px" }}>Address</Box> {invoiceSelected.address.unitNumber} {invoiceSelected.address.addressLine}, {invoiceSelected.address.district}, {invoiceSelected.address.province}, {invoiceSelected.address.countryName}
                    </ListItem>
                    <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                      <Box sx={{ minWidth: "150px" }}>Delivery method</Box> {invoiceSelected.deliveryMethod.name}
                    </ListItem>
                    <ListItem sx={{ padding: "10px 0", borderBottom: "1px solid #000" }}>
                      <Box sx={{ minWidth: "150px" }}>Total</Box> $ {invoiceSelected.orderTotal}
                    </ListItem>
                  </List>
                  <Stepper activeStep={invoiceSelected.orderStatus} alternativeLabel sx={{ marginTop: "50px" }}>
                    <Step key={1} sx={{ padding: 0 }}>
                      <StepLabel>Pending</StepLabel>
                    </Step>
                    <Step key={2} sx={{ padding: 0 }}>
                      <StepLabel>In transit</StepLabel>
                    </Step>
                    <Step key={3} sx={{ padding: 0 }}>
                      <StepLabel>Completed</StepLabel>
                    </Step>
                  </Stepper>
                </CardContent>
              </Card>
              <TableContainer sx={{ width: "50%", maxHeight: "100%", borderRadius: "6px" }} >
                <Table stickyHeader sx={{ background: "#FFF", minHeight: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "700", fontSize: "1rem", background: "#FFF", color: "#008B8B", padding: "10px 0", textAlign: "center" }}>IMAGE</TableCell>
                      <TableCell sx={{ fontWeight: "700", fontSize: "1rem", background: "#FFF", color: "#008B8B", padding: "10px 0", textAlign: "center" }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: "700", fontSize: "1rem", background: "#FFF", color: "#008B8B", padding: "10px 0" }}>NAME</TableCell>
                      <TableCell sx={{ fontWeight: "700", fontSize: "1rem", background: "#FFF", color: "#008B8B", padding: "10px 0", textAlign: "center" }} align="right">PRICE</TableCell>
                      <TableCell sx={{ fontWeight: "700", fontSize: "1rem", background: "#FFF", color: "#008B8B", padding: "10px 0", textAlign: "center" }} align="right">QUANTITY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceDetailsToShow.map((item) => (
                      <TableRow
                        key={item.productItemId}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: "100px" }}
                      >
                        <TableCell sx={{ padding: "0", textAlign: "center" }}>
                          <img src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${item.image}`} alt="" width={90} style={{ padding: "5px" }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem", color: "#000", padding: "0", textAlign: "center" }}>{item.sku}</TableCell>
                        <TableCell sx={{ fontSize: "1rem", color: colors.redAccent[500], padding: "0", fontWeight: "800" }}>{item.name}</TableCell>
                        <TableCell sx={{ fontSize: "1rem", color: "#000", padding: "0", textAlign: "center" }} align="right">{item.price}</TableCell>
                        <TableCell sx={{ fontSize: "1rem", color: "#000", padding: "0", textAlign: "center" }} align="right">{item.qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Modal>
      )}
    </Box >
  );
};

export default Invoice;
