// AddRecordModal.js
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { addPatientRecord } from '../../store/slices/patientsSlice'; // Adjust the import path
import {selectDiagnoses, selectDoctorNames, selectJobs, selectMedicines} from '../../store/Selectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing an icon for removing selected items
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../../helpers/Helpers';

const AddRecordModal = ({ isOpen, onClose, patientId, record }) => {
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctorNames);
  const diagnoses = useSelector(selectDiagnoses);
  const jobs = useSelector(selectJobs);
  const medicines = useSelector(selectMedicines);
  const [otherOptionToggle, setOtherOptionToggle] = useState('')
  const [otherOption, setOtherOption] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [casePhotos, setCasePhotos] = useState([]);

    console.log(record)
  const formik = useFormik({
    initialValues: {
      doctorTreating: record.doctorTreating || '',
      casePhotos: record.casePhotos || '',
      dueDate: record.dueDate || '',
      nextAppointmentDate: record.nextAppointmentDate || '',
      price: record.price || 0,
      additionalNotes: record.additionalNotes || '',
    },
    validationSchema: Yup.object({
      doctorTreating: Yup.string().required('Required'),
      nextAppointmentDate: Yup.date().required('Required'),
      dueDate: Yup.date().required('Required'),
      price: Yup.number().required('Required'),
      additionalNotes: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
        const recordData = {
            doctorTreating: values.doctorTreating,
            diagnoses: selectedDiagnoses,
            jobs: selectedJobs,
            medicines: selectedMedicines,
            casePhotos: [], // Initialize as an empty array
            dueDate: values.dueDate,
            nextAppointmentDate: values.nextAppointmentDate,
            additionalNotes: values.additionalNotes,
        };
    
    // Upload photos and store their URLs in recordData
      if (casePhotos.length > 0) {
        try {
          const uploadPromises = casePhotos.map(photo => uploadPhoto(photo)); // Call uploadPhoto
          const casePhotoUrls = await Promise.all(uploadPromises); // Wait for all uploads to complete
          console.log('casePhotoUrls')
          recordData.casePhotos = casePhotoUrls; // Add the URLs to recordData
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to upload case photos.',
            icon: 'error',
          });
          return; // Exit if the photo upload fails
        }
      }

    
        try {
            const actionResult = await dispatch(addPatientRecord({ patientId, recordData }));
            
            if (addPatientRecord.fulfilled.match(actionResult)) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Record added successfully.',
                    icon: 'success',
                });
    
                resetForm();
                handleCloseModal(resetForm);
            } else {
                Swal.fire({
                    title: 'Failed',
                    text: actionResult.payload || 'Something went wrong!',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error adding patient record:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add patient record. Please try again.',
                icon: 'error',
            });
        }
    },})    
  
  const handleCloseModal = (resetForm) =>{
    resetForm()
    setSelectedDiagnoses([]); // Clear selections after submission
    setSelectedJobs([]);
    setCasePhotos([]); // Clear photos after submission
    setSelectedMedicines([]);
    onClose(); // Close modal after submitting
  }

  const handleAddSelectedItem = (targetValue, field ,setter, selectedItems, customValue = '') => {
    const value = targetValue || customValue;

    // Check if user selected "Other"
    if (value === 'other') {
        setOtherOptionToggle(field);  // Toggle custom input visibility
        return;
    }

    // If there's a custom value or a standard value selected
    if (value && !selectedItems.includes(value)) {
        setter([...selectedItems, value]);
    }
};
  
  const handleCustomSubmit = (field, setter, selectedItems) => {
    if (otherOption && !selectedItems.includes(otherOption)) {
        handleAddSelectedItem(null, field, setter, selectedItems, otherOption);
        setOtherOption('');  // Clear custom input after submission
        setOtherOptionToggle('');  // Hide custom input field
    }
};


const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + casePhotos.length <= 10) {
      setCasePhotos([...casePhotos, ...files]);
    } else {
      Swal.fire({
        title: 'Limit Exceeded',
        text: 'You can upload up to 10 photos only.',
        icon: 'warning',
      });
    }
  };
  
