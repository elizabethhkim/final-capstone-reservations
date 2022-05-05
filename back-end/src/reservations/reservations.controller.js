const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../")
const service = require("./reservations.service")

// to check if all valid properties are included

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
]

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const VALID_STATUS = ["booked", "seated", "finished", "cancelled"]

const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES)

function hasOnlyValidProps(req, res, next) {
  const {data} = req.body
  if (!data) {
    return next({
      status: 400,
      message: "Missing data!"
    })
  }

  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid Field(s): ${invalidFields.join(", ")}`
    })
  }
  next()
}

// takes in a request object and returns a string if the time is not valid, false if valid
function validTime(req) {
  const {reservation_time} = req.body.data
  const timeFormat = /\d\d:\d\d/
  
  //check if the reservation_time is in the right format
  if (!reservation_time.match(timeFormat)) {
    return `reservation_time must be a valid time.`
  }
  // check if the reservation_time is between 10:30AM and 9:30PM
  if (reservation_time < "10:30" || reservation_time> "21:30") {
    return "Reservation must be between 10:30AM and 9:30PM."
  }
  return false
}

// return error message if reservation_date is not in the correct format, in the past, or is on a Tuesday. Otherwise return false
function validDate(req) {
  const {reservation_date, reservation_time} = req.body.data
  
  const today = new Date()
  const resDate = new Date(`${reservation_date} ${reservation_time} GMT-04:00`)
  const dateRegEx = /^\d{4}\-\d{1,2}\-\d{1,2}$/

  const errors = []

  // check if date in the correct format
  if (!reservation_date.match(dateRegEx)) {
    errors.push(`reservation_date must be a valid date.`)
  }

  // check if date is in the past?
  if (resDate<today) {
    errors.push(`Reservation must be made for a future date.`)
  }

  // check if date is on a valid business day
  if (resDate.getDay() === 2) {
    errors.push(`Sorry! We're closed on Tuesdays.`)
  }

  if (errors.length) return errors
  return false
}

// if people value is not an integer or less than 1, return an error message
function peopleIsValid(req) {
  const {people} = req.body.data
  if (!Number.isInteger(people) || people < 1) {
    return "You cannot make a reservation for 0 people."
  }
  return false
}

// if status is not booked, return an error message. otherwise, return false
function statusBooked(req) {
  //default status = booked
  const {status="booked"} = req.body.data
  if (status != "booked") {
    return `A new reservation status must be "booked" - you put ${status}.`
  }
  return false
}

//if reservation is already finished, return an error message.
function finishedStatus(req, res, next) {
  const {status} = res.locals.reservation
  if (status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated.`
    })
  }
  return next()
}

//if status is not valid, return an error
function validStatus(req, res, next) {
  const {status} = req.body.data
  if (!VALID_STATUS.includes(status)) {
    return next({
      status: 400,
      message: `Status must be either ${VALID_STATUS.join(", ")}. You put '${status}.`
    })
  }
  return next()
}

// if reservation doesn't exist, send a 404 response with a message saying the reservation doesn't exist.
async function reservationExists(req, res, next) {
  const {reservation_id} = req.params;
  const foundRes = await service.read(reservation_id)

  if (!foundRes) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} doesn't exist`
    })
  }
  res.locals.reservation = foundRes
  next()
}

// takes a request and creates an array of errors. if array of errors is > 0, returns the next function with a 400 status and a message of errors. if array of errors < 0, it returns the next function
function createValidation(req, res, next) {
  let errors = []

  if (validTime(req)) errors.push(validTime(req))
  if (validDate(req)) errors = [...errors, ...validDate(req)]
  if (peopleIsValid(req)) errors.push(peopleIsValid(req))
  if (statusBooked(req)) errors.push(statusBooked(req))
  if (errors.length > 0) {
    if (errors.length === 1) {
      return next({
        status: 400,
        message: errors[0]
      })
    } else {
      return next({
        status: 400,
        message: errors
      })
    }
  }
  next()
}

// takes request and a next function, then creates array of errors. if greater than 0, it retruns the next function with status 400 and message of the errors. if array <0, returns the next function.
function updateValidation(req, res, next) {
  let errors = []

  if (validTime(req)) errors.push(validTime(req))
  if (validDate(req)) errors = [...errors, ...dateIsValid(req)]
  if (peopleIsValid(req)) errors.push(peopleIsValid(req))
  if (errors.length > 0) {
    if (errors.length === 1) {
      return next({
        status:400, 
        message: errors[0]
      })
    } else {
      return next({
        status: 400,
        message: errors
      })
    }
  }
  next()
}
// end of all validations

// LIST
async function list(req, res) {
  const {date, mobile_number} = req.query

  if (date) {
    res.json({data: await service.listbyDate(date)})
  } else if (mobile_number) {
    res.json({data: await service.searchByPhone(mobile_number)})
  } else {
    res.json({data: await service.list()})
  }
}

// CREATE
async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data)})
}

// READ
function read(req, res) {
  res.json({data: res.locals.reservation})
}

// UPDATE STATUS
async function updateStatus(req, res) {
  const {reservation_id} = res.locals.reservation
  const {status} = req.body.data

  res.json({ data:await service.updateStatus(reservation_id, status) })
}

// UPDATE
async function update(req, res) {
  const {resrvation_id} = res.locals.reservation
  const updatedRes = {
    ...req.body.data,
    reservation_id
  }
  res.json({data: await service.update(updatedRes)})
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasOnlyValidProps,
    createValidation,
    asyncErrorBoundary(create)
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    finishedStatus,
    validStatus,
    asyncErrorBoundary(updateStatus)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    hasOnlyValidProps,
    finishedStatus,
    updateValidation,
    asyncErrorBoundary(update)
  ]
};
