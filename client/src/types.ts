export interface SurveyResponse {
  id?: number;
  name: string;
  email: string;
  age: number;
  favorite_color: string;
  feedback?: string;
  created_at?: string;
}

export interface SurveyFormData {
  name: string;
  email: string;
  age: string;
  favorite_color: string;
  feedback: string;
} 