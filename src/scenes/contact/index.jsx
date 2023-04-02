import { AccordionDetails, AccordionSummary, Typography, Accordion, Box, useTheme, FormControl, InputLabel, Select, MenuItem, TextField, TextareaAutosize, Button, Backdrop, CircularProgress } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Header from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useRef, useState } from "react";
import { tokens } from "../../theme";
import { contactsState } from "../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { contactStatusPut } from "../../store/apis";

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import emailjs from '@emailjs/browser';
import { toast } from "react-toastify";

const Contact = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  const handleChangeExpand = (panel) => (event, isExpanded) => {
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

  const [emailReply, setEmailReply] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState("");

  const replyForm = useRef();

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      `service_v14uukq`,
      `template_nj96k0d`,
      replyForm.current,
      `tTjkPKrYPrVzwwvBd`
    )
      .then((result) => {
        handleClose();
        const contact = contacts.find(item => item.id === currentId);
        const temp = { ...contact, status: true };
        dispatch(contactStatusPut(temp));
        setEmailReply("");
        setCustomerName("");
        setMessage("");
        setCurrentId(null);
        setExpanded(false)
        toast.success("Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, (error) => {
        handleClose();
        toast.error(error.text, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  return (
    <Box m="20px">
      <Header title="Contact" />
      <Box display="flex" alignItems="center" gap="20px" pb="20px" flexDirection="row">
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
        <Box display="flex" gap="20px">
          <Box sx={{ width: "50%", height: "65vh", overflow: "auto" }}>
            {contactsToShow.map((item) => (
              <Accordion key={item.id} expanded={expanded === `panel${item.id}`} onChange={handleChangeExpand(`panel${item.id}`)} sx={{ background: colors.primary[400] }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  {item.status
                    ? <CheckIcon sx={{ color: "green", minWidth: "35px", marginRight: "65px" }} />
                    : <CloseIcon sx={{ color: "gray", minWidth: "35px", marginRight: "65px" }} />
                  }
                  <Typography sx={{ flexShrink: 0, minWidth: "150px" }}>{new Date(item.createDate).toISOString().slice(0, 10)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ width: "100px", padding: "5px 0" }}>Email:</Typography> {item.email}
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ width: "100px", padding: "5px 0" }}>Phone:</Typography> {item.phone}
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ width: "100px", padding: "5px 0" }}>Content:</Typography> {item.content}
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="end">
                    <Button variant="contained" color="success" onClick={(e) => { e.preventDefault(); setEmailReply(item.email); setCustomerName(item.fullname); setCurrentId(item.id) }}>
                      Click to reply this contact
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Box sx={{ width: "50%" }}>
            <form ref={replyForm} onSubmit={sendEmail}>
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <TextField
                  sx={{ width: "50%" }}
                  variant="filled"
                  name="user_name"
                  value={customerName}
                  placeholder="Customer Name" />
                <TextField
                  sx={{ width: "50%" }}
                  variant="filled"
                  type="email" name="user_email"
                  value={emailReply}
                  placeholder="To Email" />
              </Box>
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <TextareaAutosize
                  minRows={10}
                  placeholder="Reply message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    outline: "none",
                    border: `1px solid ${colors.grey[100]}`,
                    borderRadius: "5px",
                    padding: "10px",
                    background: colors.primary[400],
                    color: colors.grey[100]
                  }}
                  name="message"
                />
              </Box>
              <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "end" }}>
                <Button type="submit" variant="contained" color="success" onClick={handleToggle}>Send</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Contact;
