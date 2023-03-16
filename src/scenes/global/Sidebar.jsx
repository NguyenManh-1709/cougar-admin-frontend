import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from "react-redux";
import { userLogedInState } from "../../store/selectors";
import mySlice from "../../store/slices";
import { useDispatch } from "react-redux";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Login");
  const dispatch = useDispatch();

  const userLogedIn = useSelector(userLogedInState);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userLogedIn");
    dispatch(mySlice.actions.logout());
  }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
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
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
                <Typography variant="h3" color={colors.grey[100]}>
                  Cougar Store
                </Typography>

              </Box>
            )}
          </MenuItem>

          {(!isCollapsed && userLogedIn) && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {userLogedIn.avatar && (
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${userLogedIn.avatar}`}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                {!userLogedIn.avatar && (
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`https://res.cloudinary.com/dmjh7imwd/image/upload/v1678190935/CougarStore/149071_s8mfea.png`}
                    style={{ borderRadius: "50%" }}
                  />
                )}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userLogedIn.fullname}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[300]}>
                  Administrator
                </Typography>
              </Box>
            </Box>
          )}

          {userLogedIn && (
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Users"
                to="/users"
                icon={<GroupIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Products"
                to="/products"
                icon={<CheckBoxOutlineBlankIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Invoices"
                to="/invoices"
                icon={<ReceiptIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Change password"
                to="/change-password"
                icon={<SettingsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <MenuItem
                active={selected === "Logout"}
                style={{
                  color: colors.grey[100],
                }}
                onClick={() => setSelected("Logout")}
                icon={<LogoutIcon />}
              >
                <Typography>Logout</Typography>
                <Link
                  to={"/"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                />
              </MenuItem>
            </Box>
          )}
          {!userLogedIn && (
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Login"
                to="/"
                icon={<LoginIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
