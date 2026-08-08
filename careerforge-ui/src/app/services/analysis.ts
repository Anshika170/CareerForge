import { Injectable } from '@angular/core';

export interface AnalysisResponse {
  atsScore: number;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  jobRoles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  analysis: AnalysisResponse | null = null;

}