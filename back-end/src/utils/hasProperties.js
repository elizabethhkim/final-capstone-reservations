/**
 * It takes a list of properties and returns a middleware function that checks if the response body
 * contains all of the properties
 * @param properties - An array of strings that represent the properties that are required.
 * @returns A function that takes in a response, request, and next function.
 */
 function hasProperties(properties) {
    return function (res, req, nxt) {
      const { data = {} } = res.body;
      properties.forEach((property) => {
        if (!data[property]) {
          return nxt({
            status: 400,
            message: `A '${property}' property is required.`,
          });
        }
      });
      nxt();
    };
  }
  
  module.exports = hasProperties;