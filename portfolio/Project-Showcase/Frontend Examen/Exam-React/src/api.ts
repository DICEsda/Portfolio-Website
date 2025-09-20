import type { Exam } from './App';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // Hent alle eksamener
  async getExams(): Promise<Exam[]> {
    const response = await fetch(`${API_BASE_URL}/exams`);
    if (!response.ok) {
      throw new Error('Failed to fetch exams');
    }
    return response.json();
  },

  // Opret en ny eksamen
  async createExam(exam: Omit<Exam, 'id'>): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exam),
    });
    if (!response.ok) {
      throw new Error('Failed to create exam');
    }
    return response.json();
  },

  // Opdater en eksamen
  async updateExam(id: string, exam: Exam): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exam),
    });
    if (!response.ok) {
      throw new Error('Failed to update exam');
    }
    return response.json();
  },

  // Slet en eksamen
  async deleteExam(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete exam');
    }
  },

  // Tilføj en studerende til en eksamen
  async addStudentToExam(examId: string, student: { name: string; studentNumber: string }): Promise<Exam> {
    const exam = await this.getExamById(examId);
    const updatedExam = {
      ...exam,
      students: [...exam.students, student],
    };
    return this.updateExam(examId, updatedExam);
  },

  // Fjern en studerende fra en eksamen
  async removeStudentFromExam(examId: string, studentNumber: string): Promise<Exam> {
    const exam = await this.getExamById(examId);
    const updatedExam = {
      ...exam,
      students: exam.students.filter(s => s.studentNumber !== studentNumber),
    };
    return this.updateExam(examId, updatedExam);
  },

  // Hent en specifik eksamen
  async getExamById(id: string): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exam');
    }
    return response.json();
  },

  // Opdater eksamensresultater
  async updateExamResults(examId: string, results: any[]): Promise<Exam> {
    const exam = await this.getExamById(examId);
    const updatedExam = {
      ...exam,
      results: results,
    };
    return this.updateExam(examId, updatedExam);
  },
}; 