import { Box, useTheme, Button, Backdrop, Modal, Fade, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import * as React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%",
  bgcolor: 'background.paper',
  p: 4,
};

const Invoices = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const detailsColumns = [
    {
      field: 'product',
      headerName: 'PRODUCT',
      flex: 1,
      renderCell: ({ row: { product } }) => {
        return (
          product.name
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'QUANTITY',
      flex: 1
    }
  ]

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID"
    },
    {
      field: "customer",
      headerName: "CUSTOMER",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { customer } }) => {
        return (
          customer.fullname
        );
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: ({ row: { details } }) => {
        return (
          <div>
            <Button onClick={handleOpen} color="success">Show</Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotprops={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={open}>
                <Box sx={style}>
                  <Typography id="transition-modal-title" variant="h3" component="h1">
                    Invoice details
                  </Typography>
                  <Box
                    m="40px 0 0 0"
                    height="70vh"
                    sx={{
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                      },
                      "& .name-column--cell": {
                        color: colors.greenAccent[300],
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                      },
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                      },
                    }}
                  >
                    <DataGrid
                      rows={details}
                      columns={detailsColumns}
                      getRowId={(row) => row.id} />
                  </Box>
                </Box>
              </Fade>
            </Modal>
          </div>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Invoices" subtitle="Managing your invoices" />
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockDataInvoices}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Invoices;