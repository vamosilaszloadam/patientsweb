/*
* File: patient.component.ts
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
  selector: 'app-patient',
  imports: [ReactiveFormsModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {

  patients!: any;
  patientForm!: any;
  addMode = true;
  showModal = false;
  isSaving = false;
  isGetPatientsSuccessful = false;

  constructor(
    private api: ApiService,
    private builder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.patientForm = this.builder.group({
      id: null,
      name: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      socialNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+36\(\d{2}\)\d{3}-\d{4}$/)]]
    });
    this.getPatients();
  }

  getPatients() {
    setTimeout(() => {
      this.api.patientsLoadingSubject.next(true);
    });
    this.api.getPatients$().subscribe({
      next: (res: any) => {
        this.patients = res.data;
        console.log(res);
        this.isGetPatientsSuccessful = true;
        this.api.patientsLoadingSubject.next(false);
      },
      error: (err: any) => {
        console.error(err);
        this.api.patientsLoadingSubject.next(false);
        Swal.fire({
          title: "Hiba!",
          text: "A páciensek lekérdezése sikertelen.",
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

  savePatient() {
    this.isSaving = true;
    if(this.addMode) {
      this.addPatient();
    }else {
      this.updatePatient();
    }
  }

  addPatient() {
    console.log('Add ...');
    console.log(this.patientForm.value);
    this.api.createPatient$(this.patientForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showModal = false;
        this.patientForm.reset();
        this.isSaving = false;
        Swal.fire({
          title: "Hozzáadva!",
          text: "A páciens hozzáadva.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        this.getPatients();
      },
      error: (err: any) => {
        console.error(err);
        this.isSaving = false;
        Swal.fire({
          title: "Hiba!",
          text: "A páciens hozzáadása sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        });
      }
    })
  }

  updatePatient() {
    console.log('Update ...');
    console.log(this.patientForm.value);
    this.api.updatePatient$(this.patientForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showModal = false;
        this.patientForm.reset();
        this.addMode = true;
        this.isSaving = false;
        Swal.fire({
          title: "Módosítva!",
          text: "A páciens módosítva.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        this.getPatients();
      },
      error: (err: any) => {
        console.error(err);
        this.isSaving = false;
        Swal.fire({
          title: "Hiba!",
          text: "A páciens módosítása sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        });
      }
    })
  }

  editPatient(patient: any) {
    this.addMode = false;
    this.patientForm.patchValue(patient);
    this.showModal = true;
  }

  startDeletePatient(id: number) {
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
          this.deletePatient(id);
        });
      }
    });
  }

  deletePatient(id: number) {
    console.log('Delete ...');
    this.api.deletePatient$(id).subscribe({
      next: (res: any) => {
        console.log(res);
        Swal.hideLoading();
        Swal.fire({
          title: "Törölve!",
          text: "A páciens törölve.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
        this.getPatients();
      },
      error: (err: any) => {
        console.error(err);
        Swal.hideLoading();
        Swal.fire({
          title: "Hiba!",
          text: "A páciens törlése sikertelen.",
          icon: "error",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            confirmButton: 'btn btn-secondary'
          }
        });
      }
    });
  }

  cancel() {
    this.showModal = false;
    this.patientForm.reset();
    this.addMode = true;
  }

  setShowModal() {
    this.showModal = true;
  }
}
