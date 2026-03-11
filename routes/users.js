var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users')

// get all users (not deleted)
router.get('/', async function(req, res, next) {
  let users = await userModel.find({ isDeleted: false }).populate('role')
  res.send(users)
})

// get user by id
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id
    let user = await userModel.findById(id).populate('role')
    if (!user || user.isDeleted) return res.status(404).send({ message: 'ID NOT FOUND' })
    res.send(user)
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' })
  }
})

// create user
router.post('/', async function(req, res, next) {
  try {
    let payload = req.body
    let created = await userModel.create(payload)
    res.status(201).send(created)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

// soft delete user
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id
    let u = await userModel.findById(id)
    if (!u || u.isDeleted) return res.status(404).send({ message: 'ID NOT FOUND' })
    u.isDeleted = true
    await u.save()
    res.send({ message: 'DELETED' })
  } catch (error) {
    res.status(404).send({ message: 'ID NOT FOUND' })
  }
})

// enable user: set status true if email and username match
router.post('/enable', async function(req, res, next) {
  try {
    let { email, username } = req.body
    if (!email || !username) return res.status(400).send({ message: 'email and username required' })
    let u = await userModel.findOne({ email, username, isDeleted: false })
    if (!u) return res.status(404).send({ message: 'USER NOT FOUND' })
    u.status = true
    await u.save()
    res.send({ message: 'ENABLED' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

// disable user: set status false if email and username match
router.post('/disable', async function(req, res, next) {
  try {
    let { email, username } = req.body
    if (!email || !username) return res.status(400).send({ message: 'email and username required' })
    let u = await userModel.findOne({ email, username, isDeleted: false })
    if (!u) return res.status(404).send({ message: 'USER NOT FOUND' })
    u.status = false
    await u.save()
    res.send({ message: 'DISABLED' })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

module.exports = router;
