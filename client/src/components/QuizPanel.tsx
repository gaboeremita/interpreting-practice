import type { QuizQuestion } from "@isa-drill-room/shared";
import { useState } from "react";
import { classNames } from "../lib/classNames";
import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Panel } from "./ui/Panel";

export function QuizPanel({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const question = questions[index];

  function restart() {
    setIndex(0);
    setCorrectCount(0);
    setChosen(null);
  }

  function next() {
    if (question && chosen === question.answerIndex) {
      setCorrectCount(correctCount + 1);
    }
    setChosen(null);
    setIndex(index + 1);
  }

  if (!question) {
    return (
      <Panel title={`${correctCount} / ${questions.length}`}>
        <p>
          {correctCount === questions.length
            ? "Perfect protocol run."
            : "Run it again until it's boring. Boring means automatic."}
        </p>
        <div>
          <Button variant="primary" onClick={restart}>
            Again
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <Eyebrow>
        Scenario {index + 1} of {questions.length}
      </Eyebrow>
      <h3 className="text-xl font-bold font-stretch-semi-condensed">{question.question}</h3>
      <div className="grid gap-1.5">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answerIndex;
          return (
            <Button
              key={option}
              disabled={chosen !== null}
              onClick={() => setChosen(optionIndex)}
              className={classNames(
                "w-full text-left disabled:opacity-100",
                chosen !== null && isAnswer && "border-transparent bg-good-bg text-good",
                chosen === optionIndex && !isAnswer && "border-transparent bg-bad-bg text-bad",
              )}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <p>{question.explanation}</p>
          <div>
            <Button variant="primary" onClick={next}>
              Next
            </Button>
          </div>
        </>
      )}
    </Panel>
  );
}
