import { tokens } from "../../theme";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
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
        <Box sx={{ background: colors.primary[600], padding: "10px", borderRadius: "10px" }}>
          <Typography sx={{ color: "#FFF", textAlign: "center", marginBottom: "10px", borderBottom: "1px solid #FFF" }}>{`${label}`}</Typography>
          <Typography sx={{ color: "#6495ED" }}>{`${payload[0].name} : ${payload[0].value}`}</Typography>
          <Typography sx={{ color: "#DC6A6A" }}>{`${payload[1].name} : ${payload[1].value}`}</Typography>
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
    .map(([userId, orderTotal]) => ({ userInfo: `${usersWithRoles.find(user => user.id === parseInt(userId))?.fullname} (ID: ${userId})`, Total: orderTotal }))
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 10);

  // Thống kê top 10 sản phẩm bán chạy chất
  const topTenBestSellingProducts = Object.values(
    paidInvoicesDetails
      .reduce((acc, { productItem: { product }, qty }) => {
        const { id: productId, name, image } = product;
        acc[productId] = { productId, name, image, qty: (acc[productId]?.qty || 0) + qty };
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
      <Header title="DASHBOARD" />

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
        <Box
          gridColumn="span 3"
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
        <Box
          gridColumn="span 3"
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
        <Box
          gridColumn="span 3"
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

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 4"
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
                REVENUE, COGS, AND GROSS PROFIT CHART
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
                <Bar dataKey="revenue" fill="#6495ED" name="Revenue">
                  <LabelList dataKey="revenue" position="top" fill="#6495ED" />
                </Bar>
                <Bar dataKey="cogs" fill="#DC6A6A" name="COGS (Cost of goods sold)">
                  <LabelList dataKey="cogs" position="top" fill="#DC6A6A"></LabelList>
                </Bar>
                <Bar dataKey="grossProfit" fill="#228B22" name="Gross profit">
                  <LabelList dataKey="grossProfit" position="top" fill="#228B22"></LabelList>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 4"
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
                  outerRadius={64}
                >
                  <LabelList dataKey="name" />
                  {categoriesPieChart.map((item) => (
                    <Cell key={`cell-${item.id}`} fill={item.color} stroke={colors.primary[400]} />
                  ))}
                </Pie>
                <Pie
                  data={subCategoriesPieChart}
                  dataKey="qty"
                  innerRadius={65}
                  outerRadius={200}
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

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
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
                TOP 10 USERS WHO BUY THE MOST
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
                TOP 10 BEST SELLING PRODUCTS
              </Typography>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: "85%" }} >
            <Table stickyHeader sx={{ minHeight: "85%" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "700", fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0", textAlign: "center" }}>IMAGE</TableCell>
                  <TableCell sx={{ fontWeight: "700", fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0", textAlign: "center", minWidth: "50px" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "700", fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0" }}>NAME</TableCell>
                  <TableCell sx={{ fontWeight: "700", fontSize: "1rem", backgroundColor: colors.primary[400], padding: "10px 0", textAlign: "center" }} align="right">QUANTITY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topTenBestSellingProducts.map((item) => (
                  <TableRow
                    key={item.productId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: "100px" }}
                  >
                    <TableCell sx={{ padding: "0", textAlign: "center" }}>
                      <img src={`https://res.cloudinary.com/dmjh7imwd/image/upload/${item.image}`} alt="" width={90} style={{ padding: "5px" }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "1rem", color: colors.grey[100], padding: "0", fontWeight: "800", textAlign: "center", minWidth: "50px" }}>{item.productId}</TableCell>
                    <TableCell sx={{ fontSize: "1rem", color: colors.redAccent[400], padding: "0", fontWeight: "800" }}>{item.name}</TableCell>
                    <TableCell sx={{ fontSize: "1rem", color: colors.grey[100], padding: "0", fontWeight: "800", textAlign: "center" }} align="right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
