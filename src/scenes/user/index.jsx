import { Box, Tooltip } from "@mui/material";
import { usersWithRolesState } from "../../store/selectors";
import MyTable from "../../components/MyTable";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';

const User = () => {
    const usersWithRoles = useSelector(usersWithRolesState);

    const usersColumns = [
        {
            field: "id",
            headerName: "ID",
        },
        {
            field: "fullname",
            headerName: "FULLNAME",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phone",
            headerName: "PHONE",
            flex: 1,
        },
        {
            field: "email",
            headerName: "EMAIL",
            flex: 1,
        },
        {
            field: "createDate",
            headerName: "CREATEDATE",
            flex: 1,
            renderCell: ({ row: { createDate } }) => {
                const temp = new Date(createDate).toISOString().slice(0, 10);
                return (
                    temp
                );
            },
        },
        {
            field: "role",
            headerName: "ROLES",
            flex: 1,
        },
        {
            field: "edit",
            headerName: "EDIT",
            renderCell: ({ row: { id, role } }) => {
                if (role.includes('ADMIN')) {
                    return (
                        <Tooltip title="Edit" placement="right">
                            <Link
                                to={`/edit-admin/${id}`}
                                style={{
                                    textDecoration: 'none',
                                    background: "#1F2A40",
                                    color: "white",
                                    padding: "10px",
                                    borderRadius: "5px"
                                }}
                            >
                                <EditIcon/>
                            </Link>
                        </Tooltip>
                    );
                } else { return (<Box></Box>); }
            },
        },
    ];

    return (
        <Box m="20px">
            <MyTable
                rows={usersWithRoles}
                columns={usersColumns}
                title={"MANAGEMENT YOUR USERS"}
            />

            <Box display="flex" justifyContent="end" mt="10px">
                <Link
                    to="/create-admin"
                    style={{
                        textDecoration: 'none',
                        background: "#1F2A40",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px"
                    }}
                >
                    Create a new admin account
                </Link>
            </Box>
        </Box >
    );
};

export default User;
