import React, { useState } from "react";
import { Alert, Button, Form, FormGroup, Input, Container } from "reactstrap";

import api from "../../services/api";

const ResetPassword = ({ history }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("result of the submit", password);

    const response = await api.post("/resetpassword", { password });
    //const userId = response.data._id || false;
    const user = response.data.user || false;
    const user_id = response.data.user_id || false;

    try {
      if (user && user_id) {
        localStorage.setItem("user", user);
        localStorage.setItem("user_id", user_id);

        history.push("/");
      } else {
        const { message } = response.data;
        setError(true);
        setErrorMessage(message);
        console.log(message);

        setTimeout(() => {
          setError(false);
          setErrorMessage("");
        }, 2000);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(`Error, the server returned an error`);
    }
  };

  return (
    <Container>
      <h2> Reset Password </h2>
      <p>Submit your new password</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="new password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            name="password"
            id="examplePassword_confirm"
            placeholder="Confirm new password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Button className="submit-btn">Submit</Button>
        </FormGroup>
      </Form>
      {error ? (
        <Alert color="danger" className="event-validation">
          {errorMessage}
        </Alert>
      ) : (
        ""
      )}
    </Container>
  );
};

export default ResetPassword;
