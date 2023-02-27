import { useState, useEffect } from "react";
import useTitle from "../../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { useAddNewCustomerMutation } from "./customersApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NAME_COMPANY_REGEX = /^[\w\s]{4,20}$/;
const PHONE_REGEX = /^(?:\D*\d){10}\D*$/;
const EMAIL_REGEX = /^[^@\n]+@[^@\n]+\.[^@\n]+$/;

const NewCustomerForm = () => {
  useTitle("Add New Customer");

  const [addNewCustomer, { isLoading, isSuccess, isError, error }] =
    useAddNewCustomerMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [company, setCompany] = useState("");
  const [validCompany, setValidCompany] = useState(false);
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    setValidName(NAME_COMPANY_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidCompany(NAME_COMPANY_REGEX.test(company));
  }, [company]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    if (isSuccess) {
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      navigate("/dash/customers");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onCompanyChanged = (e) => setCompany(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  const canSave = [validName, validCompany, validPhone, validEmail].every(Boolean) && !isLoading;

  const onSaveCustomerClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewCustomer({ name, company, phone, email });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validNameClass = !validName ? "form__input--incomplete" : "";
  const validCompanyClass = !validCompany ? "form__input--incomplete" : "";
  const validPhoneClass = !validPhone ? "form__input--incomplete" : "";
  const validEmailClass = !validEmail ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveCustomerClicked}>
        <div className="form__title-row">
          <h2>Add New Customer</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="name">
          Name (Min. 4 characters) :
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="company">
          Company (Min. 4 characters) :
        </label>
        <input
          className={`form__input ${validCompanyClass}`}
          id="company"
          name="company"
          type="text"
          autoComplete="off"
          value={company}
          onChange={onCompanyChanged}
        />

        <label className="form__label" htmlFor="phone">
          Phone Number (Min. 10 digits) :
        </label>
        <input
          className={`form__input ${validPhoneClass}`}
          id="phone"
          name="phone"
          type="text"
          autoComplete="off"
          value={phone}
          onChange={onPhoneChanged}
        />

        <label className="form__label" htmlFor="email">
          Email (Must include @ and .) :
        </label>
        <input
          className={`form__input ${validEmailClass}`}
          id="email"
          name="email"
          type="text"
          autoComplete="off"
          value={email}
          onChange={onEmailChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewCustomerForm;
