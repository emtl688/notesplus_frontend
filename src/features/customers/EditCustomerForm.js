import { useState, useEffect } from "react";
import {
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "./customersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

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
    e.preventDefault();
    if (canSave) {
      await updateCustomer({ id: customer.id, name, company, phone, email });
    }
  };

  const onDeleteCustomerClicked = async () => {
    await deleteCustomer({ id: customer.id });
  };

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

      <ThemeProvider theme={theme}>
        <FormGroup className="form">
          <div className="form__title-row">
            <h3>Edit Customer</h3>
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

          {/* CUSTOMER NAME */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Customer Name"
            id="customer-name"
            name="name"
            type="text"
            value={name}
            onChange={onNameChanged}
            variant="outlined"
            focused
            required
          />

          {/* COMPANY */}
          <TextField
            sx={{ input: { color: "white" } }}
            label="Company"
            id="customer-company"
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
            label="Phone Number"
            id="customer-phone"
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
            label="Email"
            id="customer-email"
            name="email"
            type="text"
            value={email}
            onChange={onEmailChanged}
            variant="outlined"
            focused
            required
          />

          <div style={{ display: "flex" }}>
            <div style={{ width: "50%"}}></div>
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <p className="form__dates">Updated: {updated}</p>
            </div>
          </div>
        </FormGroup>
      </ThemeProvider>
    </>
  );

  return content;
};

export default EditCustomerForm;