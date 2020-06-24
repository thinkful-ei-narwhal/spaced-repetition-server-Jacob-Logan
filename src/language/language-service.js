const LinkedList = require('../LinkedList/LinkedList')
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
      .from('word')
      .join('language', 'word.id', '=', 'language.head')
      .select(
        'word.original as nextWord',
        'word.correct_count as wordCorrectCount',
        'word.incorrect_count as wordIncorrectCount',
        'language.total_score as totalScore'
      )
      .where(function () {
        this.where('language.id', language_id)
      })
  },

  updateHead(db, next, id) {
    return db
      .from('language')
      .update({ head: next })
      .where({ id })
  },

  updateWord(db, nextWord, wordId) {
    return db
      .from('word')
      .where({ id: wordId })
      .update({ next: nextWord })
  },
  getUpdatedList(db) {
    return db
      .from('word')
      .join('language', 'word.id', '=', 'language.head')
      .select(
        'word.translation as answer',
        'word.original as original',
        'language.total_score as totalScore',
        'word.correct_count as wordCorrectCount',
        'word.incorrect_count as wordIncorrectCount',
      )
  },
  populateLinkedList(language, words) {
    const ll = new LinkedList();
    ll.id = language.id;
    ll.name = language.name;
    ll.total_score = language.total_score;
    // console.log('LangHead:', language.head);
    let word = words.find(w => w.id === language.head)
    ll.insertFirst({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    })
    while (word.next) {
      word = words.find(w => w.id === word.next)
      ll.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }
    // console.log(JSON.stringify(ll,null,2));
    return ll
  },
  //TODO: it is creating a undefined node which is stopping the inserts

  // insertNewLinkedList(db, ll) {
  //   const langId = ll.id
  //   // console.log('linkedlist', ll.printAllNodes())
  //   return db
  //     .from('word')
  //     .where('language_id', langId)
  //     // .del()
  //     .then((data) => {
  //       // console.log('linkedlist', ll)

  //       let newfieldsToInsert = data.map(node => {
  //         // console.log("node", node)
  //         return ({
  //           original: node.value.original,
  //           translation: node.value.translation,
  //           memory_value: node.value.memory_value,
  //           correct_count: node.value.correct_count,
  //           incorrect_count: node.value.incorrect_count,
  //           language_id: langId,
  //           next: node.next.value.id
  //         })
  //       })

  //       console.log(newfieldsToInsert)
  //       return db.insert(newfieldsToInsert).into('word')
  //     })
  // }
  updateDB(db, ll) {
    // return ll.listNodes()
    const langId = ll.id

    let updated = ll.listNodes().map(node => {
      let next;
      if (node.next === null) {
        next = null;
      }
      else {
        next = node.next.value.id;
      }
      return ({
        original: node.value.original,
        translation: node.value.translation,
        memory_value: node.value.memory_value,
        correct_count: node.value.correct_count,
        incorrect_count: node.value.incorrect_count,
        language_id: langId,
        next: next
      })
    })
    console.log('updated', updated)
    //take each index in order and update each column wiht the new values
    return db
      .into('word')
      .where('language_id', langId)
      .update(updated)
  }
}

module.exports = LanguageService
