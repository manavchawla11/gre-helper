import Stack from './contentstack';

export async function getWordOfTheDay(locale = 'en-us') {
  const res = await Stack.ContentType('word_of_the_day')
    .Query()
    .includeReference('word_ref')
    .language(locale)
    .toJSON()
    .find();

  const entry = res?.[0]?.[0];

  return entry;
}

export async function getVocabularyWords(difficulty = 'all', locale = 'en-us') {
  const query = Stack.ContentType('vocabulary_word').Query();
  query.limit(100);
  query.language(locale);
  console.log(difficulty);

  if (difficulty !== 'all') query.where('difficulty', difficulty);
  console.log(query.toJSON());
  const res = await query.toJSON().find();
  console.log('res', res);
  return res?.[0] ?? [];
}
