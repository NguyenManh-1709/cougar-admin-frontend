import { tokens } from "../../theme";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import GroupIcon from '@mui/icons-material/Group';
import PaidIcon from '@mui/icons-material/Paid';
import { usersWithRolesState, invoicesState, invoiceDetailsState, productsState, categoriesState } from "../../store/selectors";
import { useSelector } from "react-redux";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, LabelList, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const usersWithRoles = useSelector(usersWithRolesState);
  const products = useSelector(productsState);
  const invoices = useSelector(invoicesState);
  const invoicesDetails = useSelector(invoiceDetailsState);
  const categories = useSelector(categoriesState);

  const paidInvoices = invoices.filter(item => item.orderStatus === 3);
  const paidInvoicesDetails = invoicesDetails.filter(item => item.shopOrder.orderStatus === 3)

  const today = new Date();

  // Thống kê tổng số lượng user và phần trăm tăng của tháng hiện tại so với tháng trước
  const userStatistics = (() => {
    const result = usersWithRoles.reduce((acc, { createDate }) => {
      const date = new Date(createDate);
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) acc[0]++;
      if (date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear()) acc[1]++;
      return acc;
    }, [0, 0]);
    return {
      total: usersWithRoles.length,
      percentGrowth: (result[0] / result[1] * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số lượng hóa đơn và phần trăm tăng của tháng hiện tại so với tháng trước
  const invoiceStatistics = (() => {
    const result = paidInvoices.reduce((acc, { createDate }) => {
      const date = new Date(createDate);
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) acc[0]++;
      if (date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear()) acc[1]++;
      return acc;
    }, [0, 0]);
    return {
      total: paidInvoices.length,
      percentGrowth: (result[0] / result[1] * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số lượng productItem và phần trăm tăng của tháng hiện tại so với tháng trước
  const productStatistics = (() => {
    const result = products.reduce((acc, { createDate }) => {
      const date = new Date(createDate);
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) acc[0]++;
      if (date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear()) acc[1]++;
      return acc;
    }, [0, 0]);
    return {
      total: products.length,
      percentGrowth: (result[0] / result[1] * 100).toFixed(1),
    }
  })();

  // Thống kê tổng số tiền thu được và phần trăm tăng của tháng hiện tại so với tháng trước
  const moneyStatistics = (() => {
    const result = paidInvoices.reduce((acc, { createDate, orderTotal }) => {
      const date = new Date(createDate);
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) acc[0] += orderTotal;
      if (date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear()) acc[1] += orderTotal;
      acc[2] += orderTotal;
      return acc;
    }, [0, 0, 0]);
    return {
      total: result[2],
      percentGrowth: (result[0] / result[1] * 100).toFixed(1),
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
    const grossProfit = (revenue - cogs) % 1 !== 0 ? (revenue - cogs).toFixed(1) : (revenue - cogs);
    return { month, revenue, cogs, grossProfit };
  });

  // Custom tooltip for chart
  const CustomTooltipRevenueChart = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ background: colors.primary[600], padding: "10px", borderRadius: "8px" }}>
          <Typography sx={{ color: "#FFF", textAlign: "center", marginBottom: "10px", borderBottom: "1px solid #FFF" }}>{`${label}`}</Typography>
          <Typography sx={{ color: "#6495ED" }}>{`${payload[0].name} : ${payload[0].value}`}</Typography>
          <Typography sx={{ color: "#DC6A6A" }}>{`${payload[1].name} : ${payload[1].value}`}</Typography>
          <Typography sx={{ color: "#228B22" }}>{`${payload[2].name} : ${payload[2].value}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomTooltipTenUsersWhoBuyTheMostChart = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ background: colors.primary[600], padding: "10px", borderRadius: "8px" }}>
          <Typography sx={{ color: "#FFF", textAlign: "center" }}>USER-ID: {`${payload[0].payload.userId}`}</Typography>
          <Typography sx={{ color: "#FFF", textAlign: "center", marginBottom: "10px", borderBottom: "1px solid #FFF" }}>{`${label}`}</Typography>
          <Typography sx={{ color: "#708090" }}>{`${payload[0].name} : ${payload[0].value}`}</Typography>
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
    .map(([userId, orderTotal]) => ({ userId, fullname: `${usersWithRoles.find(user => user.id === parseInt(userId))?.fullname}`, Total: orderTotal }))
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 10);

  // Thống kê top 10 sản phẩm bán chạy chất
  const topTenBestSellingProducts = Object.values(
    paidInvoicesDetails
      .reduce((acc, { productItem: { product }, qty }) => {
        const { id: productId, name } = product;
        acc[productId] = { productId, name, qty: (acc[productId]?.qty || 0) + qty };
        return acc;
      }, {})
  ).sort((a, b) => b.qty - a.qty).slice(0, 10);

  // Thống kê selling by categories and sub categories
  const myColorList = ["#DC6A6A", "#6495ED", "#228B22"];
  const pieChartColors = categories.map((category, index) => {
    const colorIndex = index % myColorList.length;
    return { id: category.id, color: myColorList[colorIndex] };
  });

  const subCategoriesPieChart = Object.values(
    paidInvoicesDetails
      .map(({ qty, productItem: { product: { subcategory: { id, name, category: { id: categoryId, name: categoryName } } } } }) => ({ id, name, categoryId, categoryName, qty }))
      .reduce((acc, { id, name, categoryId, categoryName, qty }) => {
        const existingSubCategory = acc.find(item => item.id === id);
        if (existingSubCategory) {
          existingSubCategory.qty += qty;
        } else {
          acc.push({ id, name, categoryId, categoryName, qty });
        }
        return acc;
      }, []).map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        color: pieChartColors.find(color => color.id === item.categoryId)?.color
      }))).sort((a, b) => a.id - b.id);

  const categoriesPieChart = subCategoriesPieChart.reduce((acc, { categoryId, categoryName, qty }) => {
    const existingCategory = acc.find(item => item.id === categoryId);
    if (existingCategory) {
      existingCategory.qty += qty;
    } else {
      acc.push({ id: categoryId, name: categoryName, qty });
    }
    return acc;
  }, []).map(item => ({
    id: item.id,
    name: item.name,
    qty: item.qty,
    color: pieChartColors.find(color => color.id === item.id)?.color
  }));

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

      {/* ROW 1 */}
      <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }} id="dashboard-row-1">
        <Grid xs={12} sm={6} md={6} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              total={userStatistics.total}
              title="Users"
              progress={1 - userStatistics.percentGrowth / 100}
              increase={userStatistics.percentGrowth}
              icon={
                <GroupIcon
                  sx={{ color: colors.greenAccent[200], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={6} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              total={productStatistics.total}
              title="Products"
              progress={1 - productStatistics.percentGrowth / 100}
              increase={productStatistics.percentGrowth}
              icon={
                <CheckBoxOutlineBlankIcon
                  sx={{ color: colors.greenAccent[200], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={6} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              total={invoiceStatistics.total}
              title="Invoices"
              progress={1 - invoiceStatistics.percentGrowth / 100}
              increase={invoiceStatistics.percentGrowth}
              icon={
                <ReceiptOutlinedIcon
                  sx={{ color: colors.greenAccent[200], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} md={6} xl={3}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              total={moneyStatistics.total}
              title="Revenue"
              progress={1 - moneyStatistics.percentGrowth / 100}
              increase={moneyStatistics.percentGrowth}
              icon={
                <PaidIcon
                  sx={{ color: colors.greenAccent[200], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Grid>
      </Grid>

      {/* ROW 2 */}
      <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }} mt={{ xs: "4px", sm: "8px" }}>
        <Grid xs={12} xl={8}>
          <Box
            width="100%"
            height="600px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
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
                  fontWeight="700"
                  color={colors.grey[100]}
                >
                  REVENUE, COGS, AND GROSS PROFIT CHART ($)
                </Typography>
              </Box>
            </Box>
            <Box width="100%" height="85%">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueStatistics}
                  margin={{
                    right: 50,
                    left: 10,
                    bottom: 10,
                  }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="5 5" vertical={() => { return true }} />
                  <XAxis dataKey="month" />
                  <Tooltip content={<CustomTooltipRevenueChart />} />
                  <YAxis />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6495ED" name="Revenue" />
                  <Bar dataKey="cogs" fill="#DC6A6A" name="COGS (Cost of goods sold)" />
                  <Bar dataKey="grossProfit" fill="#228B22" name="Gross profit" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} xl={4}>
          <Box
            width="100%"
            height="600px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
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
                  fontWeight="700"
                  color={colors.grey[100]}
                >
                  BEST SELLING CATEGORIES
                </Typography>
              </Box>
            </Box>
            <Box width="100%" height="85%">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoriesPieChart}
                    dataKey="qty"
                    outerRadius={70}
                  >
                    <LabelList dataKey="name" />
                    {categoriesPieChart.map((item) => (
                      <Cell key={`cell-${item.id}`} fill={item.color} stroke={colors.primary[400]} />
                    ))}
                  </Pie>
                  <Pie
                    data={subCategoriesPieChart}
                    dataKey="qty"
                    innerRadius={71}
                    outerRadius={190}
                    label
                  >
                    <LabelList dataKey="name" position="right" />
                    {subCategoriesPieChart.map((item) => (
                      <Cell key={`cell-${item.id}`} fill={item.color} stroke={colors.primary[400]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ROW 3 */}
      <Grid container rowSpacing={{ xs: 1, sm: 2 }} columnSpacing={{ xs: 1, sm: 2 }} mt={{ xs: "4px", sm: "8px" }}>
        <Grid xs={12} xl={6}>
          <Box
            width="100%"
            height="600px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            flexDirection="column"
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
                  fontWeight="700"
                  color={colors.grey[100]}
                >
                  TOP 10 USERS WHO BUY THE MOST ($)
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
                  <Tooltip content={<CustomTooltipTenUsersWhoBuyTheMostChart />} />
                  <YAxis type="category" dataKey="fullname" width={190} tick={{ fill: colors.greenAccent[300], fontSize: "1rem", fontWeight: '600' }} />
                  <Legend />
                  <Bar dataKey="Total" fill="#708090">
                    <LabelList dataKey="Total" position="right" fill="#708090" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} xl={6}>
          <Box
            width="100%"
            height="600px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            flexDirection="column"
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
                  fontWeight="700"
                  color={colors.grey[100]}
                >
                  TOP 10 BEST SELLING PRODUCTS
                </Typography>
              </Box>
            </Box>
            <TableContainer sx={{ maxHeight: "85%" }} >
              <Table stickyHeader sx={{ minHeight: "85%", padding: "0 10px" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0" }}>Product name</TableCell>
                    <TableCell sx={{ fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0", textAlign: "center" }} align="right">Quantity sold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topTenBestSellingProducts.map((item) => (
                    <TableRow
                      key={item.productId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: "50px" }}
                    >
                      <TableCell sx={{ fontSize: "1rem", color: colors.redAccent[400], padding: "0", fontWeight: "800" }}>{item.name}</TableCell>
                      <TableCell sx={{ fontSize: "1rem", color: colors.grey[100], padding: "0", fontWeight: "800", textAlign: "center" }} align="right">{item.qty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Dashboard;
