const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const questionJson = require('./questions.json')

module.exports = router

router.get('/intro', (req, res) => {
  res.render('intro', {title: 'intro'})
})

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'signup'})
})

router.post('/createUser', (req, res) => {
  const newUser = {
    userId: (+new Date()).toString(36),
    name: req.body.name,
    date: Date(),
    score: 0,
    done: false
  }
  const jsonPath = path.join(__dirname, 'leaderboard.json')
  fs.readFile(jsonPath, (err, leaderBoardData) => {
    if (err) {
      console.log('error')
    }

    let leaderBoardJson = JSON.parse(leaderBoardData)
    console.log(newUser)
    leaderBoardJson.leaderBoard.push(newUser)
    const updatedJson = JSON.stringify(leaderBoardJson, null, 4)
    fs.writeFile(path.join(__dirname, 'leaderboard.json'), updatedJson, (err) => {
      if (err) return res.status(500).send('500 error unable to write leaderboard')
      displayQuestion(req, res, newUser.userId, 1)
    })
  })
})

/*   getLeaderboard((err, leaderboardJson) => {
    if (err) return res.status(500).send('500 error unable to read leaderboard')
    const updatedLeaderboard = JSON.stringify(leaderboardJson.leaderBoard.push(newUser))
    fs.writeFile(path.join(__dirname, 'leaderboard.json'), updatedLeaderboard, (err) => {
      if (err) return res.status(500).send('500 error unable to write leaderboard')
      displayQuestion(req, res, newUser.userId, 1)
    }
      // new function to create a user to place in the leaderboard json. Returns an error and a user object
      // if error, redirect to signup (wishlist show error)
      // if user not null then call the displayquestion function
    )
  })
})

function getLeaderboard (callback) {
  const jsonPath = path.join(__dirname, 'leaderboard.json')
  fs.readFile(jsonPath, (err, leaderboardData) => {
    if (err) {
      callback(err, null)
    }
    const leaderboardJson = JSON.parse(leaderboardData)
    callback(null, leaderboardJson)
  })
} */

function displayQuestion (req, res, userId, questionId) {
  // function to grab the question object for given questionID from questions.json and set to viewData
  const ourQuestion = questionJson.questions.find(x => x.questionId === parseInt(questionId))
  const viewData = {
    title: 'Question ' + questionId,
    userId: userId,
    question: ourQuestion
  }
  res.render('question', viewData)
  // render viewData to question.hbs
}

// submit question
router.post('/submitAnswer', (req, res) => {
  const selection = req.body.selection
  const correct = req.body.answer
  const userId = req.body.userId
  const userId2 = req.body.userId
  const questionId = req.body.questionId
  console.log(questionId)
  let nextQuestion = parseInt(questionId)
  nextQuestion++
  console.log(nextQuestion)
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
  console.log(count, nextQuestion)
  if (nextQuestion <= count) {
    displayQuestion(req, res, userId2, nextQuestion)
  } else {
    res.redirect('/leaderboard')
}
})
// displayQuestion(req, res, userId, nextQuestion++)
router.get('/leaderboard', (req, res) => {
  res.send('leaderboard')
})
