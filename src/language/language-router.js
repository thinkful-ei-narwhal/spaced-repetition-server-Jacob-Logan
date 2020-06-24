const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const languageRouter = express.Router()
const LinkedList = require('../LinkedList/LinkedList')
const { get } = require('../auth/auth-router')
languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const words = await LanguageService.getHeadOfList(req.app.get('db'), req.language.id)
      res.send(words[0])
    }
    catch (err) {
      next(err)
    }
  })

languageRouter
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {

    for (const [key, value] of Object.entries(req.body)) {
      console.log('value', value)
      if (value === null) {
        return res.status(400).json({ error: `Missing 'guess' in request body` })
      }
    }
    try {
      const words = await LanguageService.getLanguageWords(req.app.get('db'), req.language.id)
      //find the word with the id equivelant to the head
      const ll = LanguageService.populateLinkedList(req.language, words)
      //if guess is incorrect
      let isCorrect
      const node = ll.head;
      const answer = node.value.translation
      const guess = req.body.guess
      console.log('guess', req.body.guess, answer)
      if (guess === answer) {
        isCorrect = true
        ll.head.value.memory_value = Number(node.value.memory_value) * 2
        ll.head.value.correct_count = Number(ll.head.value.correct_count) + 1
        ll.total_score = Number(ll.total_score) + 1
      } else {
        isCorrect = false
        ll.head.value.memory_value = 1
        ll.head.value.incorrect_count = Number(ll.head.value.incorrect_count) + 1
      }
      ll.moveHeadBy(ll.head.value.memory_value)
      await LanguageService.insertNewLinkedList(
        req.app.get('db'),
        ll,
      )
      res.json({
        nextWord: ll.head.value.original,
        wordCorrectCount: ll.head.value.correct_count,
        wordIncorrectCount: ll.head.value.incorrect_count,
        totalScore: ll.total_score,
        answer,
        isCorrect,
      })
      }
      //then listNodes and insert the values back into the database 
     

    catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
