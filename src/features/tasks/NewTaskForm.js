import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewTaskMutation } from "./tasksApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

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

  const canSave = [title, text, userId, customerId].every(Boolean) && !isLoading;

  const onSaveTaskClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewTask({ user: userId, customer: customerId, title, text });
    }
  };

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

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveTaskClicked}>
        <div className="form__title-row">
          <h2>Add New Task</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label"
              htmlFor="username"
            >
              Assign to:
            </label>
            <select
              id="username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {userOptions}
            </select>
          </div>
          <div className="form__divider">
            <label
              className="form__label"
              htmlFor="customer"
            >
              Customer:
            </label>
            <select
              id="customer"
              name="customer"
              className="form__select"
              value={customerId}
              onChange={onCustomerIdChanged}
            >
              {customerOptions}
            </select>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default NewTaskForm;
