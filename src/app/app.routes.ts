/*
* File: app.routes.ts
* Author: Vámosi László Ádám
* Copyright: 2025, Vámosi László Ádám
* Group: Szoft II-N
* Date: 2025-12-05
* GitHub: https://github.com/vamosilaszloadam/
* Licenc: MIT
*/

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PatientComponent } from './patient/patient.component';
import { VisitComponent } from './visit/visit.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'patient', component: PatientComponent },
    { path: 'visit', component: VisitComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
