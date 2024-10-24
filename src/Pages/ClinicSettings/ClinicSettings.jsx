import React from 'react';
import JobOptions from './JobOptions';
import MedicineOptions from './MedicineOptions';
import DiagnosisOptions from './DiagnosisOptions';

const ClinicSettings = () => {
    return (
        <div>
            <h1>Clinic Settings</h1>
            <JobOptions />
            <MedicineOptions />
            <DiagnosisOptions />
        </div>
    );
};

export default ClinicSettings;
