import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import FormCreateUser from "./scenes/create-user";
import FormCreateProduct from "./scenes/formcreateproduct";
import FormLogin from "./scenes/login";
import Invoice from "./scenes/invoice";
import User from "./scenes/user";
import Product from "./scenes/product";
import ChangePassword from "./scenes/change-password";
import FormForgotPassword from "./scenes/forgot-password";
import FormResetPassword from "./scenes/reset-password";
import Contact from "./scenes/contact";
import { Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { authorityGetAll, productItemGetAll, invoiceGetAll, invoiceDetailsGetAll, categoriesGetAll, subCategoriesGetAll, getUserById, productGetAll, contactGetAll } from "./store/apis";
import { loginStatusState } from "./store/selectors";
import FormEditUser from "./scenes/edit-user";

import { MyProSidebarProvider } from "./scenes/global/sidebar/sidebarContext"

function App() {
  const dispatch = useDispatch();

  const userLogedIn = JSON.parse(sessionStorage.getItem("userLogedIn"));
  const loginStatus = useSelector(loginStatusState);

  useEffect(() => {
    if (userLogedIn || loginStatus) {
      dispatch(getUserById(userLogedIn.id));
      dispatch(authorityGetAll());
      dispatch(productItemGetAll());
      dispatch(invoiceGetAll());
      dispatch(invoiceDetailsGetAll());
      dispatch(categoriesGetAll());
      dispatch(subCategoriesGetAll());
      dispatch(productGetAll());
      dispatch(contactGetAll());
    }
  }, [dispatch, userLogedIn, loginStatus])

  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MyProSidebarProvider>
          <div style={{ height: "100%", width: "100%" }}>
            <main>
              <Topbar />
              <Routes>
                <Route path="/" element={(loginStatus === false) ? <FormLogin /> : <Navigate to={-1} />} />
                <Route path="/dashboard" element={loginStatus === true ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/create-admin" element={loginStatus === true ? <FormCreateUser /> : <Navigate to="/" />} />
                <Route path="/edit-admin/:id" element={loginStatus === true ? <FormEditUser /> : <Navigate to="/" />} />
                <Route path="/createproduct/:id" element={loginStatus === true ? <FormCreateProduct /> : <Navigate to="/" />} />
                <Route path="/invoices" element={loginStatus === true ? <Invoice /> : <Navigate to="/" />} />
                <Route path="/users" element={loginStatus === true ? <User /> : <Navigate to="/" />} />
                <Route path="/products" element={loginStatus === true ? <Product /> : <Navigate to="/" />} />
                <Route path="/contacts" element={loginStatus === true ? <Contact /> : <Navigate to="/" />} />
                <Route path="/change-password" element={loginStatus === true ? <ChangePassword /> : <Navigate to="/" />} />
                <Route path="/forgot-password" element={!loginStatus === true ? <FormForgotPassword /> : <Navigate to="/" />} />
                <Route path="/reset-password" element={!loginStatus === true ? <FormResetPassword /> : <Navigate to="/" />} />
              </Routes>
              <ToastContainer />
            </main>
          </div>
        </MyProSidebarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;