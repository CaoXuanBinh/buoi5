var express = require('express');
var router = express.Router();

let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')

// get all roles
router.get('/', async function(req, res, next) {
  let roles = await roleModel.find({ isDeleted: false })
  res.send(roles)
})

// get role by id
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id
    let r = await roleModel.findById(id)
    if (!r || r.isDeleted) return res.status(404).send({ message: 'ID NOT FOUND' })
    res.send(r)
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' })
  }
})

// create role
router.post('/', async function(req, res, next) {
  try {
    let payload = req.body
    let created = await roleModel.create(payload)
    res.status(201).send(created)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

// soft delete role
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id
    let r = await roleModel.findById(id)
    if (!r || r.isDeleted) return res.status(404).send({ message: 'ID NOT FOUND' })
    r.isDeleted = true
    await r.save()
    res.send({ message: 'DELETED' })
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' })
  }
})

// get users for role id: /roles/:id/users
router.get('/:id/users', async function(req, res, next) {
  try {
    let roleId = req.params.id
    let users = await userModel.find({ role: roleId, isDeleted: false }).populate('role')
    res.send(users)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

module.exports = router;
