import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataUser } from "../../data/mockData";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const User = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { 
      field: "username", 
      headerName: "USERNAME",
      flex: 1,
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
      field: "createdate",
      headerName: "CREATEDATE",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="30%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === 0
                ? colors.greenAccent[700]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status === 0
                ? "Active"
                : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing your users" /> 
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
          rows={mockDataUser} 
          columns={columns} 
          getRowId={(row) => row.username} 
          components={{ Toolbar: GridToolbar }}/>
      </Box>
      <Box display="flex" justifyContent="end" mt="20px" >
        
        <Link 
          to={"/createuser"} 
          style={{ 
            textDecoration: 'none',
            background: "#1F2A40",
            color: "white",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          Create a new account for the administrator
        </Link>
      </Box>
    </Box>
  );
};

export default User;
