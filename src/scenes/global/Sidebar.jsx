import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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
import { useSelector } from "react-redux";
import { userLogedInState } from "../../store/selectors";
import mySlice from "../../store/slices";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        zIndex: 1000,
        "& .pro-sidebar-inner": {
          background: `#1F2A40 !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: "#FFF"
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton sx={{ color: "#FFF" }} onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
                <Typography variant="h3" color="#FFF">
                  Cougar Store
                </Typography>
              </Box>
            )}
          </MenuItem>

          {(!isCollapsed && userLogedIn) && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
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
                  color="#FFF"
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

          {/* {userLogedIn && ( */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {!userLogedIn && (
              <>
                <MenuItem
                  active={selected === "/"}
                  style={{ color: "#FFF" }}
                  icon={<LoginIcon />}
                >
                  <Typography>Login</Typography>
                  <Link to={"/"} />
                </MenuItem>
                <MenuItem
                  active={selected === "/forgot-password"}
                  style={{ color: "#FFF" }}
                  icon={<LockResetIcon />}
                >
                  <Typography>Forgot Password</Typography>
                  <Link to={"/forgot-password"} />
                </MenuItem>
              </>
            )}
            {userLogedIn && (
              <>
                <MenuItem
                  active={selected === "/dashboard"}
                  style={{ color: "#FFF" }}
                  icon={<HomeOutlinedIcon />}
                >
                  <Typography>Dashboard</Typography>
                  <Link to={"/dashboard"} />
                </MenuItem>

                <Typography variant="h6" color={"gray"} display={isCollapsed ? "none" : undefined} >Management</Typography>

                <MenuItem
                  active={selected === "/users"}
                  style={{ color: "#FFF" }}
                  icon={<GroupIcon />}
                >
                  <Typography>Users</Typography>
                  <Link to={"/users"} />
                </MenuItem>

                <MenuItem
                  active={selected === "/products"}
                  style={{ color: "#FFF" }}
                  icon={<CheckBoxOutlineBlankIcon />}
                >
                  <Typography>Products</Typography>
                  <Link to={"/products"} />
                </MenuItem>

                <MenuItem
                  active={selected === "/invoices"}
                  style={{ color: "#FFF" }}
                  icon={<ReceiptIcon />}
                >
                  <Typography>Invoices</Typography>
                  <Link to={"/invoices"} />
                </MenuItem>

                <MenuItem
                  active={selected === "/contacts"}
                  style={{ color: "#FFF" }}
                  icon={<MailOutlineIcon />}
                >
                  <Typography>Contact</Typography>
                  <Link to={"/contacts"} />
                </MenuItem>

                <Typography variant="h6" color={"gray"} display={isCollapsed ? "none" : undefined} >Your account</Typography>
                <MenuItem
                  active={selected === `/edit-admin/${userLogedIn.id}`}
                  style={{ color: "#FFF" }}
                  icon={<PermContactCalendarIcon />}
                >
                  <Typography>Profile</Typography>
                  <Link to={`/edit-admin/${userLogedIn.id}`} />
                </MenuItem>
                
                <MenuItem
                  active={selected === "/change-password"}
                  style={{ color: "#FFF" }}
                  icon={<SettingsIcon />}
                >
                  <Typography>Change password</Typography>
                  <Link to={"/change-password"} />
                </MenuItem>

                <MenuItem
                  active={selected === "/"}
                  style={{ color: "#FFF" }}
                  icon={<LogoutIcon />}
                >
                  <Typography>Logout</Typography>
                  <Link to={"/"} onClick={(e) => { e.preventDefault(); handleLogout() }} />
                </MenuItem>
              </>
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
