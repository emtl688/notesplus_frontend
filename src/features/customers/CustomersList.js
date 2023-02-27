import { useGetCustomersQuery } from "./customersApiSlice";
import Customer from "./Customer";
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

const CustomersList = () => {
  useTitle("Customers List");

  const {
    data: customers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCustomersQuery("customersList", {
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
    const { ids } = customers;

    const tableContent =
      ids?.length && ids.map((customerId) => <Customer key={customerId} customerId={customerId} />);

    content = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "0.6em",
        }}
      >
        <TableContainer sx={{ width: "98%" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last updated</TableCell>
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

export default CustomersList;