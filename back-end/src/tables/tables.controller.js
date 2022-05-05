const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const resService = require("../reservations/reservations.service")
const hasProperties = require("../utils/hasProperties")

// VALIDATIONS START
const REQUIRED_PROPERTIES = ["table_name", "capacity"]
const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"]
const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES)

function hasOnlyValidProps(req, res, next) {
    const {data} = req.body

    if(!data) {
        return next({
            status:400,
            message: "Data Required!"
        })
    }
    const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))
    if (invalidFields.length) {
        return next({
            status:400,
            message: `Invalid Field(s): ${invalidFields.join(", ")}`
        })
    }
    next()
}

// if table_name not provided || < 2 chars, retunr error message. otherwise return false
function nameisValid(req) {
    const {table_name} = req.body.data

    if(!table_name || table_name.length < 2) {
        return "table_name must be at least two characters"
    }
    return false
}

// if capacity is not a number || <1, return error message. else returns false
function capacityisValid(req) {
    const {capacity} = req.body.data

    if (!capacity || !Number.isInteger(capacity)) {
        return "A table must seat at least a capacity of one."
    }
    return false
}

// if table occupied, return error
function tableIsAvailable(req, res, next) {
    const {reservation_id} = res.locals.table
    if (reservation_id) {
        return next({
            status: 400,
            message: "Cannot seat an occupied table."
        })
    }
    next()
}

// if number of ppl in the reservation is > capacity of the table, return error. else return next
function tableCanSeat(req, res, next) {
    const {capacity} = res.locals.table
    const {people} = res.locals.reservation_id

    if (people > capacity) {
        return next({
            status: 400,
            message: "Table does not have sufficient capacity for this party."
        })
    }
    next()
}

// if table is not occupied, return error
function tableIsOccupied(req, res, next) {
    const {reservation_id} = res.locals.table

    if(!reservation_id) {
        return next({
            status: 400,
            message: "Table is not occupied."
        })
    }
    next()
}

// if reservation has already been seated, don't let user seat the reservation, else return next 
function canBeSeat(req, res, next) {
    const {status} = res.locals.reservation
    if (status === "seated") {
        return next({
            status: 400,
            message: "Party has already been seated."
        })
    }
    next()
}

//if reservation doesn't exist, send 404 response with a message saying the reservation doesn't exist
async function reservationExists(req, res, next) {
    const {reservation_id} = req.body.data
    if (!reservation_id) {
        return next({
            status: 400,
            message: "A reservation_id is required to seat table."
        })
    }
    const foundRes = await resService.read(reservation_id)

    if (!foundRes) {
        return next({
            status:404,
            message: `Reservation ${reservation_id} doesn't exist.`
        })
    }
    res.locals.reservation = foundRes
    next()
}

// if table doesn't exist, send 404 response with a message saying the table doesn't exist

async function tableExists(req, res, next) {
    const {table_id} = req.params
    const foundTable = await service.read(table_id)

    if (!foundTable) {
        return next({
            status: 404,
            message: `Table ${table_id} doesn't exist`
        })
    }
    res.locals.table = foundTable
    next()
}

//takes request obj and next function, creates array of errors. if the array > 0, return next with a status of 400 and message of the errors.
// If < 0, returns next 
function createValidation(req, res, next) {
    const errors = []
    if (nameisValid(req)) errors.push(nameisValid(req))
    if (capacityisValid(req)) errors.push(capacityisValid(req))

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

// END OF VALIDATIONS

//LIST
async function list(req, res) {
    const tables = await service.list()
    res.json({data:await service.list()})
}

//CREATE
async function create(req, res) {
    res.status(201).json({data: await service.create(req.body.data)})
}

//SEAT TABLE
async function seatTable(req, res) {
    const {reservation_id} = res.locals.reservation
    const {table_id} = res.locals.table
    res.json({data: await service.seatTable(reservation_id, table_id)})
}

// OPEN TABLE
async function openTable(req, res) {
    const {table_id, reservation_id} = res.locals.table
    res.json({data: await service.openTable(reservation_id, table_id)})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasOnlyValidProps,
        hasRequiredProperties,
        createValidation,
        asyncErrorBoundary(create)
    ],
    seatTable: [
        hasOnlyValidProps,
        asyncErrorBoundary(reservationExists),
        canBeSeat,
        asyncErrorBoundary(tableExists),
        tableIsAvailable,
        tableCanSeat,
        asyncErrorBoundary(seatTable)
    ],
    openTable: [
        asyncErrorBoundary(tableExists),
        tableIsOccupied,
        asyncErrorBoundary(openTable)
    ]
}