import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import User from "./scenes/user";
import Product from "./scenes/product";
import Invoices from "./scenes/invoices";
import FormCreateUser from "./scenes/formcreateuser";
import FormCreateProduct from "./scenes/formcreateproduct";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<User />} />
              <Route path="/products" element={<Product />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/createuser" element={<FormCreateUser />} />
              <Route path="/createproduct" element={<FormCreateProduct />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
