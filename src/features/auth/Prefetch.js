import { store } from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { tasksApiSlice } from "../tasks/tasksApiSlice";
import { customersApiSlice } from "../customers/customersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(usersApiSlice.util.prefetch("getUsers", "usersList", { force: true }));
    store.dispatch(tasksApiSlice.util.prefetch("getTasks", "tasksList", { force: true }));
    store.dispatch(customersApiSlice.util.prefetch("getCustomers", "customersList", { force: true }));
  }, []);

  return <Outlet />;
};

export default Prefetch;