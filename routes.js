const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

module.exports = router

router.get('/intro', (req, res) => {
  res.send('intro')
})

router.get('/signup', (req, res) => {
  res.send('signup')
})
router.post('/createUser', (req, res) => {
  res.send('createUser')
})

// display question
router.post('/displayQuestion', (req, res) => {
  res.send('display question')
})

// submit question
router.post('/submitAnswer', (req, res) => {
  res.send('leaderboard')
})

router.get('/leaderboard', (req, res) => {
  res.send('leaderboard')
})
