/*
* File: api.service.ts
* Author: Vámosi László Ádám
* Copyright: 2025, Vámosi László Ádám
* Group: Szoft II-N
* Date: 2025-12-05
* GitHub: https://github.com/vamosilaszloadam/
* Licenc: MIT
*/

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  host = environment.apiHost;

  patientsLoadingSubject = new BehaviorSubject<boolean>(false);
  patientsLoading$ = this.patientsLoadingSubject.asObservable();

  visitsLoadingSubject = new BehaviorSubject<boolean>(false);
  visitsLoading$ = this.visitsLoadingSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  getPatients$() {
    const url = this.host + '/patients';
    return this.http.get(url);
  }

  createPatient$(patient: any) {
    const url = this.host + '/patients';
    return this.http.post(url, patient);
  }

  updatePatient$(patient: any) {
    const url = this.host + '/patients/' + patient.id;
    return this.http.put(url, patient);
  }

  deletePatient$(id: number) {
    const url = this.host + '/patients/' + id;
    return this.http.delete(url);
  }

  getVisits$() {
    const url = this.host + '/visits';
    return this.http.get(url);
  }

  createVisit$(visit: any) {
    const url = this.host + '/visits';
    return this.http.post(url, visit);
  }

  updateVisit$(visit: any) {
    const url = this.host + '/visits/' + visit.id;
    return this.http.put(url, visit);
  }

  deleteVisit$(id: number) {
    const url = this.host + '/visits/' + id;
    return this.http.delete(url);
  }
}
