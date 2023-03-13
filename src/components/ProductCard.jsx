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
import { useNavigate } from 'react-router-dom';

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
    const { product } = props;
    const [expanded, setExpanded] = React.useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ border: "1px solid white" }}>
            <CardMedia
                sx={{ background: "lightgray", width: "100%", height: "368px", objectFit: "contain" }}
                component="img"
                image={`https://res.cloudinary.com/dmjh7imwd/image/upload/${product.image}`}
                alt=""
            />
            <CardContent>
                <Typography variant="body2" fontSize={"1.3rem"}>
                    {product.name}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Edit">
                    <IconButton onClick={() => {
                        navigate(`/createproduct/${product.id}`);
                    }}>
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
                    <Typography fontSize={"1rem"} paragraph>Category: {product.subcategory.category.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>SubCategory: {product.subcategory.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Brand: {product.brand.name}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Create date: {product.createDate}</Typography>
                    <Typography fontSize={"1rem"} paragraph>Description: {product.description}</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default ProductCard;