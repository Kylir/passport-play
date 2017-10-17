'use strict'

exports.findUserByName = (name, users) => {
  return users.find( (u) => {return (u.username === name)} )
}

exports.findUserById = (id, users) => {
  return users.find( (u) => {return (u.id === id)} )
}
