import * as React from 'react';
import { QuizState, QuizAction, SondageState, SondageAction, QuizQuestion, QuizAnswer, SondageAnswer } from '../types';

interface QuizContextType {
  quizState: QuizState;
  sondageState: SondageState;
  quizDispatch: React.Dispatch<QuizAction>;
  sondageDispatch: React.Dispatch<SondageAction>;
  questions: QuizQuestion[];
  setQuestions: (questions: QuizQuestion[]) => void;
}

const QuizContext = React.createContext<QuizContextType | undefined>(undefined);

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        isCompleted: false,
        startTime: new Date()
      };

    case 'ANSWER_QUESTION':
      const existingAnswerIndex = state.answers.findIndex(
        answer => answer.questionId === action.payload.questionId
      );

      let newAnswers: QuizAnswer[];
      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.answers];
        newAnswers[existingAnswerIndex] = action.payload;
      } else {
        newAnswers = [...state.answers, action.payload];
      }

      return {
        ...state,
        answers: newAnswers
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };

    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isCompleted: true,
        endTime: new Date()
      };

    case 'RESET_QUIZ':
      return {
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        isCompleted: false,
        startTime: new Date()
      };

    default:
      return state;
  }
};

const sondageReducer = (state: SondageState, action: SondageAction): SondageState => {
  switch (action.type) {
    case 'START_SONDAGE':
      return {
        answers: [],
        isCompleted: false,
        startTime: new Date()
      };

    case 'ANSWER_QUESTION':
      const existingAnswerIndex = state.answers.findIndex(
        answer => answer.questionId === action.payload.questionId
      );

      let newAnswers: SondageAnswer[];
      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.answers];
        newAnswers[existingAnswerIndex] = action.payload;
      } else {
        newAnswers = [...state.answers, action.payload];
      }

      return {
        ...state,
        answers: newAnswers
      };

    case 'COMPLETE_SONDAGE':
      return {
        ...state,
        isCompleted: true,
        endTime: new Date()
      };

    case 'RESET_SONDAGE':
      return {
        answers: [],
        isCompleted: false,
        startTime: new Date()
      };

    default:
      return state;
  }
};

interface QuizProviderProps {
  children: React.ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const initialQuizState: QuizState = {
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    isCompleted: false,
    startTime: new Date()
  };

  const initialSondageState: SondageState = {
    answers: [],
    isCompleted: false,
    startTime: new Date()
  };

  const [quizState, quizDispatch] = React.useReducer(quizReducer, initialQuizState);
  const [sondageState, sondageDispatch] = React.useReducer(sondageReducer, initialSondageState);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);

  const contextValue = React.useMemo(
    () => ({
      quizState,
      sondageState,
      quizDispatch,
      sondageDispatch,
      questions,
      setQuestions
    }),
    [quizState, sondageState, questions]
  );

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = (): QuizContextType => {
  const context = React.useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

// Custom hooks for quiz operations
export const useQuiz = () => {
  const { quizState, quizDispatch, questions } = useQuizContext();

  const startQuiz = React.useCallback(() => {
    quizDispatch({ type: 'START_QUIZ' });
  }, [quizDispatch]);

  const answerQuestion = React.useCallback((answer: QuizAnswer) => {
    quizDispatch({ type: 'ANSWER_QUESTION', payload: answer });
  }, [quizDispatch]);

  const nextQuestion = React.useCallback(() => {
    quizDispatch({ type: 'NEXT_QUESTION' });
  }, [quizDispatch]);

  const completeQuiz = React.useCallback(() => {
    quizDispatch({ type: 'COMPLETE_QUIZ' });
  }, [quizDispatch]);

  const resetQuiz = React.useCallback(() => {
    quizDispatch({ type: 'RESET_QUIZ' });
  }, [quizDispatch]);

  const getCurrentQuestion = React.useCallback(() => {
    return questions[quizState.currentQuestionIndex] || null;
  }, [questions, quizState.currentQuestionIndex]);

  const getProgress = React.useCallback(() => {
    return {
      current: quizState.currentQuestionIndex + 1,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round(((quizState.currentQuestionIndex + 1) / questions.length) * 100) : 0
    };
  }, [quizState.currentQuestionIndex, questions.length]);

  const hasAnswered = React.useCallback((questionId: number) => {
    return quizState.answers.some(answer => answer.questionId === questionId);
  }, [quizState.answers]);

  const getAnswer = React.useCallback((questionId: number) => {
    return quizState.answers.find(answer => answer.questionId === questionId);
  }, [quizState.answers]);

  const canProceed = React.useCallback(() => {
    const currentQuestion = getCurrentQuestion();
    return currentQuestion ? hasAnswered(currentQuestion.Id) : false;
  }, [getCurrentQuestion, hasAnswered]);

  const isLastQuestion = React.useCallback(() => {
    return quizState.currentQuestionIndex >= questions.length - 1;
  }, [quizState.currentQuestionIndex, questions.length]);

  return {
    quizState,
    startQuiz,
    answerQuestion,
    nextQuestion,
    completeQuiz,
    resetQuiz,
    getCurrentQuestion,
    getProgress,
    hasAnswered,
    getAnswer,
    canProceed,
    isLastQuestion
  };
};

export const useSondage = () => {
  const { sondageState, sondageDispatch } = useQuizContext();

  const startSondage = React.useCallback(() => {
    sondageDispatch({ type: 'START_SONDAGE' });
  }, [sondageDispatch]);

  const answerQuestion = React.useCallback((answer: SondageAnswer) => {
    sondageDispatch({ type: 'ANSWER_QUESTION', payload: answer });
  }, [sondageDispatch]);

  const completeSondage = React.useCallback(() => {
    sondageDispatch({ type: 'COMPLETE_SONDAGE' });
  }, [sondageDispatch]);

  const resetSondage = React.useCallback(() => {
    sondageDispatch({ type: 'RESET_SONDAGE' });
  }, [sondageDispatch]);

  const getAnswer = React.useCallback((questionId: number) => {
    return sondageState.answers.find(answer => answer.questionId === questionId);
  }, [sondageState.answers]);

  const hasAnswered = React.useCallback((questionId: number) => {
    const answer = getAnswer(questionId);
    return answer && answer.answer !== '' && answer.answer !== null && answer.answer !== undefined;
  }, [getAnswer]);

  const getProgress = React.useCallback(() => {
    const totalQuestions = 6; // Fixed number of sondage questions
    const answeredQuestions = sondageState.answers.filter(answer =>
      answer.answer !== '' && answer.answer !== null && answer.answer !== undefined
    ).length;

    return {
      current: answeredQuestions,
      total: totalQuestions,
      percentage: Math.round((answeredQuestions / totalQuestions) * 100)
    };
  }, [sondageState.answers]);

  const canComplete = React.useCallback(() => {
    return sondageState.answers.length >= 6 &&
           sondageState.answers.every(answer =>
             answer.answer !== '' && answer.answer !== null && answer.answer !== undefined
           );
  }, [sondageState.answers]);

  return {
    sondageState,
    startSondage,
    answerQuestion,
    completeSondage,
    resetSondage,
    getAnswer,
    hasAnswered,
    getProgress,
    canComplete
  };
};