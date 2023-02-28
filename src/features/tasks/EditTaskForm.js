import { useState, useEffect } from "react";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "./tasksApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

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

  const canSave = [title, text, userId, customerId].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    if (canSave) {
      await updateTask({ id: task.id, user: userId, customer: customerId, title, text, completed });
    }
  };

  const onDeleteTaskClicked = async () => {
    await deleteTask({ id: task.id });
  };

  const created = new Date(task.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
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
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const customerOptions = customers.map((customer) => {
    return (
      <option key={customer.id} value={customer.id}>
        {" "}
        {customer.name}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

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

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Task #{task.ticket}</h2>
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
        <label className="form__label" htmlFor="task-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="task-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <div className="form__row">
          <div className="form__divider">
            <label className="form__label" htmlFor="task-text">
              Text:
            </label>
            <textarea
              className={`form__input form__input--text ${validTextClass}`}
              id="task-text"
              name="text"
              value={text}
              onChange={onTextChanged}
            />
          </div>
          <div className="form__divider">
            <label
              className="form__label"
              htmlFor="task-username"
            >
              Assigned to:
            </label>
            <select
              id="task-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {userOptions}
            </select>

            <label
              className="form__label"
              htmlFor="task-customer"
            >
              Customer:
            </label>
            <select
              id="task-customer"
              name="customer"
              className="form__select"
              value={customerId}
              onChange={onCustomerIdChanged}
            >
              {customerOptions}
            </select>
          </div>
        </div>

        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="task-completed"
            >
              Mark as complete:
              <input
                className="form__checkbox"
                id="task-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>
          </div>
          <div className="form__divider">
            <p className="form__dates">
              Created:
              <br />
              {created}
            </p>
            <p className="form__dates">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditTaskForm;
