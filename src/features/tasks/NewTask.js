import NewTaskForm from "./NewTaskForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetCustomersQuery } from "../customers/customersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const NewTask = () => {
  useTitle("New Task");

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  const { customers } = useGetCustomersQuery("customersList", {
    selectFromResult: ({ data }) => ({
      customers: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color={"#FFF"} />;

  if (!customers?.length) return <PulseLoader color={"#FFF"} />;

  const content = <NewTaskForm users={users} customers={customers} />;

  return content;
};

export default NewTask;