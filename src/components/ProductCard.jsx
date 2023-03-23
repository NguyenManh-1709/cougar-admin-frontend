import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { tokens } from "../theme";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProductCard = (props) => {
  const { product } = props;
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className="product-card"
      style={{ border: `1px solid ${colors.primary[100]}` }}
    >
      <CardMedia
        sx={{ background: "lightgray", height: "260px", objectFit: "contain" }}
        component="img"
        image={`https://res.cloudinary.com/dmjh7imwd/image/upload/${product.image}`}
        alt=""
      />
      <CardContent style={{ height: "60px" }}>
        <Typography variant="body2" fontSize={"1.3rem"}>
          {product.name}
        </Typography>
      </CardContent>
      <CardActions className="justify-content-between dropdown">
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              navigate(`/createproduct/${product.id}`);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <div
          style={{ cursor: "pointer" }}
          onClick={handleExpandClick}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Detail
          <ExpandMoreIcon />
        </div>

        <CardContent
          style={{
            backgroundColor: colors.grey[100],
            color: colors.primary[900],
          }}
          className="detail dropdown-menu"
        >
          <Typography fontSize={"1rem"} paragraph>
            Category: {product.subcategory.category.name}
          </Typography>
          <Typography fontSize={"1rem"} paragraph>
            SubCategory: {product.subcategory.name}
          </Typography>
          <Typography fontSize={"1rem"} paragraph>
            Brand: {product.brand.name}
          </Typography>
          <Typography fontSize={"1rem"} paragraph>
            Create date: {product.createDate}
          </Typography>
          <Typography fontSize={"1rem"} paragraph>
            Description: {product.description}
          </Typography>
        </CardContent>
      </CardActions>
    </div>
  );
};

export default ProductCard;
