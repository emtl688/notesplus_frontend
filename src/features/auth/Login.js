import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

// MUI
import { Box, TextField, Button, FormGroup } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#2196f3",
    },
  },
});

const Login = () => {
  useTitle("MyCRM | Login");

  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Wrong Username or Password");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <PulseLoader color={"#FFF"} />;

  const content = (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <section>
          <header>
            <h1 style={{ textAlign: "center", marginBottom: "0.5em" }}>
              MyCRM | Login
            </h1>
          </header>
          <main className="login">
            {/* LOGIN FORM */}
            <FormGroup className="loginform">
              {/* USERNAME INPUT */}
              <TextField
                label="Username"
                id="username"
                type="text"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="off"
                variant="outlined"
                sx={{ width: "100%", input: { color: "white" } }}
                focused
                required
              />

              {/* PASSWORD INPUT */}
              <TextField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={handlePwdInput}
                variant="outlined"
                sx={{ width: "100%", input: { color: "white" } }}
                focused
                required
              />

              <label
                htmlFor="persist"
                style={{ alignSelf: "flex-start" }}
                className="form__persist"
              >
                <input
                  type="checkbox"
                  className="form__checkbox"
                  id="persist"
                  onChange={handleToggle}
                  checked={persist}
                />
                Trust This Device
              </label>

              {/* SIGN IN BUTTON */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  width: "100%",
                  color: "white",
                  fontSize: "0.9em",
                  border: "2px solid white",
                  backgroundColor: "#001137",
                  "&:hover": { backgroundColor: "#06215c" },
                }}
                onClick={handleSubmit}
              >
                Sign In
              </Button>

              <span ref={errRef} className={errClass} aria-live="assertive">
                {errMsg}
              </span>
            </FormGroup>
          </main>
        </section>
      </Box>
    </ThemeProvider>
  );

  return content;
};

export default Login;
