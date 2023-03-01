import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { useSelector } from "react-redux";
import { customListOfUsersWithRolesState } from "../../store/User/selector";
import { productItemsState } from "../../store/ProductItem/selector";
import { invoicesState } from "../../store/Invoice/selector";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const usersWithRoles = useSelector(customListOfUsersWithRolesState);
  const productItems = useSelector(productItemsState);
  const invoices = useSelector(invoicesState);

  function calculateGrowthPercentage(arr) {
    const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const temp = arr.filter(user => new Date(user.createDate) < firstDayOfCurrentMonth);
    const growthPercenttage = ((arr.length - temp.length) / temp.length * 100).toFixed(1);
    return growthPercenttage;
  };

  const totalOrderSum = invoices.reduce((sum, invoice) => sum + invoice.orderTotal, 0);
  function tempFN(arr) {
    const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const tempArr = arr.filter(temp => new Date(temp.createDate) < firstDayOfCurrentMonth);
    const tempTotal = tempArr.reduce((sum, invoice) => sum + invoice.orderTotal, 0);
    const growthPercenttage = ((totalOrderSum - tempTotal) / tempTotal * 100).toFixed(1);
    return growthPercenttage;
  };

  const userGrowthPercentage = calculateGrowthPercentage(usersWithRoles);
  const productItemGrowthPercentage = calculateGrowthPercentage(productItems);
  const invoiceGrowthPercentage = calculateGrowthPercentage(invoices);
  const moneyGrowthPercentage = tempFN(invoices);



  const totalsByUserMap = new Map();

  for (const invoice of invoices) {
    const { user, orderTotal } = invoice;
    const { id: userId, fullname } = user;

    if (totalsByUserMap.has(userId)) {
      const { orderTotal: total } = totalsByUserMap.get(userId);
      totalsByUserMap.set(userId, { fullname, orderTotal: total + orderTotal });
    } else {
      totalsByUserMap.set(userId, { fullname, orderTotal });
    }
  }

  const topTenUsersWhoBuyTheMost = Array
    .from(totalsByUserMap, ([userId, { fullname, orderTotal }]) => ({ userId, fullname, orderTotal }))
    .sort((a, b) => b.orderTotal - a.orderTotal)
    .slice(0, 10);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="30px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={usersWithRoles.length}
            subtitle="Users"
            progress={1 - userGrowthPercentage / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {userGrowthPercentage > 0 && <TrendingUpIcon />}
                {userGrowthPercentage < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{userGrowthPercentage + " %"}</Box>
              </Box>
            }
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={productItems.length}
            subtitle="Products"
            progress={1 - productItemGrowthPercentage / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {productItemGrowthPercentage > 0 && <TrendingUpIcon />}
                {productItemGrowthPercentage < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{productItemGrowthPercentage + " %"}</Box>
              </Box>
            }
            icon={
              <CheckBoxOutlineBlankIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={invoices.length}
            subtitle="Invoices"
            progress={1 - invoiceGrowthPercentage / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {invoiceGrowthPercentage > 0 && <TrendingUpIcon />}
                {invoiceGrowthPercentage < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{invoiceGrowthPercentage + " %"}</Box>
              </Box>
            }
            icon={
              <ReceiptOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalOrderSum}
            subtitle="Money"
            progress={1 - moneyGrowthPercentage / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {moneyGrowthPercentage > 0 && <TrendingUpIcon />}
                {moneyGrowthPercentage < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{moneyGrowthPercentage + " %"}</Box>
              </Box>
            }
            icon={
              <PaidIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              {/* <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography> */}
            </Box>
          </Box>
          <Box height="90%" m="-20px 0 -20px 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Top 10 users who buy the most
            </Typography>
          </Box>
          {topTenUsersWhoBuyTheMost.map((item, i) => (
            <Box
              key={`${item.userId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                  fontSize="1.3rem"
                >
                  {item.fullname}
                </Typography>
                <Typography color={colors.grey[100]} variant="h6">
                  USER-ID: {item.userId}
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                color="#000"
                p="5px"
                borderRadius="4px"
                fontSize="1.2rem"
                fontWeight="600"
              >
                ${item.orderTotal}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
