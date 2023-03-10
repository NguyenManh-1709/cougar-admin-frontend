import { Box, Button, List, ListItem, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState } from "react";
import { invoicesState, invoiceDetailsState } from "../../store/selectors";
import MyTable from "../../components/MyTable";
import { useSelector } from "react-redux";

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

const Invoice = () => {
  const invoiceDetails = useSelector(invoiceDetailsState);
  const invoices = useSelector(invoicesState);

  // Show Invoice Details
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
        const { id: productItemId, product: { name } } = productItem;
        return { productItemId, name, qty, price };
      });
    setInvoiceDetailsToShow(resultToShow);
  };

  const handleCloseInvoiceDetails = () => setOpenInvoiceDetails(false);

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
            <Box sx={{ minWidth: 650, background: "black", color: "white", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
              <List>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Invoice id</Box> {invoiceSelected.id}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>User</Box> {invoiceSelected.user.fullname}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Payment method</Box> {invoiceSelected.userPaymentMethod.paymentType.value}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Create date</Box> {invoiceSelected.createDate}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Address</Box> {invoiceSelected.address.unitNumber} {invoiceSelected.address.addressLine}, {invoiceSelected.address.district}, {invoiceSelected.address.province}, {invoiceSelected.address.countryName}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Delivery method</Box> {invoiceSelected.deliveryMethod.name}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Total</Box> ${invoiceSelected.orderTotal}
                </ListItem>
                <ListItem>
                  <Box sx={{ minWidth: "200px" }}>Status</Box> {invoiceSelected.orderStatus === null ? "Pending" : invoiceSelected.orderStatus ? "Completed" : "Processing"}
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
      )}
    </Box >
  );
};

export default Invoice;
