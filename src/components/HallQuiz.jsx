import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUIZ_BY_HALL } from '../data/quiz.js';
import { XP_RULES } from '../data/game.js';
import { useGame } from '../game/store.jsx';

export default function HallQuiz({ hall }) {
  const { state, answerQuiz } = useGame();
  const [picked, setPicked] = useState(null);
  const [usedHint, setUsedHint] = useState(false);

  const questions = QUIZ_BY_HALL(hall.id);
  if (!questions.length) {
    return (
      <p className="quiz quiz--empty">
        Вопросов по этому залу пока нет — <Link to="/quiz">сыграйте в общую викторину</Link>.
      </p>
    );
  }

  const question = questions[0];
  const record = state.quiz[question.id];
  const answered = Boolean(record);
  const chosen = answered ? record.choice : picked;

  function choose(index) {
    if (answered) return;
    setPicked(index);
    answerQuiz(question.id, index === question.answer, usedHint, index);
  }

  const gain = question.answer === chosen ? XP_RULES.QUIZ_CORRECT - (usedHint ? XP_RULES.QUIZ_HINT_COST : 0) : 0;

  return (
    <div className={`quiz${answered ? ' quiz--done' : ''}`}>
      <p className="quiz__kicker">Вопрос по залу · +{XP_RULES.QUIZ_CORRECT} XP</p>
      <p className="quiz__question">{question.question}</p>

      <div className="quiz__options">
        {question.options.map((option, index) => {
          const classes = ['quiz__option'];
          if (answered) {
            if (index === question.answer) classes.push('is-correct');
            else if (index === chosen) classes.push('is-wrong');
            classes.push('is-locked');
          }
          return (
            <button
              key={option}
              type="button"
              className={classes.join(' ')}
              onClick={() => choose(index)}
              disabled={answered}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered ? (
        <p className={`quiz__result${record.correct ? ' is-ok' : ' is-bad'}`}>
          {record.correct
            ? `Верно${gain ? `, +${gain} XP` : ''}`
            : `Неверно. Правильный ответ: «${question.options[question.answer]}»`}
        </p>
      ) : usedHint ? (
        <p className="quiz__hint">
          Подсказка: {question.hint} (−{XP_RULES.QUIZ_HINT_COST} XP)
        </p>
      ) : (
        <button type="button" className="btn btn--ghost" onClick={() => setUsedHint(true)}>
          Подсказка за −{XP_RULES.QUIZ_HINT_COST} XP
        </button>
      )}
    </div>
  );
}
