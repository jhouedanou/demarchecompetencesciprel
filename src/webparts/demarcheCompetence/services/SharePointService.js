import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import '@pnp/sp/site-users/web';
import '@pnp/sp/profiles';
export class SharePointService {
    constructor(context) {
        /**
         * Cache Management
         */
        this.cache = new Map();
        this.sp = spfi().using(SPFx(context));
    }
    /**
     * Get current user information
     */
    async getCurrentUser() {
        try {
            const user = await this.sp.web.currentUser();
            return {
                id: user.Id,
                title: user.Title,
                email: user.Email,
                loginName: user.LoginName
            };
        }
        catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }
    /**
     * Quiz Introduction Methods
     */
    async getQuizIntroductionQuestions() {
        try {
            const items = await this.sp.web.lists
                .getByTitle('Quiz_Introduction')
                .items
                .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')
                .orderBy('Order', true)();
            return items.map(item => (Object.assign(Object.assign({}, item), { Options: this.parseJSON(item.Options, []) })));
        }
        catch (error) {
            console.error('Error loading quiz introduction questions:', error);
            throw error;
        }
    }
    async addQuizIntroductionQuestion(question) {
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
        }
        catch (error) {
            console.error('Error adding quiz introduction question:', error);
            throw error;
        }
    }
    async updateQuizIntroductionQuestion(id, question) {
        try {
            const questionData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (question.Title && { Title: question.Title })), (question.Question && { Question: question.Question })), (question.Options && { Options: JSON.stringify(question.Options) })), (question.CorrectAnswer && { CorrectAnswer: question.CorrectAnswer })), (question.Category && { Category: question.Category })), (question.Points && { Points: question.Points })), (question.Order && { Order: question.Order }));
            await this.sp.web.lists
                .getByTitle('Quiz_Introduction')
                .items
                .getById(id)
                .update(questionData);
        }
        catch (error) {
            console.error('Error updating quiz introduction question:', error);
            throw error;
        }
    }
    async deleteQuizIntroductionQuestion(id) {
        try {
            await this.sp.web.lists
                .getByTitle('Quiz_Introduction')
                .items
                .getById(id)
                .delete();
        }
        catch (error) {
            console.error('Error deleting quiz introduction question:', error);
            throw error;
        }
    }
    async getQuizIntroductionQuestionById(id) {
        try {
            const item = await this.sp.web.lists
                .getByTitle('Quiz_Introduction')
                .items
                .getById(id)
                .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')();
            return Object.assign(Object.assign({}, item), { Options: this.parseJSON(item.Options, []) });
        }
        catch (error) {
            console.error('Error getting quiz introduction question by id:', error);
            throw error;
        }
    }
    /**
     * Quiz Sondage Methods
     */
    async getQuizSondageQuestions() {
        try {
            const items = await this.sp.web.lists
                .getByTitle('Quiz_Sondage')
                .items
                .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')
                .orderBy('Order', true)();
            return items.map(item => (Object.assign(Object.assign({}, item), { Options: this.parseJSON(item.Options, []) })));
        }
        catch (error) {
            console.error('Error loading quiz sondage questions:', error);
            throw error;
        }
    }
    async addQuizSondageQuestion(question) {
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
        }
        catch (error) {
            console.error('Error adding quiz sondage question:', error);
            throw error;
        }
    }
    async updateQuizSondageQuestion(id, question) {
        try {
            const questionData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (question.Title && { Title: question.Title })), (question.Question && { Question: question.Question })), (question.QuestionType && { QuestionType: question.QuestionType })), (question.Options && { Options: JSON.stringify(question.Options) })), (question.Required !== undefined && { Required: question.Required })), (question.Order && { Order: question.Order }));
            await this.sp.web.lists
                .getByTitle('Quiz_Sondage')
                .items
                .getById(id)
                .update(questionData);
        }
        catch (error) {
            console.error('Error updating quiz sondage question:', error);
            throw error;
        }
    }
    async deleteQuizSondageQuestion(id) {
        try {
            await this.sp.web.lists
                .getByTitle('Quiz_Sondage')
                .items
                .getById(id)
                .delete();
        }
        catch (error) {
            console.error('Error deleting quiz sondage question:', error);
            throw error;
        }
    }
    async getQuizSondageQuestionById(id) {
        try {
            const item = await this.sp.web.lists
                .getByTitle('Quiz_Sondage')
                .items
                .getById(id)
                .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')();
            return Object.assign(Object.assign({}, item), { Options: this.parseJSON(item.Options, []) });
        }
        catch (error) {
            console.error('Error getting quiz sondage question by id:', error);
            throw error;
        }
    }
    /**
     * Quiz Results Methods
     */
    async getQuizResults(userId) {
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
            return items.map(item => (Object.assign(Object.assign({}, item), { Responses: this.parseJSON(item.Responses, []), CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : '' })));
        }
        catch (error) {
            console.error('Error loading quiz results:', error);
            throw error;
        }
    }
    async saveQuizResult(result) {
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
        }
        catch (error) {
            console.error('Error saving quiz result:', error);
            throw error;
        }
    }
    async updateQuizResult(id, result) {
        try {
            const resultData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (result.QuizType && { QuizType: result.QuizType })), (result.Responses && { Responses: JSON.stringify(result.Responses) })), (result.Score !== undefined && { Score: result.Score })), (result.CompletionDate && { CompletionDate: result.CompletionDate })), (result.Duration !== undefined && { Duration: result.Duration })), (result.Status && { Status: result.Status }));
            await this.sp.web.lists
                .getByTitle('Quiz_Results')
                .items
                .getById(id)
                .update(resultData);
        }
        catch (error) {
            console.error('Error updating quiz result:', error);
            throw error;
        }
    }
    async deleteQuizResult(id) {
        try {
            await this.sp.web.lists
                .getByTitle('Quiz_Results')
                .items
                .getById(id)
                .delete();
        }
        catch (error) {
            console.error('Error deleting quiz result:', error);
            throw error;
        }
    }
    async getQuizResultById(id) {
        try {
            const item = await this.sp.web.lists
                .getByTitle('Quiz_Results')
                .items
                .getById(id)
                .select('Id', 'Title', 'User/Title', 'User/Email', 'QuizType', 'Responses', 'Score', 'CompletionDate', 'Duration', 'Status', 'Created', 'Modified')
                .expand('User')();
            return Object.assign(Object.assign({}, item), { Responses: this.parseJSON(item.Responses, []), CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : '' });
        }
        catch (error) {
            console.error('Error getting quiz result by id:', error);
            throw error;
        }
    }
    /**
     * User Progress Methods
     */
    async getUserProgress(userId) {
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
            return items.map(item => (Object.assign(Object.assign({}, item), { LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '', NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : '' })));
        }
        catch (error) {
            console.error('Error loading user progress:', error);
            throw error;
        }
    }
    async saveUserProgress(progress) {
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
        }
        catch (error) {
            console.error('Error saving user progress:', error);
            throw error;
        }
    }
    async updateUserProgress(id, progress) {
        try {
            const progressData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (progress.CompetenceArea && { CompetenceArea: progress.CompetenceArea })), (progress.CurrentLevel !== undefined && { CurrentLevel: progress.CurrentLevel })), (progress.TargetLevel !== undefined && { TargetLevel: progress.TargetLevel })), (progress.LastAssessment && { LastAssessment: progress.LastAssessment })), (progress.NextAssessment && { NextAssessment: progress.NextAssessment })), (progress.Progress !== undefined && { Progress: progress.Progress }));
            await this.sp.web.lists
                .getByTitle('User_Progress')
                .items
                .getById(id)
                .update(progressData);
        }
        catch (error) {
            console.error('Error updating user progress:', error);
            throw error;
        }
    }
    async deleteUserProgress(id) {
        try {
            await this.sp.web.lists
                .getByTitle('User_Progress')
                .items
                .getById(id)
                .delete();
        }
        catch (error) {
            console.error('Error deleting user progress:', error);
            throw error;
        }
    }
    async getUserProgressById(id) {
        try {
            const item = await this.sp.web.lists
                .getByTitle('User_Progress')
                .items
                .getById(id)
                .select('Id', 'Title', 'User/Title', 'User/Email', 'CompetenceArea', 'CurrentLevel', 'TargetLevel', 'LastAssessment', 'NextAssessment', 'Progress', 'Created', 'Modified')
                .expand('User')();
            return Object.assign(Object.assign({}, item), { LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '', NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : '' });
        }
        catch (error) {
            console.error('Error getting user progress by id:', error);
            throw error;
        }
    }
    /**
     * Utility Methods
     */
    async checkListExists(listTitle) {
        try {
            await this.sp.web.lists.getByTitle(listTitle)();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async getListItems(listTitle, select, filter, orderBy, top) {
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
        }
        catch (error) {
            console.error(`Error getting items from list ${listTitle}:`, error);
            throw error;
        }
    }
    async bulkUpdateItems(listTitle, updates) {
        try {
            // Use sequential updates for now - batch operations can be added later
            const list = this.sp.web.lists.getByTitle(listTitle);
            for (const update of updates) {
                await list.items.getById(update.id).update(update.data);
            }
        }
        catch (error) {
            console.error(`Error bulk updating items in list ${listTitle}:`, error);
            throw error;
        }
    }
    async exportToExcel(listTitle, fileName) {
        try {
            const items = await this.getListItems(listTitle);
            const data = items.map(item => {
                // Remove complex objects and keep only simple properties
                const simpleItem = {};
                for (const key in item) {
                    if (typeof item[key] !== 'object' || item[key] === null) {
                        simpleItem[key] = item[key];
                    }
                }
                return simpleItem;
            });
            // Convert to CSV
            if (data.length === 0)
                return;
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
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
        }
        catch (error) {
            console.error('Error exporting to Excel:', error);
            throw error;
        }
    }
    /**
     * Helper Methods
     */
    parseJSON(jsonString, defaultValue = null) {
        try {
            return jsonString ? JSON.parse(jsonString) : defaultValue;
        }
        catch (error) {
            console.warn('Error parsing JSON:', error);
            return defaultValue;
        }
    }
    clearCache() {
        this.cache.clear();
    }
    removeCacheEntry(key) {
        this.cache.delete(key);
    }
}
//# sourceMappingURL=SharePointService.js.map