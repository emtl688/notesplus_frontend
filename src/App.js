import { Routes, Route } from "react-router-dom";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
// DASHBOARD COMPONENTS
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
// USERS
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
// TASKS
import TasksList from "./features/tasks/TasksList";
import EditTask from "./features/tasks/EditTask";
import NewTask from "./features/tasks/NewTask";
// CUSTOMERS
import CustomersList from "./features/customers/CustomersList";
import EditCustomer from "./features/customers/EditCustomer";
import NewCustomerForm from "./features/customers/NewCustomerForm";

function App() {
  useTitle("MyCRM | Login");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Employee portal */}
        <Route index element={<Login />} />
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="tasks">
                  <Route index element={<TasksList />} />
                  <Route path=":id" element={<EditTask />} />
                  <Route path="new" element={<NewTask />} />
                </Route>

                <Route path="customers">
                  <Route index element={<CustomersList />} />
                  <Route path=":id" element={<EditCustomer />} />
                  <Route path="new" element={<NewCustomerForm />} />
                </Route>

              </Route>
            </Route>
          </Route>
        </Route>
        {/* End */}
      </Route>
    </Routes>
  );
}

export default App;