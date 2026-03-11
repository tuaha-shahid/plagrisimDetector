// plag.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlagiarismCheckResult } from '../../Types/plag';

@Injectable({
  providedIn: 'root'
})
export class PlagService {
  httpClient = inject(HttpClient);

  checkPlagrisim(model: { plagContent: string }): Observable<PlagiarismCheckResult> {
    // Adjust to use 'data' as the key to match backend expectations
    const requestData = { data: model.plagContent };
    return this.httpClient.post<PlagiarismCheckResult>(environment.apiUrl + '/api/checkPlagirism', requestData);
  }

}
