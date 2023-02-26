import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { Box, Grid } from "@mui/material";

const Welcome = () => {
  useTitle("Home");

  const { username, isManager, isAdmin } = useAuth();

  const content = (
    <section className="welcome">
      <header>
        <h1 className="welcome__user">Welcome {username} !</h1>
      </header>
      <main style={{ flexDirection: "row", width: "100%", paddingTop: "10px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={8}>
            {/* TASKS / NOTES */}
            <Grid item xs={3}>
              <h3 className="welcome__subtitle">Notes</h3>
              <div className="welcome__sublink">
                <Link to="/dash/notes">View Open Notes</Link>
              </div>
              <div className="welcome__sublink">
                <Link to="/dash/notes/new">Add New Note</Link>
              </div>
            </Grid>
            {/* USERS (ADMINS ONLY) */}
            {(isManager || isAdmin) && (
              <Grid item xs={3}>
                <h3 className="welcome__subtitle">Users</h3>
                <div className="welcome__sublink">
                  <Link to="/dash/users">View User Settings</Link>
                </div>
                <div className="welcome__sublink">
                  <Link to="/dash/users/new">Add New User</Link>
                </div>
              </Grid>
            )}
          </Grid>
        </Box>
      </main>
    </section>
  );

  return content;
};

export default Welcome;
