import { Question } from '../models/Question.js';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions.js';
import { logger } from './logger.js';

export async function seedQuestions() {
  const count = await Question.countDocuments();
  if (count > 0) return;

  await Question.insertMany(DEFAULT_QUESTIONS);
  logger.info(`Seeded ${DEFAULT_QUESTIONS.length} interview questions`);
}
