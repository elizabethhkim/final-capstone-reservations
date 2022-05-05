const knex = require("../db/connection")
const reduceProperties = require("../utils/reduce-properties")

const addReservation = reduceProperties("table_id", {
    first_name: ["reservation", null, "first_name"],
    last_name: ["reservation", null, "last_name"],
    people: ["reservation", null, "people"],    
})

function list() {
    return knex("tables as tn")
        .leftJoin("reservations as res", "tn.reservation_id")
        .select(
            "tn.*",
            "res.first_name",
            "res.last_name",
            "res.people"
        )
        .then(addReservation)
        .then((tables) => {
            return tables.map((table) => {
                return {
                    ...table,
                    reservation: table.reservation[0]
                }
            })
        }).then(tables => {
            return tables.sort((a, b) => a.table_name.toLowerCase() < b.table_name.toLowerCase() ? -1 : 1)
        })
}

function read(table_id) {
    return knex("tables").select("*").where({table_id}).first()
}

function create(table) {
    return knex("tables")
        .insert(table, "*")
        .then((newTable) => newTable[0])
}

function seatTable(reservation_id, table_id) {
    return knex("restaurants") 
        .where({reservation_id})
        .update({status: "seated"})
        .then(() => {
            return knex("tables")
                .where({table_id})
                .update({reservation_id})
                .returning("*")
        })
}

function openTable(reservation_id, table_id) {
    return knex("restaurants")
        .where({reservation_id})
        .update({status: "finished"})
        .returning("*")
        .then(() => {
            return knex("tables")
                .where({table_id})
                .update({reservation_id: null})
                .returning("*")
        })
}

module.exports = {
    list,
    read,
    create,
    seatTable,
    openTable,
  }