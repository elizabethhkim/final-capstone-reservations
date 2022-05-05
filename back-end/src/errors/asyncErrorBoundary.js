/**
 * call the inputted async function to maintain error handling while keeping code DRY
 *
 * @param delegate
 *  async handler or middleware function
 * @param defaultStatus
 *  optional parameter offering ability to overwride error status code
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */

 function asyncErrorBoundary(delegate, defaultStatus) {
    return (req, res, nxt) => {
      Promise.resolve() // * ensures delegate is called in a promise chain with a .catch()
        .then(() => delegate(req, res, nxt))
        .catch((error = {}) => { // * defaults to an empty object incase error is undefined
          const { status = defaultStatus, message = error } = error; // * defaulting message to error allows error to be a string or an object
          nxt({ status, message });
        });
    };
  }
  
  module.exports = asyncErrorBoundary;