const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const questionJson = require('./questions.json')

module.exports = router

router.get('/', (req, res) => {
  res.redirect('/intro')
})

router.get('/intro', (req, res) => {
  res.render('intro', {title: 'intro'})
})

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'signup'})
})

// this route takes in the the form post data from /signup
router.post('/createUser', (req, res) => {
  //create a new user object from the post data
  const newUser = {
    userId: (+new Date()).toString(36), // this generates a unique id for our user using the current time and converting to base 36
    name: req.body.name, // the users name from the post data
    date: Date(), // current date (and time)
    score: 0, // default score of 0
    done: false // We didn't end up using this but it would have meant that only completed quizes would show on the leaderboard.
  }

  // read in the leaderboard json
  const jsonPath = path.join(__dirname, 'leaderboard.json')
  fs.readFile(jsonPath, (err, leaderBoardData) => {
    if (err) {
      console.log('error') // we should have used a proper error handler here (like on line 42)
    }
    let leaderBoardJson = JSON.parse(leaderBoardData) // convert the leaderboard json file/string to a javascript object
    leaderBoardJson.leaderBoard.push(newUser) // add the new user we created to the object
    const updatedJson = JSON.stringify(leaderBoardJson, null, 4) // convert the javascript object back to a json string

    //write the  json string back to disk
    fs.writeFile(path.join(__dirname, 'leaderboard.json'), updatedJson, (err) => {
      if (err) return res.status(500).send('500 error unable to write leaderboard')
      displayQuestion(req, res, newUser.userId, 1) // once we have written to disk, pass in the user id and 1 to the  displayQuestion function to render the first question
    })
  })
})

// we could have had this code in the /createUser route but then we would have to duplicate in in the submitAnswer route
function displayQuestion (req, res, userId, questionId) {
  const ourQuestion = questionJson.questions.find(x => x.questionId === parseInt(questionId)) // find the current question from the questions json (we import this file in rather than reading from disk - this file is not changing often)
  //create a viewData object to render multiple things to the view
  const viewData = {
    title: 'Question ' + questionId,
    userId: userId, // pass in the user id so we can update their score later
    question: ourQuestion // pass in the whole question object to the view
  }
  res.render('question', viewData)
}

// submit question
router.post('/submitAnswer', (req, res) => {
  const selection = req.body.selection
  const correct = req.body.answer
  const userId = req.body.userId
  //const userId2 = req.body.userId
  const questionId = req.body.questionId
  let nextQuestion = parseInt(questionId)
  nextQuestion++
  if (selection === correct) {
    const jsonPath = path.join(__dirname, 'leaderboard.json')
    fs.readFile(jsonPath, (err, leaderBoardData) => {
      if (err) {
        console.log('error')
      }
      let leaderBoardJson = JSON.parse(leaderBoardData)
      const idx = leaderBoardJson.leaderBoard.findIndex(x => x.userId === userId)
      leaderBoardJson.leaderBoard[idx].score++
      const updatedJson = JSON.stringify(leaderBoardJson, null, 4)
      fs.writeFile(path.join(__dirname, 'leaderboard.json'), updatedJson, (err) => {
        if (err) return res.status(500).send('500 error unable to write leaderboard')
      })
    })
  }
  const count = questionJson.questions.length
  if (nextQuestion <= count) {
    displayQuestion(req, res, userId, nextQuestion)
  } else {
    res.redirect('/leaderboard')
}
})
// displayQuestion(req, res, userId, nextQuestion++)
router.get('/leaderboard', (req, res) => {
  const jsonPath = path.join(__dirname, 'leaderboard.json')
  fs.readFile(jsonPath, (err, leaderBoardData) => {
    if (err) {
      console.log('error')
    }
    let leaderBoardJson = JSON.parse(leaderBoardData)
    let sortedBoard = leaderBoardJson.leaderBoard.sort((a, b) => { return b.score - a.score })
    res.render('leaderboard', {sortedBoard})
  })
})
