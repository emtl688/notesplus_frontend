import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { Box } from "@mui/material";

const Welcome = () => {
  useTitle("Dashboard");

  const { username, isManager, isAdmin } = useAuth();

  const content = (
    <Box className="welcome">
      <h2 className="welcome__user">Welcome {username} !</h2>

      <Box className="welcome__categories">
        {/* TASKS */}
        <Box className="category__column">
          <h3 className="welcome__subtitle">Tasks</h3>
          <div className="welcome__sublink">
            <Link to="/dash/tasks">View Open Tasks</Link>
          </div>
          <div className="welcome__sublink">
            <Link to="/dash/tasks/new">Add New Task</Link>
          </div>
        </Box>
        {/* CUSTOMERS */}
        <Box className="category__column">
          <h3 className="welcome__subtitle">Customers</h3>
          <div className="welcome__sublink">
            <Link to="/dash/customers">View All Customers</Link>
          </div>
          <div className="welcome__sublink">
            <Link to="/dash/customers/new">Add New Customer</Link>
          </div>
        </Box>
        {/* USERS (ADMIN ONLY) */}
        <Box className="category__column">
          <h3 className="welcome__subtitle">Users</h3>
          {(isManager || isAdmin) && (
            <div className="welcome__sublink">
              <Link to="/dash/users">View All Users</Link>
            </div>
          )}
          {(isManager || isAdmin) && (
            <div className="welcome__sublink">
              <Link to="/dash/users/new">Add New User</Link>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );

  return content;
};

export default Welcome;