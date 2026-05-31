export default function QuestionDisplay({ question, questionIndex, totalQuestions }) {
  if (!question) return null;

  return (
    <div className="question-display">
      <span className="question-display__badge">
        Question {questionIndex + 1} of {totalQuestions}
      </span>
      <h2 className="question-display__text">{question.text}</h2>
      {question.category && (
        <span className="question-display__category">{question.category}</span>
      )}
    </div>
  );
}
