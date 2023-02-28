import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

// MUI TABLE
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const UsersList = () => {
  useTitle("Users List");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0.6em",
        }}
      >
        <TableContainer sx={{ width: "99%" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role(s)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableContent}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return content;
};

export default UsersList;