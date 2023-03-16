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
import { usersWithRolesState, invoicesState, invoiceDetailsState, productsState } from "../../store/selectors";
import { useSelector } from "react-redux";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, LabelList } from "recharts";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const usersWithRoles = useSelector(usersWithRolesState);
  const products = useSelector(productsState);
  const invoices = useSelector(invoicesState);
  const invoicesDetails = useSelector(invoiceDetailsState);

  const paidInvoices = invoices.filter(item => item.orderStatus === 3);

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
    const totalInvoiceCreatedInThisMonth = paidInvoices.filter(invoice => {
      const invoiceCreateDate = new Date(invoice.createDate);
      return invoiceCreateDate.getMonth() === today.getMonth() && invoiceCreateDate.getFullYear() === today.getFullYear();
    }).length;
    return {
      total: paidInvoices.length,
      percentGrowth: (totalInvoiceCreatedInThisMonth / (paidInvoices.length - totalInvoiceCreatedInThisMonth) * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số lượng productItem và phần trăm tăng của tháng hiện tại so với trước
  const productStatistics = (() => {
    const totalProductCreatedInThisMonth = products.filter(invoice => {
      const productCreateDate = new Date(invoice.createDate);
      return productCreateDate.getMonth() === today.getMonth() && productCreateDate.getFullYear() === today.getFullYear();
    }).length;
    return {
      total: products.length,
      percentGrowth: (totalProductCreatedInThisMonth / (products.length - totalProductCreatedInThisMonth) * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số tiền thu được và phần trăm tăng của tháng hiện tại so với trước
  const moneyStatistics = (() => {
    const [totalMoneyInThisMonth, totalMoney] = paidInvoices.reduce(([temp, temp2], { createDate, orderTotal }) => {
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
    const revenue = paidInvoices
      .filter(invoice => new Date(invoice.createDate).getFullYear() === today.getFullYear() && new Date(invoice.createDate).getMonth() + 1 === monthNumber)
      .reduce((acc, invoice) => acc + parseInt(invoice.orderTotal), 0);
    const cogs = (revenue * 0.7) % 1 !== 0 ? (revenue * 0.7).toFixed(1) : (revenue * 0.7);
    const grossProfit = revenue - cogs;
    return { month, revenue, cogs, grossProfit };
  });

  // Custom tooltip for chart
  const CustomTooltipRevenueChart = ({ active, payload, label }) => {
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
  const orderTotalByUser = paidInvoices.reduce((totals, { user, orderTotal }) => {
    const existingTotal = totals[user.id] || 0;
    return {
      ...totals,
      [user.id]: existingTotal + orderTotal
    };
  }, {});
  const topTenUsersWhoBuyTheMost = Object.entries(orderTotalByUser)
    .map(([userId, orderTotal]) => ({ userInfo: `${usersWithRoles.find(user => user.id === parseInt(userId)).fullname} (ID: ${userId})`, Total: orderTotal }))
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 10);



  // Thống kê top 10 sản phẩm bán chạy chất
  const topTenBestSellingProducts = Object.values(
    invoices
      .filter(invoice => invoice.orderStatus === 3)
      .flatMap(invoice => invoicesDetails.filter(item => item.shopOrder.id === invoice.id))
      .reduce((acc, { shopOrder: { orderStatus }, productItem: { product }, qty }) => {
        if (orderStatus === 3) {
          const { id: productId, name, image } = product;
          acc[productId] = { productId, name, image, qty: (acc[productId]?.qty || 0) + qty };
        }
        return acc;
      }, {})
  ).sort((a, b) => b.qty - a.qty).slice(0, 10);

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
            title={productStatistics.total}
            subtitle="Products"
            progress={1 - productStatistics.percentGrowth / 100}
            increase={
              <Box display="flex" alignItems="center" gap="10px">
                {productStatistics.percentGrowth > 0 && <TrendingUpIcon />}
                {productStatistics.percentGrowth < 0 && <TrendingDownIcon sx={{ color: "red" }} />}
                <Box>{productStatistics.percentGrowth + " %"}</Box>
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
          gridColumn="span 6"
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
                Top 10 users who buy the most
              </Typography>
            </Box>
          </Box>
          <Box width="100%" height="85%">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={400} height={400} data={topTenUsersWhoBuyTheMost} layout="vertical" margin={{
                right: 60,
                left: 20,
                bottom: 20,
              }}
                barSize={15}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="userInfo" width={190} tick={{ fill: colors.greenAccent[300], fontSize: "1rem", fontWeight: '600' }} />
                <Legend />
                <Bar dataKey="Total" fill="#708090">
                  <LabelList dataKey="Total" position="right" fill="#708090" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
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
              key={`${item.productId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid ${colors.primary[500]}`}
              p="15px"
            >
              <img src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${item.image}`} alt="" width="100px" />
              <Box sx={{ flex: 1 }}>
                <Typography
                  color={colors.greenAccent[300]}
                  variant="h5"
                  fontWeight="600"
                  fontSize="1rem"
                >
                  {item.name}
                </Typography>
                <Typography color={colors.grey[100]} variant="h6">
                  ID: {item.productId}
                </Typography>
              </Box>
              <Box
                color={colors.grey[100]}
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
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue, COGS, and Gross Profit Chart
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
                <Tooltip content={<CustomTooltipRevenueChart />} />
                <YAxis />
                <Legend />
                <Bar dataKey="revenue" fill="#6495ED" name="Revenue">
                  <LabelList dataKey="revenue" position="top" fill="#6495ED" />
                </Bar>
                <Bar dataKey="cogs" fill="#FFD700" name="COGS (Cost of goods sold)">
                  <LabelList dataKey="cogs" position="top" fill="#FFD700"/>
                </Bar>
                <Bar dataKey="grossProfit" fill="#228B22" name="Gross profit">
                  <LabelList dataKey="grossProfit" position="top" fill="#228B22" />
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
