import { useState, useEffect } from "react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

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

const EditTaskForm = ({ task, users, customers }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateTask, { isLoading, isSuccess, isError, error }] =
    useUpdateTaskMutation();

  const [
    deleteTask,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteTaskMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(task.title);
  const [text, setText] = useState(task.text);
  const [completed, setCompleted] = useState(task.completed);
  const [userId, setUserId] = useState(task.user);
  const [customerId, setCustomerId] = useState(task.customer);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      setCustomerId("");
      navigate("/dash/tasks");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);
  const onCustomerIdChanged = (e) => setCustomerId(e.target.value);

  const canSave =
    [title, text, userId, customerId].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await updateTask({
        id: task.id,
        user: userId,
        customer: customerId,
        title,
        text,
        completed,
      });
    }
  };

  const onDeleteTaskClicked = async () => {
    await deleteTask({ id: task.id });
  };

  const updated = new Date(task.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

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

  const errClass = isError || isDelError ? "errmsg" : "offscreen";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteTaskClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <ThemeProvider theme={theme}>
        <FormGroup className="form">
          <div className="form__title-row">
            <h3>Edit Task #{task.ticket}</h3>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                onClick={onSaveTaskClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              {deleteButton}
            </div>
          </div>

          {/* TITLE */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Task Title"
            id="task-title"
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
            id="task-text"
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
              id="task-customer"
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
              id="task-username"
              value={userId}
              onChange={onUserIdChanged}
              label="Assigned to :"
            >
              {userOptions}
            </Select>
          </FormControl>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "50%", justifyContent: "flex-start" }}>
              <p className="form__dates">Updated: {updated}</p>
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/* COMPLETED CHECKBOX */}
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
                label="Mark as completed"
                id="task-completed"
                name="completed"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </div>
          </div>
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default EditTaskForm;