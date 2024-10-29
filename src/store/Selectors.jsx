import { createSelector } from 'reselect';

export const selectDoctorNames = createSelector(
  state => state.team.members,
  members => members.map(doctor => doctor.name)
);

export const selectDiagnoses = createSelector(
  state => state.clinicSettings.diagnoses,
  diagnoses => diagnoses.map(diagnosis => diagnosis.name)
);

export const selectJobs = createSelector(
  state => state.clinicSettings.jobs,
  jobs => jobs.map(job => job.name)
);

export const selectMedicines = createSelector(
  state => state.clinicSettings.medicines,
  medicines => medicines.map(medicine => medicine.name)
);
