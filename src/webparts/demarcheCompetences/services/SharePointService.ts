import { spfi, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { QuizQuestion, QuizResult, SondageResponse } from '../types';

export class SharePointService {
  private sp: any;

  constructor(context: WebPartContext) {
    this.sp = spfi().using(SPFx(context));
  }

  // Questions Methods
  async getQuizQuestions(quizType: 'Introduction' | 'Sondage'): Promise<QuizQuestion[]> {
    try {
      const items = await this.sp.web.lists.getByTitle("CompetenceQuestions")
        .items
        .filter(`QuizType eq '${quizType}'`)
        .orderBy('Id', true)
        .select("Id", "Title", "Question", "OptionA", "OptionB", "OptionC", "CorrectAnswer", "Category", "Points", "QuizType")();

      return items.map((item: any) => ({
        Id: item.Id,
        Title: item.Title,
        Question: item.Question,
        OptionA: item.OptionA,
        OptionB: item.OptionB,
        OptionC: item.OptionC,
        CorrectAnswer: item.CorrectAnswer,
        Category: item.Category,
        Points: item.Points,
        QuizType: item.QuizType
      }));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }

  async createQuizQuestion(question: Omit<QuizQuestion, 'Id'>): Promise<QuizQuestion> {
    try {
      const result = await this.sp.web.lists.getByTitle("CompetenceQuestions")
        .items.add({
          Title: question.Title,
          Question: question.Question,
          OptionA: question.OptionA,
          OptionB: question.OptionB,
          OptionC: question.OptionC,
          CorrectAnswer: question.CorrectAnswer,
          Category: question.Category,
          Points: question.Points,
          QuizType: question.QuizType
        });

      return {
        Id: result.data.Id,
        ...question
      };
    } catch (error) {
      console.error('Error creating quiz question:', error);
      throw error;
    }
  }

  // Quiz Results Methods
  async saveQuizResult(result: Omit<QuizResult, 'Id'>): Promise<QuizResult> {
    try {
      const saveResult = await this.sp.web.lists.getByTitle("CompetenceResults")
        .items.add({
          Title: result.Title,
          UserId: result.UserId,
          UserEmail: result.UserEmail,
          QuizType: result.QuizType,
          Score: result.Score,
          TotalQuestions: result.TotalQuestions,
          Responses: result.Responses,
          CompletedDate: result.CompletedDate,
          Duration: result.Duration
        });

      return {
        Id: saveResult.data.Id,
        ...result
      };
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }

  async getQuizResults(userId?: number): Promise<QuizResult[]> {
    try {
      let query = this.sp.web.lists.getByTitle("CompetenceResults").items
        .select("Id", "Title", "UserId", "UserEmail", "QuizType", "Score", "TotalQuestions", "Responses", "CompletedDate", "Duration")
        .orderBy('CompletedDate', false);

      if (userId) {
        query = query.filter(`UserId eq ${userId}`);
      }

      const items = await query();

      return items.map((item: any) => ({
        Id: item.Id,
        Title: item.Title,
        UserId: item.UserId,
        UserEmail: item.UserEmail,
        QuizType: item.QuizType,
        Score: item.Score,
        TotalQuestions: item.TotalQuestions,
        Responses: item.Responses,
        CompletedDate: new Date(item.CompletedDate),
        Duration: item.Duration
      }));
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      throw error;
    }
  }

  async getUserQuizResult(userId: number, quizType: 'Introduction' | 'Sondage'): Promise<QuizResult | null> {
    try {
      const items = await this.sp.web.lists.getByTitle("CompetenceResults")
        .items
        .filter(`UserId eq ${userId} and QuizType eq '${quizType}'`)
        .select("Id", "Title", "UserId", "UserEmail", "QuizType", "Score", "TotalQuestions", "Responses", "CompletedDate", "Duration")
        .top(1)();

      if (items.length === 0) {
        return null;
      }

      const item = items[0];
      return {
        Id: item.Id,
        Title: item.Title,
        UserId: item.UserId,
        UserEmail: item.UserEmail,
        QuizType: item.QuizType,
        Score: item.Score,
        TotalQuestions: item.TotalQuestions,
        Responses: item.Responses,
        CompletedDate: new Date(item.CompletedDate),
        Duration: item.Duration
      };
    } catch (error) {
      console.error('Error fetching user quiz result:', error);
      throw error;
    }
  }

  // Sondage Methods
  async saveSondageResponse(response: Omit<SondageResponse, 'Id'>): Promise<SondageResponse> {
    try {
      const result = await this.sp.web.lists.getByTitle("SondageResponses")
        .items.add({
          Title: response.Title,
          UserId: response.UserId,
          UserEmail: response.UserEmail,
          Q1_Connaissance: response.Q1_Connaissance,
          Q2_Definition: response.Q2_Definition,
          Q3_Benefices: response.Q3_Benefices,
          Q4_Attentes: response.Q4_Attentes,
          Q5_Inquietudes: response.Q5_Inquietudes,
          Q6_Informations: response.Q6_Informations,
          SubmittedDate: response.SubmittedDate
        });

      return {
        Id: result.data.Id,
        ...response
      };
    } catch (error) {
      console.error('Error saving sondage response:', error);
      throw error;
    }
  }

  async getSondageResponses(userId?: number): Promise<SondageResponse[]> {
    try {
      let query = this.sp.web.lists.getByTitle("SondageResponses").items
        .select("Id", "Title", "UserId", "UserEmail", "Q1_Connaissance", "Q2_Definition", "Q3_Benefices", "Q4_Attentes", "Q5_Inquietudes", "Q6_Informations", "SubmittedDate")
        .orderBy('SubmittedDate', false);

      if (userId) {
        query = query.filter(`UserId eq ${userId}`);
      }

      const items = await query();

      return items.map((item: any) => ({
        Id: item.Id,
        Title: item.Title,
        UserId: item.UserId,
        UserEmail: item.UserEmail,
        Q1_Connaissance: item.Q1_Connaissance,
        Q2_Definition: item.Q2_Definition,
        Q3_Benefices: item.Q3_Benefices,
        Q4_Attentes: item.Q4_Attentes,
        Q5_Inquietudes: item.Q5_Inquietudes,
        Q6_Informations: item.Q6_Informations,
        SubmittedDate: new Date(item.SubmittedDate)
      }));
    } catch (error) {
      console.error('Error fetching sondage responses:', error);
      throw error;
    }
  }

  async getUserSondageResponse(userId: number): Promise<SondageResponse | null> {
    try {
      const items = await this.sp.web.lists.getByTitle("SondageResponses")
        .items
        .filter(`UserId eq ${userId}`)
        .select("Id", "Title", "UserId", "UserEmail", "Q1_Connaissance", "Q2_Definition", "Q3_Benefices", "Q4_Attentes", "Q5_Inquietudes", "Q6_Informations", "SubmittedDate")
        .top(1)();

      if (items.length === 0) {
        return null;
      }

      const item = items[0];
      return {
        Id: item.Id,
        Title: item.Title,
        UserId: item.UserId,
        UserEmail: item.UserEmail,
        Q1_Connaissance: item.Q1_Connaissance,
        Q2_Definition: item.Q2_Definition,
        Q3_Benefices: item.Q3_Benefices,
        Q4_Attentes: item.Q4_Attentes,
        Q5_Inquietudes: item.Q5_Inquietudes,
        Q6_Informations: item.Q6_Informations,
        SubmittedDate: new Date(item.SubmittedDate)
      };
    } catch (error) {
      console.error('Error fetching user sondage response:', error);
      throw error;
    }
  }

  // Dashboard Analytics
  async getDashboardData(): Promise<{
    totalParticipants: number;
    averageScore: number;
    completionRate: number;
    categoryScores: Record<string, number>;
  }> {
    try {
      const results = await this.getQuizResults();
      const quizResults = results.filter(r => r.QuizType === 'Introduction');

      const totalParticipants = quizResults.length;
      const averageScore = totalParticipants > 0
        ? quizResults.reduce((sum, result) => sum + (result.Score || 0), 0) / totalParticipants
        : 0;

      const categoryScores: Record<string, number> = {};

      for (const result of quizResults) {
        try {
          const responses = JSON.parse(result.Responses);
          for (const response of responses) {
            const questions = await this.getQuizQuestions('Introduction');
            const question = questions.find(q => q.Id === response.questionId);
            if (question && response.isCorrect) {
              categoryScores[question.Category] = (categoryScores[question.Category] || 0) + 1;
            }
          }
        } catch (e) {
          console.warn('Error parsing responses for result:', result.Id);
        }
      }

      return {
        totalParticipants,
        averageScore,
        completionRate: 100, // Assuming completion rate is 100% for now
        categoryScores
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // List provisioning check
  async ensureListsExist(): Promise<void> {
    try {
      await this.ensureListExists("CompetenceQuestions", "Quiz Questions", [
        { name: "Question", type: "Text" },
        { name: "OptionA", type: "Text" },
        { name: "OptionB", type: "Text" },
        { name: "OptionC", type: "Text" },
        { name: "CorrectAnswer", type: "Choice", choices: ["A", "B", "C"] },
        { name: "Category", type: "Choice", choices: ["Definition", "Responsabilite", "Competences", "Etapes"] },
        { name: "Points", type: "Number" },
        { name: "QuizType", type: "Choice", choices: ["Introduction", "Sondage"] }
      ]);

      await this.ensureListExists("CompetenceResults", "Quiz Results", [
        { name: "UserId", type: "Number" },
        { name: "UserEmail", type: "Text" },
        { name: "QuizType", type: "Choice", choices: ["Introduction", "Sondage"] },
        { name: "Score", type: "Number" },
        { name: "TotalQuestions", type: "Number" },
        { name: "Responses", type: "Note" },
        { name: "CompletedDate", type: "DateTime" },
        { name: "Duration", type: "Number" }
      ]);

      await this.ensureListExists("SondageResponses", "Survey Responses", [
        { name: "UserId", type: "Number" },
        { name: "UserEmail", type: "Text" },
        { name: "Q1_Connaissance", type: "Choice", choices: ["Oui", "Non", "Vague idée"] },
        { name: "Q2_Definition", type: "Text" },
        { name: "Q3_Benefices", type: "Text" },
        { name: "Q4_Attentes", type: "Note" },
        { name: "Q5_Inquietudes", type: "Note" },
        { name: "Q6_Informations", type: "Text" },
        { name: "SubmittedDate", type: "DateTime" }
      ]);

    } catch (error) {
      console.error('Error ensuring lists exist:', error);
      throw error;
    }
  }

  private async ensureListExists(listName: string, description: string, fields: any[]): Promise<void> {
    try {
      await this.sp.web.lists.getByTitle(listName)();
    } catch (error) {
      console.log(`List ${listName} does not exist, creating...`);
      const listCreationInfo = {
        Title: listName,
        Description: description,
        TemplateType: 100
      };

      const list = await this.sp.web.lists.add(listCreationInfo);

      for (const field of fields) {
        await this.addFieldToList(list.data, field);
      }
    }
  }

  private async addFieldToList(list: any, fieldInfo: any): Promise<void> {
    try {
      let fieldXml = '';

      switch (fieldInfo.type) {
        case 'Text':
          fieldXml = `<Field Type='Text' DisplayName='${fieldInfo.name}' Name='${fieldInfo.name}' />`;
          break;
        case 'Number':
          fieldXml = `<Field Type='Number' DisplayName='${fieldInfo.name}' Name='${fieldInfo.name}' />`;
          break;
        case 'DateTime':
          fieldXml = `<Field Type='DateTime' DisplayName='${fieldInfo.name}' Name='${fieldInfo.name}' Format='DateTime' />`;
          break;
        case 'Note':
          fieldXml = `<Field Type='Note' DisplayName='${fieldInfo.name}' Name='${fieldInfo.name}' NumLines='6' />`;
          break;
        case 'Choice':
          const choices = fieldInfo.choices.map((choice: string) => `<CHOICE>${choice}</CHOICE>`).join('');
          fieldXml = `<Field Type='Choice' DisplayName='${fieldInfo.name}' Name='${fieldInfo.name}'><CHOICES>${choices}</CHOICES></Field>`;
          break;
      }

      if (fieldXml) {
        await this.sp.web.lists.getById(list.Id).fields.addFieldAsXml(fieldXml);
      }
    } catch (error) {
      console.warn(`Error adding field ${fieldInfo.name}:`, error);
    }
  }
}