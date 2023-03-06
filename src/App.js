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
import { useDispatch, useSelector } from "react-redux";
import { authorityGetAll } from "./store/Authority/api";
import { productItemGetAll } from "./store/ProductItem/api";
import { invoiceGetAll } from "./store/Invoice/api";
import { invoiceDetailsGetAll } from "./store/InvoiceDetail/api";
import { categoriesGetAll } from "./store/Category/api";
import { subCategoriesGetAll } from "./store/SubCategory/api";
import { getUserById } from "./store/Login/api";
import { Navigate } from 'react-router-dom';
import { loginStatusState } from "./store/Login/selector";

function App() {
  const dispatch = useDispatch();

  const userLogedIn = JSON.parse(sessionStorage.getItem("userLogedIn"));
  const loginStatus = useSelector(loginStatusState);

  useEffect(() => {
    if (userLogedIn) {
      dispatch(getUserById(userLogedIn.id));
      dispatch(authorityGetAll());
      dispatch(productItemGetAll());
      dispatch(invoiceGetAll());
      dispatch(invoiceDetailsGetAll());
      dispatch(categoriesGetAll());
      dispatch(subCategoriesGetAll());
    }
  }, [dispatch, userLogedIn])

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
              <Route path="/dashboard" element={loginStatus ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/form-user/:user" element={loginStatus ? <FormCreateUser /> : <Navigate to="/" />} />
              <Route path="/createproduct" element={loginStatus ? <FormCreateProduct /> : <Navigate to="/" />} />
              <Route path="/management" element={loginStatus ? <Management /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;