import { QuizQuestion, QuizAnswer, QuizResult } from '../types';

export class QuizService {
  static calculateScore(questions: QuizQuestion[], answers: QuizAnswer[]): number {
    let totalScore = 0;

    for (const answer of answers) {
      const question = questions.find(q => q.Id === answer.questionId);
      if (question && answer.answer === question.CorrectAnswer) {
        totalScore += question.Points;
      }
    }

    return totalScore;
  }

  static getMaxScore(questions: QuizQuestion[]): number {
    return questions.reduce((sum, question) => sum + question.Points, 0);
  }

  static getScorePercentage(score: number, maxScore: number): number {
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }

  static getCategoryScore(questions: QuizQuestion[], answers: QuizAnswer[], category: string): number {
    const categoryQuestions = questions.filter(q => q.Category === category);
    let categoryScore = 0;

    for (const answer of answers) {
      const question = categoryQuestions.find(q => q.Id === answer.questionId);
      if (question && answer.answer === question.CorrectAnswer) {
        categoryScore += question.Points;
      }
    }

    return categoryScore;
  }

  static getCategoryMaxScore(questions: QuizQuestion[], category: string): number {
    return questions
      .filter(q => q.Category === category)
      .reduce((sum, question) => sum + question.Points, 0);
  }

  static getPerformanceFeedback(score: number, maxScore: number): {
    level: 'excellent' | 'good' | 'average' | 'needs-improvement';
    message: string;
    color: string;
  } {
    const percentage = this.getScorePercentage(score, maxScore);

    if (percentage >= 90) {
      return {
        level: 'excellent',
        message: 'Excellent ! Vous maîtrisez parfaitement les concepts de la démarche compétences.',
        color: '#107C10'
      };
    } else if (percentage >= 75) {
      return {
        level: 'good',
        message: 'Très bien ! Vous avez une bonne compréhension de la démarche compétences.',
        color: '#0078D4'
      };
    } else if (percentage >= 60) {
      return {
        level: 'average',
        message: 'Bien ! Continuez à vous informer sur la démarche compétences.',
        color: '#FF8C00'
      };
    } else {
      return {
        level: 'needs-improvement',
        message: 'Il serait bénéfique de revoir les concepts fondamentaux de la démarche compétences.',
        color: '#D13438'
      };
    }
  }

  static getDetailedResults(questions: QuizQuestion[], answers: QuizAnswer[]): {
    totalScore: number;
    maxScore: number;
    percentage: number;
    correctAnswers: number;
    totalQuestions: number;
    categoryResults: Array<{
      category: string;
      score: number;
      maxScore: number;
      percentage: number;
    }>;
    answersDetails: Array<{
      question: QuizQuestion;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      points: number;
    }>;
  } {
    const totalScore = this.calculateScore(questions, answers);
    const maxScore = this.getMaxScore(questions);
    const percentage = this.getScorePercentage(totalScore, maxScore);
    const correctAnswers = answers.filter(answer => {
      const question = questions.find(q => q.Id === answer.questionId);
      return question && answer.answer === question.CorrectAnswer;
    }).length;

    const categories = Array.from(new Set(questions.map(q => q.Category)));
    const categoryResults = categories.map(category => ({
      category,
      score: this.getCategoryScore(questions, answers, category),
      maxScore: this.getCategoryMaxScore(questions, category),
      percentage: this.getScorePercentage(
        this.getCategoryScore(questions, answers, category),
        this.getCategoryMaxScore(questions, category)
      )
    }));

    const answersDetails = answers.map(answer => {
      const question = questions.find(q => q.Id === answer.questionId)!;
      const isCorrect = answer.answer === question.CorrectAnswer;
      return {
        question,
        userAnswer: answer.answer,
        correctAnswer: question.CorrectAnswer,
        isCorrect,
        points: isCorrect ? question.Points : 0
      };
    });

    return {
      totalScore,
      maxScore,
      percentage,
      correctAnswers,
      totalQuestions: questions.length,
      categoryResults,
      answersDetails
    };
  }

  static validateQuizData(questions: QuizQuestion[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!questions || questions.length === 0) {
      errors.push('Aucune question trouvée');
      return { isValid: false, errors };
    }

    for (const question of questions) {
      if (!question.Question || question.Question.trim() === '') {
        errors.push(`Question ${question.Id}: Texte de question manquant`);
      }

      if (!question.OptionA || !question.OptionB || !question.OptionC) {
        errors.push(`Question ${question.Id}: Options de réponse incomplètes`);
      }

      if (!['A', 'B', 'C'].includes(question.CorrectAnswer)) {
        errors.push(`Question ${question.Id}: Réponse correcte invalide`);
      }

      if (!question.Category) {
        errors.push(`Question ${question.Id}: Catégorie manquante`);
      }

      if (typeof question.Points !== 'number' || question.Points <= 0) {
        errors.push(`Question ${question.Id}: Points invalides`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} secondes`;
    } else if (minutes === 1) {
      return `1 minute ${remainingSeconds > 0 ? `et ${remainingSeconds} secondes` : ''}`;
    } else {
      return `${minutes} minutes ${remainingSeconds > 0 ? `et ${remainingSeconds} secondes` : ''}`;
    }
  }

  static generateQuizResult(
    userId: number,
    userEmail: string,
    questions: QuizQuestion[],
    answers: QuizAnswer[],
    startTime: Date,
    endTime: Date
  ): Omit<QuizResult, 'Id'> {
    const score = this.calculateScore(questions, answers);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const responsesWithCorrectness = answers.map(answer => {
      const question = questions.find(q => q.Id === answer.questionId);
      return {
        ...answer,
        isCorrect: question ? answer.answer === question.CorrectAnswer : false
      };
    });

    return {
      Title: `Quiz Introduction - ${userEmail} - ${endTime.toISOString()}`,
      UserId: userId,
      UserEmail: userEmail,
      QuizType: 'Introduction',
      Score: score,
      TotalQuestions: questions.length,
      Responses: JSON.stringify(responsesWithCorrectness),
      CompletedDate: endTime,
      Duration: duration
    };
  }
}