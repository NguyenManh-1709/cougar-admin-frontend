import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { Tooltip } from '@mui/material';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const ProductCard = (props) => {
    const { productItem } = props;
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ border: "1px solid white" }}>
            <CardMedia
                sx={{ background: "lightgray", width: "100%", height: "368px", objectFit: "contain" }}
                component="img"
                image={`https://res.cloudinary.com/dmjh7imwd/image/upload/${productItem.image}`}
                alt=""
            />
            <CardContent>
                <Typography variant="body2" fontSize={"1.3rem"}>
                    {productItem.product.name}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Edit">
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography fontSize={"1rem"} paragraph>Category: {productItem.product.subcategory.category.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>SubCategory: {productItem.product.subcategory.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Brand: {productItem.product.brand.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>SKU: {productItem.sku}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Price: {productItem.price}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Quantity: {productItem.qtyInStock}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Create date: {productItem.createDate}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default ProductCard;