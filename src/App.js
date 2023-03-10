import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import FormCreateUser from "./scenes/formcreateuser";
import FormCreateProduct from "./scenes/formcreateproduct";
import FormLogin from "./scenes/login";
import Invoice from "./scenes/invoice";
import User from "./scenes/user";
import Product from "./scenes/product";
import { Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useDispatch, useSelector } from "react-redux";

import { authorityGetAll, productItemGetAll, invoiceGetAll, invoiceDetailsGetAll, categoriesGetAll, subCategoriesGetAll, getUserById } from "./store/apis";
import { loginStatusState } from "./store/selectors";

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
              <Route path="/" element={loginStatus !== "Successfully!" ? <FormLogin /> : <Navigate to={-1} />} />
              <Route path="/dashboard" element={loginStatus === "Successfully!" ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/form-user/:id" element={loginStatus === "Successfully!" ? <FormCreateUser /> : <Navigate to="/" />} />
              <Route path="/createproduct/:id" element={loginStatus === "Successfully!" ? <FormCreateProduct /> : <Navigate to="/" />} />
              <Route path="/invoices" element={loginStatus === "Successfully!" ? <Invoice /> : <Navigate to="/" />} />
              <Route path="/users" element={loginStatus === "Successfully!" ? <User /> : <Navigate to="/" />} />
              <Route path="/products" element={loginStatus === "Successfully!" ? <Product /> : <Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;