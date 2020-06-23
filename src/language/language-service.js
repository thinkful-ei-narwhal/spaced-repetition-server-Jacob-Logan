const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  incrementCorrectCount(db, id, binary) {
    if (binary === 1) {
      return db
        .from('word')
        .where({ id })
        .increment('correct_count', 1)
    }
    if (binary === 0) {
      return db
        .from('word')
        .where({ id })
        .increment('incorrect_count', 1)
    }
  },
  incrementTotalScore(db, id, binary) {
    if (binary === 1) {
      console.log('binary === 1')
      return db
        .from('language')
        .where({ id })
        .increment('total_score', 1)
    }
  },
  //increment M value funnction
  incrementMValue(db, id, binary) {
    //increment the M value of a word, 
    //if right M = M * 2
    //if wrong M = 1
  },
  getCurrentWord(db, language_id) {
    return db
      .from('word')
      .select('id', 'original', 'translation')
      .where({ language_id })
  },

  getHeadOfList(db, language_id) {
    return db
    //get next = 2 of language_id = 1
      // .from('word', 'language')
      // .select('word.correct_count', 'word.incorrect_count', 'language.total_score')
      // .where('next', 2)
      // .andWhere('language_id', language_id)
      .from('word')
      .join('language', 'word.correct_count', '=', 'language.total_score')
      .select(
        'word.original as nextWord',
        'word.correct_count as wordCorrectCount', 
        'word.incorrect_count as wordIncorrectCount',
        'language.total_score as totalScore'
        )
      .where(function() {
        this.where('next', 2).andWhere('language_id', language_id)
      })

  }

  // populatelinkedList(language, words) {
  //   const ll = new LinkedList
    
  // }
}

module.exports = LanguageService
