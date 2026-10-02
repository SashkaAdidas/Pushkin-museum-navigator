import { useState } from 'react';
import { QUIZ } from '../data/quiz.js';
import { HALLS_BY_ID } from '../data/halls.js';
import { XP_RULES } from '../data/game.js';
import { Pill, SectionTitle } from '../components/ui.jsx';
import { useGame } from '../game/store.jsx';

export default function QuizPage() {
  const { state, answerQuiz } = useGame();
  const [hallFilter, setHallFilter] = useState('all');
  const [picked, setPicked] = useState({});

  const uniqueHalls = [...new Set(QUIZ.map((q) => HALLS_BY_ID.get(q.hallId)).filter(Boolean))];

  const questions = hallFilter === 'all' ? QUIZ : QUIZ.filter((q) => q.hallId === hallFilter);

  function choose(qid, index) {
    if (state.quiz[qid]) return;
    const q = QUIZ.find((x) => x.id === qid);
    setPicked((p) => ({ ...p, [qid]: index }));
    answerQuiz(qid, index === q.answer, false, index);
  }

  return (
    <>
      <SectionTitle kicker={`${questions.length} вопросов`} title="Викторина" />

      <div className="card filters">
        <div className="segmented" role="group" aria-label="По залам">
          <button
            className={`segmented__btn${hallFilter === 'all' ? ' is-active' : ''}`}
            onClick={() => setHallFilter('all')}
          >
            Все залы
          </button>
          {uniqueHalls.map((h) => (
            <button
              key={h.id}
              className={`segmented__btn${hallFilter === h.id ? ' is-active' : ''}`}
              onClick={() => setHallFilter(h.id)}
            >
              {h.short}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-list">
        {questions.map((q) => {
          const record = state.quiz[q.id];
          const answered = Boolean(record);
          const chosen = record ? record.choice : picked[q.id];

          return (
            <div key={q.id} className={`card quiz-item${answered ? ' quiz-item--done' : ''}`}>
              <div className="quiz-item__head">
                <Pill tone="gold">{HALLS_BY_ID.get(q.hallId)?.name}</Pill>
                {answered ? (
                  <Pill tone={record.correct ? 'green' : 'red'}>
                    {record.correct ? 'Верно +15 XP' : 'Неверно'}
                  </Pill>
                ) : (
                  <Pill tone="neutral">+{XP_RULES.QUIZ_CORRECT} XP</Pill>
                )}
              </div>
              <p className="quiz-item__question">{q.question}</p>
              <div className="quiz-item__options">
                {q.options.map((opt, i) => {
                  const classes = ['quiz-item__opt'];
                  if (answered) {
                    if (i === q.answer) classes.push('is-correct');
                    else if (i === chosen) classes.push('is-wrong');
                    classes.push('is-locked');
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={classes.join(' ')}
                      onClick={() => choose(q.id, i)}
                      disabled={answered}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && record.correct && (
                <p className="quiz-item__result is-ok">
                  +{XP_RULES.QUIZ_CORRECT} XP · Отличная память!
                </p>
              )}
              {answered && !record.correct && (
                <p className="quiz-item__result is-bad">
                  Правильный ответ: «{q.options[q.answer]}»
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
