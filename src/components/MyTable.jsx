import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import { tokens } from "../theme";
import Header from "./Header";

const MyTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = props.columns;
  const rows = props.rows;
  const title = props.title;

  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  return (
    <Box>
      <Header title={title} />
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
          "& .MuiDataGrid-selectedRowCount": {
            // display: "none"
          },
          "& .MuiDataGrid-columnSeparator--sideRight": {
            display: "none !important"
          },
          "& .MuiDataGrid-menuIcon": {
            display: "none !important"
          }
        }}
      >
        <DataGrid 
          sx={{fontSize: "1rem"}}
          rows={rows}
          columns={columns} 
          getRowId={(row) => row.id}
          isRowSelectable={() => {return false}}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageSizeChange={handlePageSizeChange}
          components={{ Toolbar: GridToolbar }}/>
      </Box>
    </Box>
  );
};

export default MyTable;
