import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataProduct } from "../../data/mockData";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const Product = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "NAME",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "subcategory",
      headerName: "SUB CATEGORY",
      flex: 1,
      renderCell: ({ row: { subcategory } }) => {
        return (
          subcategory.name
        );
      },
    },
    {
      field: "createdate",
      headerName: "CREATEDATE",
      flex: 1,
    },
    {
      field: "price",
      headerName: "PRICE",
      flex: 1,
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      flex: 1,
    },
    {
      field: "image",
      headerName: "IMAGE",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Products" subtitle="Managing your products" />
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
          rows={mockDataProduct}
          columns={columns}
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }} />
      </Box>
      <Box display="flex" justifyContent="end" mt="20px" >
        <Link
          to={"/createproduct"}
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
      </Box>
    </Box>
  );
};

export default Product;
