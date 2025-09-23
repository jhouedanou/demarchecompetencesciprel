import { spfi, SPFx } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import '@pnp/sp/site-users/web';
import '@pnp/sp/profiles';
import type {
  QuizIntroductionItem,
  QuizSondageItem,
  QuizResultsItem,
  UserProgressItem,
  SharePointListItem
} from '@types/index';

export class SharePointService {
  private sp: ReturnType<typeof spfi>;
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
    this.sp = spfi().using(SPFx(context));
  }

  /**
   * Get current user information
   */
  public async getCurrentUser() {
    try {
      const user = await this.sp.web.currentUser();
      return {
        id: user.Id,
        title: user.Title,
        email: user.Email,
        loginName: user.LoginName
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Quiz Introduction Methods
   */
  public async getQuizIntroductionQuestions(): Promise<QuizIntroductionItem[]> {
    try {
      const items = await this.sp.web.lists
        .getByTitle('Quiz_Introduction')
        .items
        .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')
        .orderBy('Order', true)();

      return items.map(item => ({
        ...item,
        Options: this.parseJSON(item.Options, []),
      }));
    } catch (error) {
      console.error('Error loading quiz introduction questions:', error);
      throw error;
    }
  }

  public async addQuizIntroductionQuestion(question: Partial<QuizIntroductionItem>): Promise<QuizIntroductionItem> {
    try {
      const questionData = {
        Title: question.Title,
        Question: question.Question,
        Options: JSON.stringify(question.Options),
        CorrectAnswer: question.CorrectAnswer,
        Category: question.Category,
        Points: question.Points,
        Order: question.Order
      };

      const result = await this.sp.web.lists
        .getByTitle('Quiz_Introduction')
        .items
        .add(questionData);

      return await this.getQuizIntroductionQuestionById(result.data.Id);
    } catch (error) {
      console.error('Error adding quiz introduction question:', error);
      throw error;
    }
  }

  public async updateQuizIntroductionQuestion(id: number, question: Partial<QuizIntroductionItem>): Promise<void> {
    try {
      const questionData = {
        ...(question.Title && { Title: question.Title }),
        ...(question.Question && { Question: question.Question }),
        ...(question.Options && { Options: JSON.stringify(question.Options) }),
        ...(question.CorrectAnswer && { CorrectAnswer: question.CorrectAnswer }),
        ...(question.Category && { Category: question.Category }),
        ...(question.Points && { Points: question.Points }),
        ...(question.Order && { Order: question.Order })
      };

      await this.sp.web.lists
        .getByTitle('Quiz_Introduction')
        .items
        .getById(id)
        .update(questionData);
    } catch (error) {
      console.error('Error updating quiz introduction question:', error);
      throw error;
    }
  }

  public async deleteQuizIntroductionQuestion(id: number): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle('Quiz_Introduction')
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error('Error deleting quiz introduction question:', error);
      throw error;
    }
  }

  private async getQuizIntroductionQuestionById(id: number): Promise<QuizIntroductionItem> {
    try {
      const item = await this.sp.web.lists
        .getByTitle('Quiz_Introduction')
        .items
        .getById(id)
        .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')();

      return {
        ...item,
        Options: this.parseJSON(item.Options, []),
      };
    } catch (error) {
      console.error('Error getting quiz introduction question by id:', error);
      throw error;
    }
  }

  /**
   * Quiz Sondage Methods
   */
  public async getQuizSondageQuestions(): Promise<QuizSondageItem[]> {
    try {
      const items = await this.sp.web.lists
        .getByTitle('Quiz_Sondage')
        .items
        .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')
        .orderBy('Order', true)();

      return items.map(item => ({
        ...item,
        Options: this.parseJSON(item.Options, []),
      }));
    } catch (error) {
      console.error('Error loading quiz sondage questions:', error);
      throw error;
    }
  }

  public async addQuizSondageQuestion(question: Partial<QuizSondageItem>): Promise<QuizSondageItem> {
    try {
      const questionData = {
        Title: question.Title,
        Question: question.Question,
        QuestionType: question.QuestionType,
        Options: JSON.stringify(question.Options),
        Required: question.Required,
        Order: question.Order
      };

      const result = await this.sp.web.lists
        .getByTitle('Quiz_Sondage')
        .items
        .add(questionData);

      return await this.getQuizSondageQuestionById(result.data.Id);
    } catch (error) {
      console.error('Error adding quiz sondage question:', error);
      throw error;
    }
  }

  public async updateQuizSondageQuestion(id: number, question: Partial<QuizSondageItem>): Promise<void> {
    try {
      const questionData = {
        ...(question.Title && { Title: question.Title }),
        ...(question.Question && { Question: question.Question }),
        ...(question.QuestionType && { QuestionType: question.QuestionType }),
        ...(question.Options && { Options: JSON.stringify(question.Options) }),
        ...(question.Required !== undefined && { Required: question.Required }),
        ...(question.Order && { Order: question.Order })
      };

      await this.sp.web.lists
        .getByTitle('Quiz_Sondage')
        .items
        .getById(id)
        .update(questionData);
    } catch (error) {
      console.error('Error updating quiz sondage question:', error);
      throw error;
    }
  }

  public async deleteQuizSondageQuestion(id: number): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle('Quiz_Sondage')
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error('Error deleting quiz sondage question:', error);
      throw error;
    }
  }

  private async getQuizSondageQuestionById(id: number): Promise<QuizSondageItem> {
    try {
      const item = await this.sp.web.lists
        .getByTitle('Quiz_Sondage')
        .items
        .getById(id)
        .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')();

      return {
        ...item,
        Options: this.parseJSON(item.Options, []),
      };
    } catch (error) {
      console.error('Error getting quiz sondage question by id:', error);
      throw error;
    }
  }

  /**
   * Quiz Results Methods
   */
  public async getQuizResults(userId?: string): Promise<QuizResultsItem[]> {
    try {
      let query = this.sp.web.lists
        .getByTitle('Quiz_Results')
        .items
        .select('Id', 'Title', 'User/Title', 'User/Email', 'QuizType', 'Responses', 'Score', 'CompletionDate', 'Duration', 'Status', 'Created', 'Modified')
        .expand('User')
        .orderBy('CompletionDate', false);

      if (userId) {
        query = query.filter(`User/Email eq '${userId}'`);
      }

      const items = await query();

      return items.map(item => ({
        ...item,
        Responses: this.parseJSON(item.Responses, []),
        CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : ''
      }));
    } catch (error) {
      console.error('Error loading quiz results:', error);
      throw error;
    }
  }

  public async saveQuizResult(result: Partial<QuizResultsItem>): Promise<QuizResultsItem> {
    try {
      const currentUser = await this.getCurrentUser();
      
      const resultData = {
        Title: result.Title || `${result.QuizType} - ${currentUser.title} - ${new Date().toLocaleDateString('fr-FR')}`,
        UserId: currentUser.id,
        QuizType: result.QuizType,
        Responses: JSON.stringify(result.Responses),
        Score: result.Score || 0,
        CompletionDate: result.CompletionDate || new Date().toISOString(),
        Duration: result.Duration,
        Status: result.Status
      };

      const response = await this.sp.web.lists
        .getByTitle('Quiz_Results')
        .items
        .add(resultData);

      return await this.getQuizResultById(response.data.Id);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }

  public async updateQuizResult(id: number, result: Partial<QuizResultsItem>): Promise<void> {
    try {
      const resultData = {
        ...(result.QuizType && { QuizType: result.QuizType }),
        ...(result.Responses && { Responses: JSON.stringify(result.Responses) }),
        ...(result.Score !== undefined && { Score: result.Score }),
        ...(result.CompletionDate && { CompletionDate: result.CompletionDate }),
        ...(result.Duration !== undefined && { Duration: result.Duration }),
        ...(result.Status && { Status: result.Status })
      };

      await this.sp.web.lists
        .getByTitle('Quiz_Results')
        .items
        .getById(id)
        .update(resultData);
    } catch (error) {
      console.error('Error updating quiz result:', error);
      throw error;
    }
  }

  public async deleteQuizResult(id: number): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle('Quiz_Results')
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error('Error deleting quiz result:', error);
      throw error;
    }
  }

  private async getQuizResultById(id: number): Promise<QuizResultsItem> {
    try {
      const item = await this.sp.web.lists
        .getByTitle('Quiz_Results')
        .items
        .getById(id)
        .select('Id', 'Title', 'User/Title', 'User/Email', 'QuizType', 'Responses', 'Score', 'CompletionDate', 'Duration', 'Status', 'Created', 'Modified')
        .expand('User')();

      return {
        ...item,
        Responses: this.parseJSON(item.Responses, []),
        CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : ''
      };
    } catch (error) {
      console.error('Error getting quiz result by id:', error);
      throw error;
    }
  }

  /**
   * User Progress Methods
   */
  public async getUserProgress(userId?: string): Promise<UserProgressItem[]> {
    try {
      let query = this.sp.web.lists
        .getByTitle('User_Progress')
        .items
        .select('Id', 'Title', 'User/Title', 'User/Email', 'CompetenceArea', 'CurrentLevel', 'TargetLevel', 'LastAssessment', 'NextAssessment', 'Progress', 'Created', 'Modified')
        .expand('User')
        .orderBy('CompetenceArea', true);

      if (userId) {
        query = query.filter(`User/Email eq '${userId}'`);
      }

      const items = await query();

      return items.map(item => ({
        ...item,
        LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '',
        NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : ''
      }));
    } catch (error) {
      console.error('Error loading user progress:', error);
      throw error;
    }
  }

  public async saveUserProgress(progress: Partial<UserProgressItem>): Promise<UserProgressItem> {
    try {
      const currentUser = await this.getCurrentUser();
      
      const progressData = {
        Title: progress.Title || `${progress.CompetenceArea} - ${currentUser.title}`,
        UserId: currentUser.id,
        CompetenceArea: progress.CompetenceArea,
        CurrentLevel: progress.CurrentLevel,
        TargetLevel: progress.TargetLevel,
        LastAssessment: progress.LastAssessment,
        NextAssessment: progress.NextAssessment,
        Progress: progress.Progress
      };

      const response = await this.sp.web.lists
        .getByTitle('User_Progress')
        .items
        .add(progressData);

      return await this.getUserProgressById(response.data.Id);
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  public async updateUserProgress(id: number, progress: Partial<UserProgressItem>): Promise<void> {
    try {
      const progressData = {
        ...(progress.CompetenceArea && { CompetenceArea: progress.CompetenceArea }),
        ...(progress.CurrentLevel !== undefined && { CurrentLevel: progress.CurrentLevel }),
        ...(progress.TargetLevel !== undefined && { TargetLevel: progress.TargetLevel }),
        ...(progress.LastAssessment && { LastAssessment: progress.LastAssessment }),
        ...(progress.NextAssessment && { NextAssessment: progress.NextAssessment }),
        ...(progress.Progress !== undefined && { Progress: progress.Progress })
      };

      await this.sp.web.lists
        .getByTitle('User_Progress')
        .items
        .getById(id)
        .update(progressData);
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  public async deleteUserProgress(id: number): Promise<void> {
    try {
      await this.sp.web.lists
        .getByTitle('User_Progress')
        .items
        .getById(id)
        .delete();
    } catch (error) {
      console.error('Error deleting user progress:', error);
      throw error;
    }
  }

  private async getUserProgressById(id: number): Promise<UserProgressItem> {
    try {
      const item = await this.sp.web.lists
        .getByTitle('User_Progress')
        .items
        .getById(id)
        .select('Id', 'Title', 'User/Title', 'User/Email', 'CompetenceArea', 'CurrentLevel', 'TargetLevel', 'LastAssessment', 'NextAssessment', 'Progress', 'Created', 'Modified')
        .expand('User')();

      return {
        ...item,
        LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '',
        NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : ''
      };
    } catch (error) {
      console.error('Error getting user progress by id:', error);
      throw error;
    }
  }

  /**
   * Utility Methods
   */
  public async checkListExists(listTitle: string): Promise<boolean> {
    try {
      await this.sp.web.lists.getByTitle(listTitle)();
      return true;
    } catch (error) {
      return false;
    }
  }

  public async getListItems<T = SharePointListItem>(
    listTitle: string,
    select?: string[],
    filter?: string,
    orderBy?: string,
    top?: number
  ): Promise<T[]> {
    try {
      let query = this.sp.web.lists.getByTitle(listTitle).items;

      if (select) {
        query = query.select(...select);
      }

      if (filter) {
        query = query.filter(filter);
      }

      if (orderBy) {
        query = query.orderBy(orderBy, true);
      }

      if (top) {
        query = query.top(top);
      }

      return await query();
    } catch (error) {
      console.error(`Error getting items from list ${listTitle}:`, error);
      throw error;
    }
  }

  public async bulkUpdateItems<T = any>(
    listTitle: string,
    updates: Array<{ id: number; data: Partial<T> }>
  ): Promise<void> {
    try {
      const batch = this.sp.web.createBatch();
      const list = this.sp.web.lists.getByTitle(listTitle);

      updates.forEach(update => {
        list.items.getById(update.id).inBatch(batch).update(update.data);
      });

      await batch.execute();
    } catch (error) {
      console.error(`Error bulk updating items in list ${listTitle}:`, error);
      throw error;
    }
  }

  public async exportToExcel(
    listTitle: string,
    fileName?: string
  ): Promise<void> {
    try {
      const items = await this.getListItems(listTitle);
      const data = items.map(item => {
        // Remove complex objects and keep only simple properties
        const simpleItem: any = {};
        for (const key in item) {
          if (typeof item[key] !== 'object' || item[key] === null) {
            simpleItem[key] = item[key];
          }
        }
        return simpleItem;
      });

      // Convert to CSV
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName || `${listTitle}-export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  /**
   * Helper Methods
   */
  private parseJSON(jsonString: string, defaultValue: any = null): any {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.warn('Error parsing JSON:', error);
      return defaultValue;
    }
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString();
  }

  /**
   * Cache Management
   */
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private async getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now, ttl });
    return data;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public removeCacheEntry(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Error Handling and Retry Logic
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }

    throw lastError!;
  }
}