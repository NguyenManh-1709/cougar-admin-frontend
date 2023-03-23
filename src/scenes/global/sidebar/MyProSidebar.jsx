import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";

import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SettingsIcon from '@mui/icons-material/Settings';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { userLogedInState } from "../../../store/selectors";
import mySlice from "../../../store/slices";

const MyProSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();

  const [selected, setSelected] = useState();
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    setSelected(location.pathname);
  }, [location]);

  const userLogedIn = useSelector(userLogedInState);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userLogedIn");
    dispatch(mySlice.actions.logout());
  }

  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 100,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          color: "#FFF !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
      }}
    >
      <Sidebar
        breakPoint="lg"
        backgroundColor={"#1F2A40"}
      >
        <Menu iconshape="square">
          <MenuItem
            icon={
              collapsed ? (
                <MenuOutlinedIcon onClick={() => collapseSidebar()} />
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <IconButton
                  sx={{ color: "#FFF" }}
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }
                >
                  <CloseOutlinedIcon />
                </IconButton>
                <Typography variant="h3" color={"#FFF"}>
                  Cougar Store
                </Typography>
              </Box>
            )}
          </MenuItem>
          {(!collapsed && userLogedIn) && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "& .avater-image": {
                    backgroundColor: colors.primary[500],
                  },
                }}
              >
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userLogedIn.avatar ? `https://res.cloudinary.com/dmjh7imwd/image/upload/${userLogedIn.avatar}` : "https://res.cloudinary.com/dmjh7imwd/image/upload/v1678190935/CougarStore/149071_s8mfea.png"}
                  style={{ borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={"#FFF"}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userLogedIn.fullname}
                </Typography>
                <Typography variant="h5" color="#94E2CD">
                  Administrator
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            {!userLogedIn && (
              <>
                <MenuItem
                  active={selected === "/"}
                  style={{ color: "#FFF" }}
                  icon={<LoginIcon />}
                  routerLink={<Link to={"/"} />}
                >
                  <Typography>Login</Typography>
                </MenuItem>
                <MenuItem
                  active={selected === "/forgot-password"}
                  style={{ color: "#FFF" }}
                  icon={<LockResetIcon />}
                  routerLink={<Link to={"/forgot-password"} />}
                >
                  <Typography>Forgot Password</Typography>
                </MenuItem>
              </>
            )}
            {userLogedIn && (
              <>
                <MenuItem
                  active={selected === "/dashboard"}
                  style={{ color: "#FFF" }}
                  icon={<HomeOutlinedIcon />}
                  routerLink={<Link to={"dashboard"} />}
                >
                  <Typography>Dashboard</Typography>
                </MenuItem>

                <Typography variant="h6" color={"gray"} display={collapsed ? "none" : undefined} >Management</Typography>

                <MenuItem
                  active={selected === "/users"}
                  style={{ color: "#FFF" }}
                  icon={<GroupIcon />}
                  routerLink={<Link to={"users"} />}
                >
                  <Typography>Users</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "/products"}
                  style={{ color: "#FFF" }}
                  icon={<CheckBoxOutlineBlankIcon />}
                  routerLink={<Link to={"/products"} />}
                >
                  <Typography>Products</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "/invoices"}
                  style={{ color: "#FFF" }}
                  icon={<ReceiptIcon />}
                  routerLink={<Link to={"/invoices"} />}
                >
                  <Typography>Invoices</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "/contacts"}
                  style={{ color: "#FFF" }}
                  icon={<MailOutlineIcon />}
                  routerLink={<Link to={"/contacts"} />}
                >
                  <Typography>Contact</Typography>
                </MenuItem>

                <Typography variant="h6" color={"gray"} display={collapsed ? "none" : undefined} >Your account</Typography>
                <MenuItem
                  active={selected === `/edit-admin/${userLogedIn.id}`}
                  style={{ color: "#FFF" }}
                  icon={<PermContactCalendarIcon />}
                  routerLink={<Link to={`/edit-admin/${userLogedIn.id}`} />}
                >
                  <Typography>Profile</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "/change-password"}
                  style={{ color: "#FFF" }}
                  icon={<SettingsIcon />}
                  routerLink={<Link to={"/change-password"} />}
                >
                  <Typography>Change password</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "/"}
                  style={{ color: "#FFF" }}
                  icon={<LogoutIcon />}
                  routerLink={<Link to={"/"} onClick={(e) => { e.preventDefault(); handleLogout() }} />}
                >
                  <Typography>Logout</Typography>
                </MenuItem>
              </>
            )}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default MyProSidebar;
