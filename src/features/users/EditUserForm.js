import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

// MUI
import {
  TextField,
  Checkbox,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
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

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(typeof value === "string" ? value.split(",") : value);
  };

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  const roleOptions = Object.values(ROLES).map((role) => {
    return (
      <MenuItem key={role} value={role}>
        {role}
      </MenuItem>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <ThemeProvider theme={theme}>
        <FormGroup className="form">
          <div className="form__title-row">
            <h3>Edit User</h3>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                onClick={onSaveUserClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteUserClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
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

          {/* ACTIVE USER CHECKBOX */}
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white",
                  },
                }}
              />
            }
            label="Active"
            id="user-active"
            name="user-active"
            checked={active}
            onChange={onActiveChanged}
          />
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default EditUserForm;