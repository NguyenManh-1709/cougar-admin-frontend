import { tokens } from "../../theme";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { usersWithRolesState, productItemsState, invoicesState, invoiceDetailsState } from "../../store/selectors";
import { useSelector } from "react-redux";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, LabelList } from "recharts";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const usersWithRoles = useSelector(usersWithRolesState);
  const productItems = useSelector(productItemsState);
  const invoices = useSelector(invoicesState);
  const invoicesDetails = useSelector(invoiceDetailsState);

  const today = new Date();

  // Thống kê tổng số lượng user và phần trăm tăng của tháng hiện tại so với trước
  const userStatistics = (() => {
    const totalUserCreatedInThisMonth = usersWithRoles.filter(user => {
      const userCreateDate = new Date(user.createDate);
      return userCreateDate.getMonth() === today.getMonth() && userCreateDate.getFullYear() === today.getFullYear();
    }).length;
    return {
      total: usersWithRoles.length,
      percentGrowth: (totalUserCreatedInThisMonth / (usersWithRoles.length - totalUserCreatedInThisMonth) * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số lượng hóa đơn và phần trăm tăng của tháng hiện tại so với trước
  const invoiceStatistics = (() => {
    const totalInvoiceCreatedInThisMonth = invoices.filter(invoice => {
      const invoiceCreateDate = new Date(invoice.createDate);
      return invoiceCreateDate.getMonth() === today.getMonth() && invoiceCreateDate.getFullYear() === today.getFullYear();
    }).length;
    return {
      total: invoices.length,
      percentGrowth: (totalInvoiceCreatedInThisMonth / (invoices.length - totalInvoiceCreatedInThisMonth) * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số lượng productItem và phần trăm tăng của tháng hiện tại so với trước
  const productItemStatistics = (() => {
    const totalProductItemCreatedInThisMonth = productItems.filter(invoice => {
      const productItemCreateDate = new Date(invoice.createDate);
      return productItemCreateDate.getMonth() === today.getMonth() && productItemCreateDate.getFullYear() === today.getFullYear();
    }).length;
    return {
      total: productItems.length,
      percentGrowth: (totalProductItemCreatedInThisMonth / (productItems.length - totalProductItemCreatedInThisMonth) * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số tiền thu được và phần trăm tăng của tháng hiện tại so với trước
  const moneyStatistics = (() => {
    const [totalMoneyInThisMonth, totalMoney] = invoices.reduce(([temp, temp2], { createDate, orderTotal }) => {
      const invoiceCreateDate = new Date(createDate);
      return [
        (invoiceCreateDate.getMonth() === today.getMonth() && invoiceCreateDate.getFullYear() === today.getFullYear()) ? temp + orderTotal : temp,
        temp2 + orderTotal,
      ];
    }, [0, 0]);
    return {
      total: totalMoney,
      percentGrowth: (totalMoneyInThisMonth / (totalMoney - totalMoneyInThisMonth) * 100).toFixed(1)
    }
  })();

  // Thống kê Cost và Profit(Mặc định 30%) 12 tháng trong năm hiện tại
  const monthsText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueStatistics = monthsText.map((month, index) => {
    const monthNumber = index + 1;
    const totalRevenue = invoices
      .filter(invoice => new Date(invoice.createDate).getFullYear() === today.getFullYear() && new Date(invoice.createDate).getMonth() + 1 === monthNumber)
      .reduce((acc, invoice) => acc + parseInt(invoice.orderTotal), 0);
    const cost = (totalRevenue * 0.7) % 1 !== 0 ? (totalRevenue * 0.7).toFixed(1) : (totalRevenue * 0.7);
    const profit = totalRevenue - cost;
    return { month, Revenue: totalRevenue, Cost: cost, Profit: profit };
  });

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ background: colors.primary[600], padding: "10px", borderRadius: "10px" }}>
          <Typography sx={{ color: "#FFF", textAlign: "center", marginBottom: "10px", borderBottom: "1px solid #FFF" }}>{`${label}`}</Typography>
          <Typography sx={{ color: "#6495ED" }}>{`${payload[0].name} : ${payload[0].value}`}</Typography>
          <Typography sx={{ color: "#FFD700" }}>{`${payload[1].name} : ${payload[1].value}`}</Typography>
          <Typography sx={{ color: "#228B22" }}>{`${payload[2].name} : ${payload[2].value}`}</Typography>
        </Box>
      );
    }
    return null;
  };




  // Thống kê top 10 user mua nhiều nhất
  const totalOrderGroupByUserMap = new Map();

  for (const invoice of invoices) {
    const { user, orderTotal } = invoice;
    const { id: userId, fullname } = user;

    if (totalOrderGroupByUserMap.has(userId)) {
      const { orderTotal: total } = totalOrderGroupByUserMap.get(userId);
      totalOrderGroupByUserMap.set(userId, { fullname, orderTotal: total + orderTotal });
    } else {
      totalOrderGroupByUserMap.set(userId, { fullname, orderTotal });
    }
  }

  const topTenUsersWhoBuyTheMost = Array
    .from(totalOrderGroupByUserMap, ([userId, { fullname, orderTotal }]) => ({ userId, fullname, orderTotal }))
    .sort((a, b) => b.orderTotal - a.orderTotal)
    .slice(0, 10);



  // Thống kê top 10 sản phẩm bán chạy chất
  const tempArr = [];
  const tempMap = new Map();
  invoicesDetails.forEach(({ productItem, qty }) => {
    const { id: productItemId, product } = productItem;
    const temp = tempMap.get(productItemId);
    tempMap.set(productItemId, temp ? { ...temp, qty: temp.qty + qty } : { product, qty });
  });
  for (const [productItemId, { product, ...props }] of tempMap) {
    tempArr.push({ productItemId, productName: product.name, ...props });
  }

  const topTenBestSellingProducts = tempArr.sort((a, b) => b.qty - a.qty).slice(0, 10);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" />
      </Box>

      {/* GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {/* <CircularProgress /> */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={userStatistics.total}
            subtitle="Users"
            progress={1 - userStatistics.percentGrowth / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {userStatistics.percentGrowth > 0 && <TrendingUpIcon />}
                {userStatistics.percentGrowth < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{userStatistics.percentGrowth + " %"}</Box>
              </Box>
            }
            icon={
              <GroupIcon
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
            title={productItemStatistics.total}
            subtitle="Products"
            progress={1 - productItemStatistics.percentGrowth / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {productItemStatistics.percentGrowth > 0 && <TrendingUpIcon />}
                {productItemStatistics.percentGrowth < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{productItemStatistics.percentGrowth + " %"}</Box>
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
            title={invoiceStatistics.total}
            subtitle="Invoices"
            progress={1 - invoiceStatistics.percentGrowth / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {invoiceStatistics.percentGrowth > 0 && <TrendingUpIcon />}
                {invoiceStatistics.percentGrowth < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{invoiceStatistics.percentGrowth + " %"}</Box>
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
            title={moneyStatistics.total}
            subtitle="Money"
            progress={1 - moneyStatistics.percentGrowth / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {moneyStatistics.percentGrowth > 0 && <TrendingUpIcon />}
                {moneyStatistics.percentGrowth < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{moneyStatistics.percentGrowth + " %"}</Box>
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
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        ></Box>
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
              borderBottom={`2px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                  fontSize="1rem"
                >
                  {item.fullname}
                </Typography>
                <Typography color={colors.grey[100]} variant="h6">
                  User-id: {item.userId}
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.grey[100]}
                color={colors.grey[900]}
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
              Top 10 best selling products
            </Typography>
          </Box>
          {topTenBestSellingProducts.map((item, i) => (
            <Box
              key={`${item.productItemId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                  fontSize="1rem"
                >
                  {item.productName}
                </Typography>
                <Typography color={colors.grey[100]} variant="h6">
                  Product-item-id: {item.productItemId}
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.grey[100]}
                color={colors.grey[900]}
                p="5px"
                borderRadius="4px"
                fontSize="1.2rem"
                fontWeight="600"
              >
                {item.qty}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Box
            p="0 30px"
            display="flex"
            height="15%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue - Cost - Profit of {today.getFullYear()}
              </Typography>
            </Box>
          </Box>
          <Box width="100%" height="85%">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueStatistics}
                margin={{
                  right: 60,
                  left: 20,
                  bottom: 20,
                }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="5 5" vertical={() => { return true }} />
                <XAxis dataKey="month" />
                <Tooltip content={<CustomTooltip />} />
                <YAxis />
                <Legend />
                <Bar dataKey="Revenue" fill="#6495ED">
                  <LabelList dataKey="Revenue" position="top" fill="#6495ED" />
                </Bar>
                <Bar dataKey="Cost" fill="#FFD700">
                  <LabelList dataKey="Cost" position="top" fill="#FFD700" />
                </Bar>
                <Bar dataKey="Profit" fill="#228B22">
                  <LabelList dataKey="Profit" position="top" fill="#228B22" />
                </Bar>

              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
