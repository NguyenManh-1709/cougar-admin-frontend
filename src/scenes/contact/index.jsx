import { AccordionDetails, AccordionSummary, Typography, Accordion, Box, useTheme, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Header from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { contactsState } from "../../store/selectors";
import { useSelector } from "react-redux";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Contact = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const contacts = useSelector(contactsState);
  const [contactsToShow, setContactsToShow] = useState([]);

  const [statusFilter, setStatusFilter] = useState(-1);
  const [dateFilter, setDateFilter] = useState(-1);

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleChangeDateFilter = (e) => {
    setDateFilter(e.target.value);

    if (e.target.value !== -2) {
      var today = new Date();
      if (e.target.value === 0) {
        setDateRange([today.getTime() - (7 * 24 * 60 * 60 * 1000), today]);
      } else if (e.target.value === 1) {
        setDateRange([today.getTime() - (30 * 24 * 60 * 60 * 1000), today])
      } else {
        setDateRange([null, null])
      }
    }
  }

  useEffect(() => {
    if (startDate === null && endDate === null) {
      setDateFilter(-1)
    }
  }, [startDate, endDate])

  useEffect(() => {
    // Filter status
    const filteredByStatus = statusFilter === 0
      ? contacts.filter(item => item.status === false)
      : statusFilter === 1
        ? contacts.filter(item => item.status === true)
        : contacts;

    // Filter date
    const result = (startDate !== null && endDate !== null)
      ? filteredByStatus.filter(item => {
        const createDate = new Date(item.createDate);
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        const dateStr = createDate.toLocaleDateString();
        return dateStr >= start && dateStr <= end;
      })
      : filteredByStatus;

    setContactsToShow(Object.values(result).sort((a, b) => new Date(b.createDate) - new Date(a.createDate)));
  }, [statusFilter, contacts, startDate, endDate])

  return (
    <Box m="20px">
      <Header title="Contact" />
      <Box display="flex" alignItems="center" justifyContent="end" gap="20px" pb="20px" flexDirection="row">
        <FormControl
          variant="filled"
          sx={{
            minWidth: "150px",
            "& .Mui-focused.css-1m1f1hj-MuiFormLabel-root-MuiInputLabel-root": {
              color: colors.grey[100],
              fontSize: "1rem"
            }
          }}
        >
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value={-1}>All</MenuItem>
            <MenuItem value={0}>Unreplied</MenuItem>
            <MenuItem value={1}>Replied</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="filled"
          sx={{
            minWidth: "150px",
            "& .Mui-focused.css-1m1f1hj-MuiFormLabel-root-MuiInputLabel-root": {
              color: colors.grey[100],
              fontSize: "1rem"
            }
          }}
        >
          <InputLabel id="date-filter-label">Date</InputLabel>
          <Select
            labelId="date-filter-label"
            id="date-filter-select"
            value={dateFilter}
            label="Date"
            onChange={handleChangeDateFilter}
          >
            <MenuItem value={-2}>
              Custom range
            </MenuItem>
            <MenuItem value={-1}>All</MenuItem>
            <MenuItem value={0}>Last 7 days</MenuItem>
            <MenuItem value={1}>Last 30 days</MenuItem>
          </Select>
        </FormControl>
        {dateFilter === -2 && (
          <Box sx={{ width: "250px" }}>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              withPortal
              isClearable
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              fixedHeight
              dateFormat="dd/MM/yyyy"
              placeholderText="From - To"
              maxDate={new Date()}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Box sx={{ background: colors.primary[400], padding: "16px" }}>
          <Typography sx={{ display: "inline-block", minWidth: "100px" }}>Status</Typography>
          <Typography sx={{ display: "inline-block", minWidth: "150px" }}>Create date</Typography>
          <Typography sx={{ display: "inline-block" }}>Email</Typography>
        </Box>
        {contactsToShow.map((item) => (
          <Accordion key={item.id} expanded={expanded === `panel${item.id}`} onChange={handleChange(`panel${item.id}`)} sx={{ background: colors.primary[400] }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              {item.status
                ? <CheckIcon sx={{ color: "green", minWidth: "35px", marginRight: "65px" }} />
                : <CloseIcon sx={{ color: "gray", minWidth: "35px", marginRight: "65px" }} />
              }
              <Typography sx={{ flexShrink: 0, minWidth: "150px" }}>{item.createDate}</Typography>
              <Typography>{item.email}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <textarea
                value={item.content}
                disabled
                style={{
                  width: "100%",
                  minHeight: "100px",
                  background: "transparent",
                  border: `1px solid ${colors.grey[100]}`,
                  color: colors.grey[100],
                  padding: "10px",
                  borderRadius: "5px"
                }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default Contact;
