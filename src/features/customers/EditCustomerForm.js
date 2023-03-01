import { useState, useEffect } from "react";
import {
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "./customersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditCustomerForm = ({ customer }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateCustomer, { isLoading, isSuccess, isError, error }] =
    useUpdateCustomerMutation();

  const [
    deleteCustomer,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteCustomerMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(customer.name);
  const [company, setCompany] = useState(customer.company);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      navigate("/dash/customers");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onCompanyChanged = (e) => setCompany(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  const canSave = [name, company, phone, email].every(Boolean) && !isLoading;

  const onSaveCustomerClicked = async (e) => {
    if (canSave) {
      await updateCustomer({ id: customer.id, name, company, phone, email });
    }
  };

  const onDeleteCustomerClicked = async () => {
    await deleteCustomer({ id: customer.id });
  };

  const created = new Date(customer.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(customer.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteCustomerClicked}
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
          <h2>Edit Customer</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveCustomerClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>

        <label className="form__label" htmlFor="customer-name">
          Name:
        </label>
        <input
          className="form__input"
          id="customer-name"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="customer-company">
          Company:
        </label>
        <input
          className="form__input"
          id="customer-company"
          name="company"
          type="text"
          autoComplete="off"
          value={company}
          onChange={onCompanyChanged}
        />

        <label className="form__label" htmlFor="customer-phone">
          Phone Number:
        </label>
        <input
          className="form__input"
          id="customer-phone"
          name="phone"
          type="text"
          autoComplete="off"
          value={phone}
          onChange={onPhoneChanged}
        />

        <label className="form__label" htmlFor="customer-email">
          Email:
        </label>
        <input
          className="form__input"
          id="customer-email"
          name="email"
          type="text"
          autoComplete="off"
          value={email}
          onChange={onEmailChanged}
        />

        <div className="form__row" style={{ marginBottom: "0.8em" }}>
          <div className="form__divider">
            <p className="form__dates">
              Created:
              <br />
              {created}
            </p>
          </div>
          <div className="form__divider">
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

export default EditCustomerForm;