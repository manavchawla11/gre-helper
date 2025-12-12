import Stack from './contentstack';

export async function getWordOfTheDay() {
  const res = await Stack.ContentType('word_of_the_day')
    .Query()
    .includeReference('word_ref')
    .toJSON()
    .find();

  const entry = res?.[0]?.[0];

  return entry;
}

export async function getVocabularyWords(difficulty = 'all') {
  const query = Stack.ContentType('vocabulary_word').Query();
  query.limit(100);
  console.log(difficulty);

  if (difficulty !== 'all') query.where('difficulty', difficulty);
  console.log(query.toJSON());
  const res = await query.toJSON().find();
  console.log('res', res);
  return res?.[0] ?? [];
}
