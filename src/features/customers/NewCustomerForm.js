import { useState, useEffect } from "react";
import useTitle from "../../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { useAddNewCustomerMutation } from "./customersApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// MUI
import { TextField, FormGroup } from "@mui/material";
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

  const canSave =
    [validName, validCompany, validPhone, validEmail].every(Boolean) &&
    !isLoading;

  const onSaveCustomerClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewCustomer({ name, company, phone, email });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <ThemeProvider theme={theme}>
        <FormGroup className="form">
          <div className="form__title-row">
            <h3>Add New Customer</h3>
            <div className="form__action-buttons">
              <button
                className="icon-button"
                title="Save"
                onClick={onSaveCustomerClicked}
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>
          </div>

          {/* CUSTOMER NAME */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Customer Name (Min. 4 characters)"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={onNameChanged}
            variant="outlined"
            focused
            required
          />

          {/* COMPANY NAME */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Company (Min. 4 characters)"
            id="company"
            name="company"
            type="text"
            value={company}
            onChange={onCompanyChanged}
            variant="outlined"
            focused
            required
          />

          {/* PHONE NUMBER */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Phone Number (Min. 10 digits)"
            id="phone"
            name="phone"
            type="text"
            value={phone}
            onChange={onPhoneChanged}
            variant="outlined"
            focused
            required
          />

          {/* EMAIL */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Email (Must include @ and .)"
            id="email"
            name="email"
            type="text"
            value={email}
            onChange={onEmailChanged}
            variant="outlined"
            focused
            required
          />
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default NewCustomerForm;
