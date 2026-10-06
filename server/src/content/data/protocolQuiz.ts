import type { QuizQuestion } from "@interpreting-practice/shared";

/** Protocol scenarios. Every rule here is backed by the sources listed in the client's Game plan view. */
export const protocolQuiz: QuizQuestion[] = [
  {
    question:
      'The provider says: "Tell her she needs to fast after midnight." What do you say to the patient?',
    options: [
      "Dice el doctor que necesita ayunar después de la medianoche.",
      "Necesita ayunar después de la medianoche.",
      "Él quiere que usted no coma después de la medianoche.",
    ],
    answerIndex: 1,
    explanation:
      "Interpret in the first person, as if you were the speaker. If a party speaks in the third person, you still render it in the first person.",
  },
  {
    question:
      'The patient says a dosage number and you aren\'t sure you heard "quince" or "cincuenta". What now?',
    options: [
      "Pick the one that fits the context.",
      "Say both numbers so the provider decides.",
      "Identify yourself as the interpreter, ask for a repeat, then tell the other party what you asked.",
    ],
    answerIndex: 2,
    explanation:
      "Numbers get verified, never guessed. When you intervene, you speak as the interpreter and keep both parties informed of what you asked.",
  },
  {
    question:
      'The provider says: "Honestly, this is bad news, I won\'t sugarcoat it." How do you render the tone?',
    options: [
      "Keep it blunt.",
      "Soften it, the patient is scared.",
      "Skip the first part and give the news.",
    ],
    answerIndex: 0,
    explanation:
      "Register is scored. A blunt speaker stays blunt. Softening is a register shift and skipping is an omission.",
  },
  {
    question:
      'The patient adds: "Ay, I already told the other nurse all this, but anyway…" before answering.',
    options: [
      "Leave that part out, it's filler.",
      "Render it too.",
      'Summarize it as "She already said this."',
    ],
    answerIndex: 1,
    explanation:
      "Completeness counts the whole utterance, hedges and asides included. Leaving it out is an omission; summarizing switches to third person.",
  },
  {
    question: "While the provider steps out, the patient asks your personal opinion about the surgery.",
    options: [
      "Give a short, kind opinion.",
      "Politely say you can't engage in side conversations and that you'll interpret anything they want to ask the provider.",
      "Stay silent.",
    ],
    answerIndex: 1,
    explanation: "No side conversations. You stay in the interpreter role and keep the session transparent.",
  },
  {
    question:
      "The provider gives you a long, three-part instruction without pausing and you can't hold it all.",
    options: [
      "Interpret what you remember.",
      "Ask, as the interpreter, for shorter segments or a repeat.",
      "Guess the missing part from context.",
    ],
    answerIndex: 1,
    explanation:
      "Session management exists so you don't receive more than you can retain. Asking for a repeat beats an omission or a guess.",
  },
  {
    question: 'You render "take it today, not tomorrow" as "tómelo pronto". What went wrong?',
    options: [
      "Nothing, the meaning is close.",
      "A distortion: the time detail changed.",
      "A register shift.",
    ],
    answerIndex: 1,
    explanation:
      "Times, numbers, negations, names and dosages that change on the way through count as distortions.",
  },
  {
    question: "How does a session start?",
    options: [
      "The interpreter gives their name and interpreter ID.",
      "The provider introduces the patient first.",
      "The interpreter asks the patient's name.",
    ],
    answerIndex: 0,
    explanation:
      "Clients are asked to let the interpreter open the session with their name and interpreter ID. Use your exact script in the Scripts drill.",
  },
];
