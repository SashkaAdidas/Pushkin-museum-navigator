import { useState } from 'react';
import { isCodeForHall, useGame } from '../game/store.jsx';

export default function CheckpointForm({ hall }) {
  const { state, visitHall } = useGame();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const visited = Boolean(state.visited[hall.id]);

  if (visited) {
    return (
      <div className="checkpoint checkpoint--done">
        <p className="checkpoint__title">Зал закрыт</p>
        <p className="checkpoint__text">
          Код {hall.checkpoint} принят{' '}
          {new Date(state.visited[hall.id]).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
          . Открытка с репродукцией добавлена в коллекцию.
        </p>
      </div>
    );
  }

  function submit(event) {
    event.preventDefault();
    if (!code.trim()) {
      setError('Введите код с таблички в зале');
      return;
    }
    if (isCodeForHall(code, hall.id)) {
      setError('');
      setCode('');
      visitHall(hall.id);
    } else {
      setError('Такого кода нет. Проверьте цифры на табличке у входа в зал');
    }
  }

  return (
    <form className="checkpoint" onSubmit={submit}>
      <label className="checkpoint__label" htmlFor="checkpoint-code">
        Код с таблички в зале
      </label>
      <div className="checkpoint__row">
        <input
          id="checkpoint-code"
          className="input input--code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError('');
          }}
          placeholder="НАПРИМЕР: GREEK-05"
          autoComplete="off"
          spellCheck="false"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'checkpoint-error' : undefined}
        />
        <button className="btn btn--primary" type="submit">
          Закрыть зал
        </button>
      </div>
      {error ? (
        <p className="checkpoint__error" id="checkpoint-error">
          {error}
        </p>
      ) : (
        <p className="checkpoint__hint">
          В демо-режиме код виден заранее: <b>{hall.checkpoint}</b>
        </p>
      )}
    </form>
  );
}
