import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  let errMsg;
  if (error) {
    errMsg = Array.isArray(error.message) ? (
      error.message.map((msg) => {
        return <li>{msg}</li>;
      })
    ) : (
      <li>{error.message}</li>
    );
  }

  return (
    error && (
      <div className="alert alert-danger m-2">
        Please fix the following errors:
        <ul>{errMsg}</ul>
      </div>
    )
  );
}

export default ErrorAlert;
