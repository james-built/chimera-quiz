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
  // new function to create a user to place in the leaderboard json. Returns an error and a user object
  // if error, redirect to signup (wishlist show error)
  // if user not null then call the displayquestion function

})

function displayQuestion(req, res, userID, questionID) {
  // function to grab the question object for given questionID from questions.json and set to viewData
  viewData = {
    userId: userID,
    question: 1
  }
  //render viewData to question.hbs
}

// submit question
router.post('/submitAnswer', (req, res) => {
  // call a function to check the question is answered correctly. if yes update the leaderboard json for that user
  // check if there is a following qusetion
  // if yes, then call displayQuestion with the next questionID
  // if no, then call quizEnded which will call end game screen
})

router.get('/leaderboard', (req, res) => {
  res.send('leaderboard')
})
