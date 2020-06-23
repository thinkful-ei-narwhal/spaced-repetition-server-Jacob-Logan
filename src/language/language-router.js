const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const languageRouter = express.Router()

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
    catch(err) {
      next(err)
    }

  })

languageRouter
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {

    try {

      const words = await LanguageService.getLanguageWords(req.app.get('db'), req.language.id)
      //const ll = new linkedList
      //
      //
      const updatedWordScore = await LanguageService.incrementCorrectCount(req.app.get('db'), req.body.id, req.body.binary)
      const updatedTotalScore = await LanguageService.incrementTotalScore(req.app.get('db'), req.language.id, req.body.binary)

      res.json({ updatedWordScore, updatedTotalScore })
    }
    catch(error) {
      next(error)
    }
  })

module.exports = languageRouter
