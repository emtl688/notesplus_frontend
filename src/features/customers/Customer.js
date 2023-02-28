import { useNavigate } from "react-router-dom";
import { useGetCustomersQuery } from "./customersApiSlice";
import { memo } from "react";

// MUI TABLE
import {
  TableCell,
  TableRow,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

const Customer = ({ customerId }) => {
  const { customer } = useGetCustomersQuery("customersList", {
    selectFromResult: ({ data }) => ({
      customer: data?.entities[customerId],
    }),
  });

  const navigate = useNavigate();

  if (customer) {
    const updated = new Date(customer.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/customers/${customerId}`);

    return (
      <TableRow key={customer.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">{customer.name}</TableCell>
        <TableCell>{customer.company}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{updated}</TableCell>
        <TableCell sx={{ width: "50px" }}>
          <button className="icon-button table__button" onClick={handleEdit}>
            <Edit />
          </button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

const memoizedCustomer = memo(Customer);

export default memoizedCustomer;