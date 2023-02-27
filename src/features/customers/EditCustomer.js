import { useParams } from "react-router-dom";
import EditCustomerForm from "./EditCustomerForm";
import { useGetCustomersQuery } from "./customersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditCustomer = () => {
  useTitle("Edit Customer");

  const { id } = useParams();

  const { customer } = useGetCustomersQuery("customersList", {
    selectFromResult: ({ data }) => ({
        customer: data?.entities[id],
    }),
  });

  if (!customer) return <PulseLoader color={"#FFF"} />;

  const content = <EditCustomerForm customer={customer} />;

  return content;
};

export default EditCustomer;