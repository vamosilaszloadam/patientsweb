/*
* File: visit.component.ts
* Author: Vámosi László Ádám
* Copyright: 2025, Vámosi László Ádám
* Group: Szoft II-N
* Date: 2025-12-05
* GitHub: https://github.com/vamosilaszloadam/
* Licenc: MIT
*/

import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit',
  imports: [ReactiveFormsModule],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css',
})
export class VisitComponent {

  visits!: any;
  visitForm!: any;
  addMode = true;
  showModal = false;
  isSaving = false;
  isGetVisitsSuccessful = false;

  constructor(
    private api: ApiService,
    private builder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.visitForm = this.builder.group({
      id: null,
      date: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      patientId: [null, [Validators.required, Validators.pattern(/^\d+$/)]]
    });
    this.getVisits();
  }

  getVisits() {
    setTimeout(() => {
      this.api.visitsLoadingSubject.next(true);
    })
    this.api.getVisits$().subscribe({
      next: (res: any) => {
        this.visits = res.data;
        console.log(res);
        this.isGetVisitsSuccessful = true;
        this.api.visitsLoadingSubject.next(false);
      },
      error: (err: any) => {
        console.error(err);
        this.api.visitsLoadingSubject.next(false);
        Swal.fire({
          title: "Hiba!",
          text: "A látogatások lekérdezése sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        }).then(() => {
          this.router.navigate(['/home']);
        });
      }
    })
  }

  saveVisit() {
    this.isSaving = true;
    if(this.addMode) {
      this.addVisit();
    }else {
      this.updateVisit();
    }
  }

  addVisit() {
    console.log("Add ...");
    console.log(this.visitForm.value);
    this.api.createVisit$(this.visitForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showModal = false;
        this.visitForm.reset();
        this.patients = [];
        this.isSaving = false;
        Swal.fire({
          title: "Hozzáadva!",
          text: "A látogatás hozzáadva.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        this.getVisits();
      },
      error: (err: any) => {
        console.error(err);
        this.isSaving = false;
        Swal.fire({
          title: "Hiba!",
          text: "A látogatás hozzáadása sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        })
      }
    })
  }

  updateVisit() {
    console.log("Update ...");
    console.log(this.visitForm.value);
    this.api.updateVisit$(this.visitForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showModal = false;
        this.visitForm.reset();
        this.patients = [];
        this.addMode = true;
        this.isSaving = false;
        Swal.fire({
          title: "Módosítva!",
          text: "A látogatás módosítva.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        })
        this.getVisits();
      },
      error: (err: any) => {
        console.error(err);
        this.isSaving = false;
        Swal.fire({
          title: "Hiba!",
          text: "A látogatás módosítása sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        })
      }
    })
  }

  editVisit(visit: any) {
    this.addMode = false;
    this.visitForm.patchValue(visit);
    this.showModal = true;
    this.api.getPatients$().subscribe({
      next: (res: any) => {
        console.log(res);
        this.patients = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  startDeleteVisit(id: number) {
    Swal.fire({
      title: "Törlés megerősítése",
      text: "Biztos? Nem lehet visszavonni!",
      icon: "warning",
      confirmButtonText: "Igen",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonText: "Nem",
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      },
      preConfirm: () => {
        Swal.showLoading();
        return new Promise(() => {
          this.deleteVisit(id);
        });
      }
    });
  }

  deleteVisit(id: number) {
    console.log("Delete ...");
    this.api.deleteVisit$(id).subscribe({
      next: (res: any) => {
        console.log(res);
        Swal.hideLoading();
        Swal.fire({
          title: "Törölve!",
          text: "A látogatás törölve.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        this.getVisits();
      },
      error: (err: any) => {
        console.error(err);
        Swal.hideLoading();
        Swal.fire({
          title: 'Hiba!',
          text: 'A látogatás törlése sikertelen.',
          icon: 'error',
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        })
      }
    })
  }

  cancel() {
    this.showModal = false;
    this.visitForm.reset();
    this.addMode = true;
    this.patients = [];
  }

  setShowModal() {
    this.showModal = true;
    this.api.getPatients$().subscribe({
      next: (res: any) => {
        console.log(res);
        this.patients = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  patients: any;
  
}
