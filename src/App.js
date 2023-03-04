import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Management from "./scenes/manager";
import FormCreateUser from "./scenes/formcreateuser";
import FormCreateProduct from "./scenes/formcreateproduct";
import FormLogin from "./scenes/login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useDispatch } from "react-redux";
import { authorityGetAll } from "./store/Authority/api";
import { productItemGetAll } from "./store/ProductItem/api";
import { invoiceGetAll } from "./store/Invoice/api";
import { invoiceDetailsGetAll } from "./store/InvoiceDetail/api";
import { categoriesGetAll } from "./store/Category/api";
import { subCategoriesGetAll } from "./store/SubCategory/api";

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(authorityGetAll());
    dispatch(productItemGetAll())
    dispatch(invoiceGetAll())
    dispatch(invoiceDetailsGetAll())
    dispatch(categoriesGetAll())
    dispatch(subCategoriesGetAll())
  }, [dispatch])


  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<FormLogin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/form-user/:user" element={<FormCreateUser />} />
              <Route path="/createproduct" element={<FormCreateProduct />} />
              <Route path="/management" element={<Management />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;