// Handle removing an item from the array
const handleRemoveItem = (setter, selectedItems, itemToRemove) => {
    setter(selectedItems.filter((item) => item !== itemToRemove));
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => handleCloseModal(formik.resetForm)}></div>
      <div className="bg-white rounded-lg p-6 shadow-md w-[80%] z-10">
        <h2 className="text-xl font-bold mb-4">Add Patient Record</h2>
        <form onSubmit={formik.handleSubmit}>
            <div className='grid grid-cols-2 gap-10 w-full'>
            <div>
            <label className="block mb-1">Doctor Treating</label>
            <select
              name="doctorTreating"
              {...formik.getFieldProps('doctorTreating')}
              className="border p-2 rounded-md w-full"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
            {formik.touched.doctorTreating && formik.errors.doctorTreating ? (
              <div className="text-red-600">{formik.errors.doctorTreating}</div>
            ) : null}

            <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              {...formik.getFieldProps('dueDate')}
              className="border p-2 w-full"
            />
            {formik.touched.dueDate && formik.errors.dueDate ? (
              <div className="text-red-600">{formik.errors.dueDate}</div>
            ) : null}
          </div>
            <div>
            <label className="block mb-1">Next Appointment Date</label>
            <input
              type="date"
              {...formik.getFieldProps('nextAppointmentDate')}
              className="border p-2 w-full"
            />
            {formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? (
              <div className="text-red-600">{formik.errors.nextAppointmentDate}</div>
            ) : null}
          </div>
          <div>
            <label className="block mb-1">Case Photos (up to 10)</label>
            <input
                name=''
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="border p-2 rounded-md w-full"
            />
            <div className="mt-2 flex flex-wrap">
                {casePhotos.map((photo, index) => (
                <div key={index} className="relative mr-2 mb-2">
                    <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index}`}
                    className="h-20 w-20 object-cover rounded-md"
                    />
                    <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute top-0 right-0 h-4 w-4 cursor-pointer text-red-500"
                    onClick={() => handleRemoveItem(setCasePhotos, casePhotos, photo)}
                    />
                </div>
                ))}
            </div>
            </div>
            <div>
                <label className="block mb-1">Price</label>
                <input
                type="number"
                {...formik.getFieldProps('price')}
                className="border p-2 w-full"
                />
                {formik.touched.price && formik.errors.price ? (
                <div className="text-red-600">{formik.errors.price}</div>
                ) : null}
            </div>
            </div>

            <div>

                <div>
                    <label htmlFor="diagnosis" className="block font-medium">Select Diagnosis</label>
                   {/* Show custom input field if "Other" is selected */}
                   {otherOptionToggle==='diagnosis' ? (
                        <div className='flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Enter custom diagnosis"
                            value={otherOption}
                            onChange={(e) => setOtherOption(e.target.value)}
                            onBlur={(e) => handleCustomSubmit('diagnosis', setSelectedDiagnoses, selectedDiagnoses)}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('diagnosis', setSelectedDiagnoses, selectedDiagnoses)}
                            className="bg-blue-500 text-white p-2 rounded-md mt-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setOtherOptionToggle('')}
                            className="bg-red-500 text-white p-2 rounded-md mt-2"
                        >
                            Discard
                        </button>
                    </div>
                    ):<select
                    name="diagnosis"
                    onChange={(e) => handleAddSelectedItem(e.target.value,'diagnosis',setSelectedDiagnoses, selectedDiagnoses)}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Diagnosis</option>
                    {diagnoses.map((diagnosis, index) => (
                        <option key={index} value={diagnosis}>
                            {diagnosis}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected diagnoses */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {selectedDiagnoses.map((diag, index) => (
                            <span key={index} className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded">
                                {diag}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem(setSelectedDiagnoses, selectedDiagnoses, diag)}
                                />
                            </span>
                        ))}
                    </div>
                </div>
                  {/* Medicine Dropdown */}
                  <div>
                    <label htmlFor="medicine" className="block font-medium">Select Medicine</label>
                   {/* Show custom input field if "Other" is selected */}
                   {otherOptionToggle==='medicine' ? (
                        <div className='flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Enter custom medicine"
                            value={otherOption}
                            onChange={(e) => setOtherOption(e.target.value)}
                            onBlur={() => handleCustomSubmit('medicine', setSelectedMedicines, selectedMedicines)}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('medicine', setSelectedMedicines, selectedMedicines)}
                            className="bg-blue-500 text-white p-2 rounded-md mt-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setOtherOptionToggle('')}
                            className="bg-red-500 text-white p-2 rounded-md mt-2"
                        >
                            Discard
                        </button>
                    </div>
                    ):<select
                    name="medicine"
                    onChange={(e) => handleAddSelectedItem(e.target.value,'medicine',setSelectedMedicines, selectedMedicines)}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Medicine</option>
                    {medicines.map((medicine, index) => (
                        <option key={index} value={medicine}>
                            {medicine}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected medicines */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {selectedMedicines.map((med, index) => (
                            <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {med}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem(setSelectedMedicines,selectedMedicines, med)}
                                />
                            </span>
                        ))}
                    </div>
                </div>
        <div>
        <label htmlFor="jobDone" className="block font-medium">Select Job</label>
                   {/* Show custom input field if "Other" is selected */}
                   {otherOptionToggle==='jobDone' ? (
                        <div className='flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Enter custom job"
                            value={otherOption}
                            onChange={(e) => setOtherOption(e.target.value)}
                            onBlur={() => handleCustomSubmit('jobDone', setSelectedJobs, selectedJobs)}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('jobDone', setSelectedJobs, selectedJobs)}
                            className="bg-blue-500 text-white p-2 rounded-md mt-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setOtherOptionToggle('')}
                            className="bg-red-500 text-white p-2 rounded-md mt-2"
                        >
                            Discard
                        </button>
                    </div>
                    ):<select
                    name="jobDone"
                    onChange={(e) => handleAddSelectedItem(e.target.value,'jobDone',setSelectedJobs, selectedJobs)}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Job</option>
                    {jobs.map((job, index) => (
                        <option key={index} value={job}>
                            {job}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected jobs */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {selectedJobs.map((job, index) => (
                            <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {job}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem(setSelectedJobs, selectJobs, job)}
                                />
                            </span>
                        ))}
                    </div>
          <div>
            <label className="block mb-1">Additional Notes</label>
            <textarea
              {...formik.getFieldProps('additionalNotes')}
              className="border p-2 w-full h-32"
            />
          </div>
            </div>
        </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
