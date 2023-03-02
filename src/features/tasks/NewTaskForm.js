import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewTaskMutation } from "./tasksApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

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

const NewTaskForm = ({ users, customers }) => {
  const [addNewTask, { isLoading, isSuccess, isError, error }] =
    useAddNewTaskMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);
  const [customerId, setCustomerId] = useState(customers[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      setCustomerId("");
      navigate("/dash/tasks");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onCustomerIdChanged = (e) => setCustomerId(e.target.value);

  const canSave =
    [title, text, userId, customerId].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTask({ user: userId, customer: customerId, title, text });
    }
  };

  const userOptions = users.map((user) => {
    return (
      <MenuItem key={user.id} value={user.id}>
        {user.username}
      </MenuItem>
    );
  });

  const customerOptions = customers.map((customer) => {
    return (
      <MenuItem key={customer.id} value={customer.id}>
        {customer.name}
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
            <h3>Add New Task</h3>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                onClick={onSaveTaskClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>

          {/* TITLE */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Task Title"
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={onTitleChanged}
            variant="outlined"
            focused
            required
          />

          {/* TEXT / DESCRIPTION */}
          <TextField
            inputProps={{ style: { color: "white" } }}
            label="Task Description"
            id="text"
            type="text"
            name="text"
            value={text}
            onChange={onTextChanged}
            variant="outlined"
            multiline
            rows={4}
            focused
            required
          />

          {/* CUSTOMER */}
          <FormControl>
            <InputLabel id="task-customer-label" sx={{ color: "white" }}>
              Customer :
            </InputLabel>
            <Select
              sx={MuiSelectStyling}
              labelId="task-customer-label"
              id="customer"
              name="customer"
              value={customerId}
              onChange={onCustomerIdChanged}
              label="Customer :"
            >
              {customerOptions}
            </Select>
          </FormControl>

          {/* ASSIGNED USER / EMPLOYEE */}
          <FormControl>
            <InputLabel id="task-username-label" sx={{ color: "white" }}>
              Assigned to :
            </InputLabel>
            <Select
              sx={MuiSelectStyling}
              labelId="task-username-label"
              id="username"
              name="username"
              value={userId}
              onChange={onUserIdChanged}
              label="Assigned to :"
            >
              {userOptions}
            </Select>
          </FormControl>
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default NewTaskForm;