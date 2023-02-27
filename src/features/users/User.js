import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";

// MUI TABLE
import { TableCell, TableRow } from "@mui/material";
import { Edit } from "@mui/icons-material";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell>{user.username}</TableCell>
        <TableCell>
          {user.active ? (
            <span className="note__status--completed">Active</span>
          ) : (
            <span className="note__status--open">Inactive</span>
          )}
        </TableCell>
        <TableCell>{userRolesString}</TableCell>
        <TableCell sx={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <Edit />
          </button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;