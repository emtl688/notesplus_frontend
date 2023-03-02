import { useState, useEffect } from "react";
import useTitle from "../../hooks/useTitle";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

// MUI
import {
  TextField,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
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

const MuiSelectStyling = {
  color: "white",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    border: "2px solid",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    border: "2px solid",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
    border: "2px solid",
  },
  ".MuiSvgIcon-root ": {
    fill: "white !important",
  },
};

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  useTitle("Add New User");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const roleOptions = Object.values(ROLES).map((role) => {
    return (
      <MenuItem key={role} value={role}>
        {role}
      </MenuItem>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <ThemeProvider theme={theme}>
        <FormGroup className="form">
          <div className="form__title-row">
            <h3>New User</h3>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                onClick={onSaveUserClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>

          {/* USERNAME */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Username [3-20 letters]"
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={onUsernameChanged}
            variant="outlined"
            focused
            required
          />

          {/* PASSWORD */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Password [4-12 chars incl. !@#$%]"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChanged}
            variant="outlined"
            focused
            required
          />

          {/* USER ROLE */}
          <FormControl>
            <InputLabel id="user-role-label" sx={{ color: "white" }}>
              User Role(s) :
            </InputLabel>
            <Select
              sx={MuiSelectStyling}
              labelId="user-role-label"
              id="roles"
              name="roles"
              value={roles}
              onChange={onRolesChanged}
              label="User Role(s) :"
              multiple
            >
              {roleOptions}
            </Select>
          </FormControl>
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default NewUserForm;