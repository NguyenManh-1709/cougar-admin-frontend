import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatBox = ({ total, title, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: colors.greenAccent[200] }}
          >
            {total}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[200] }}>
          {title}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[200] }}
        >
          <Tooltip title="Percent growth over the previous month" sx={{ cursor: "default" }}>
            <Box display="flex" alignItems="center" gap="10px">
              <TrendingUpIcon />
              <Box>{increase} %</Box>
            </Box>
          </Tooltip>
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
