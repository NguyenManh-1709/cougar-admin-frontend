import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "./Header";

const MyTable = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = props.columns;
  const rows = props.rows;
  const title = props.title;

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
          sx={{fontSize: "1rem"}}
          rows={rows} 
          columns={columns} 
          getRowId={(row) => row.id}
          components={{ Toolbar: GridToolbar }}/>
      </Box>
    </Box>
  );
};

export default MyTable;
