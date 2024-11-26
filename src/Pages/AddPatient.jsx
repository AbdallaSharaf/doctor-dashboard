import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../helpers/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing an icon for removing selected items
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {addPatient} from '../store/slices/patientsSlice'
import {selectDiagnoses, selectDoctorNames, selectJobs, selectMedicines} from '../store/Selectors'
import { motion, AnimatePresence } from 'framer-motion';


import Swal from 'sweetalert2';

// List of Egyptian cities
const egyptianCities = [
    "Cairo", "Alexandria", 'Tanta'
];

const AddPatient = ({isModalOpen, onClose, patientData = {}}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const doctors = useSelector(selectDoctorNames);
    const diagnoses = useSelector(selectDiagnoses);
    const jobs = useSelector(selectJobs);
    const medicines = useSelector(selectMedicines);
    const patients = useSelector((state) => state.patients.list);
    const [otherOptionToggle, setOtherOptionToggle] = useState('')
    const [otherOption, setOtherOption] = useState('');
    
    const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [casePhotos, setCasePhotos] = useState([]);
    const fileInputRef = useRef(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        phone: Yup.string().matches(/^[0-9]+$/, 'Phone number must be numeric').required('Phone is required'),
        age: Yup.number().required('Age is required').min(0, 'Age must be a positive number'),
        gender: Yup.string().required('Gender is required'),
        firstAppointmentDate: Yup.date().required('First Appointment Date is required'),
        lastAppointmentDate: Yup.date().required('Last Appointment Date is required'),
        doctorTreating: Yup.string().required('Doctor treating is required'),
        nextAppointmentDate: Yup.date().required('Next appointment date is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: patientData?.name || '',
            phone: patientData?.phone || '',
            age: patientData?.age || '',
            gender: patientData?.gender || '',
            firstAppointmentDate: '',
            lastAppointmentDate: '',
            city: '',
            doctorTreating: '',
            diagnosis: [],
            jobDone: [],
            medicine: [],
            casePhoto: undefined,  // File upload
            nextAppointmentDate: '',
            additionalNotes: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                 // Check if the phone number already exists in the patients list
                const existingPatient = patients.find(patient => patient.phone === values.phone);
                
                if (existingPatient) {
                    Swal.fire({
                        title: 'Phone Number Already Exists',
                        text: 'This phone number is already associated with an existing patient.',
                        icon: 'error',
                    });
                    return;
                }
    
                let casePhotoUrl = '';
                if (values.casePhoto) {
                    const storageRef = await axios.post('/upload', values.casePhoto);
                    casePhotoUrl = storageRef.data.url;
                }
    
                // Dispatch addPatient action with both patient data and record data
                const actionResult = await dispatch(addPatient({
                    patientData: {
                        name: values.name,
                        phone: values.phone,
                        age: values.age,
                        gender: values.gender,
                        firstAppointmentDate: values.firstAppointmentDate,
                        lastAppointmentDate: values.lastAppointmentDate,
                        city: values.city,
                    },
                    recordData: {
                            doctorTreating: values.doctorTreating,
                            diagnosis: selectedDiagnoses,
                            jobDone: selectedJobs,
                            medicine: selectedMedicines,
                            casePhoto: casePhotoUrl,
                            nextAppointmentDate: values.nextAppointmentDate,
                            additionalNotes: values.additionalNotes,
                        }
                }));
    
                // Handle success or failure of addPatient action
                if (addPatient.fulfilled.match(actionResult)) {
                    const newPatientId = actionResult.payload.id; // Now you can access the ID correctly
        
                    Swal.fire({
                        title: 'Good Job!',
                        text: 'Patient was added successfully',
                        icon: 'success',
                    });
        
                    resetForm();
                    setSelectedDiagnoses([]);
                    setSelectedJobs([]);
                    setCasePhotos([]); // Clear photos after submission
                    setSelectedMedicines([]);
                    navigate(`/patients/patient-details/${newPatientId}`);
                    console.log('Patient and record added successfully');
                } else {
                    // Handle the case where the action was rejected
                    Swal.fire({
                        title: 'Failed...',
                        text: 'Oops, something went wrong: ' + actionResult.payload,
                        icon: 'error',
                    });
                }
        
            } catch (error) {
                console.error('Error submitting contact form:', error.response ? error.response.data : error);
                Swal.fire({
                    title: 'Failed...',
                    text: 'Oops, something went wrong',
                    icon: 'error',
                });
            }
        },
    });
    
    
    // Handle adding selected item to an array
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

    return (
    <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    onClick={() => onClose(false)}
                    className="fixed bg-black z-40 bg-opacity-15 inset-0 flex w-screen h-screen items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-table-container-bg p-5 rounded shadow-md w-[90%] max-w-[400px] h-[90%] z-50 overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
            <h2 className="text-lg font-semibold mb-6">Add Patient</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-5 overflow-hidden">
            {/* Main Patient Data */}
            <div className=''>
                <label htmlFor="name" className="block font-medium">Name</label>
                <input
                    type="text"
                    {...formik.getFieldProps('name')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                />
                {formik.touched.name && formik.errors.name ? (
                    <p className='text-red-800'>{formik.errors.name}</p>
                ) : null}
            </div>

            <div className=''>
                <label htmlFor="phone" className="block font-medium">Phone</label>
                <input
                    type="tel"
                    {...formik.getFieldProps('phone')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                />
                {formik.touched.phone && formik.errors.phone ? (
                    <p className='text-red-800'>{formik.errors.phone}</p>
                ) : null}
            </div>
            <div className=''>
                <label htmlFor="age" className="block font-medium">Age</label>
                <input
                    type="number"
                    {...formik.getFieldProps('age')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.age && formik.errors.age ? 'border-red-500' : ''}`}
                />
                {formik.touched.age && formik.errors.age ? (
                    <p className='text-red-800'>{formik.errors.age}</p>
                ) : null}
            </div>
            <div className=''>
                <label htmlFor="gender" className="block font-medium">Gender</label>
                <select
                    name="gender"
                    {...formik.getFieldProps('gender')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : ''}`}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender ? (
                    <p className='text-red-800'>{formik.errors.gender}</p>
                ) : null}
            </div>

            <div className=''>
                <label htmlFor="firstAppointmentDate" className="block font-medium">First Appointment Date & Time</label>
                <input
                    type="date"
                    {...formik.getFieldProps('firstAppointmentDate')}
                    className={`border h-[38px] p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.firstAppointmentDate && formik.errors.firstAppointmentDate ? 'border-red-500' : ''}`}
                />
                {formik.touched.firstAppointmentDate && formik.errors.firstAppointmentDate ? (
                    <p className='text-red-800'>{formik.errors.firstAppointmentDate}</p>
                ) : null}
            </div>

            <div className=''>
                <label htmlFor="city" className="block font-medium">City</label>
                <select
                    {...formik.getFieldProps('city')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.city && formik.errors.city ? 'border-red-500' : ''}`}
                >
                    <option value="">Select a city</option>
                    {egyptianCities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                    <option value="">Other</option>
                </select>
                {formik.touched.city && formik.errors.city ? (
                    <p className='text-red-800'>{formik.errors.city}</p>
                ) : null}
            </div>
                    {/* Dropdown Fields */}
                    <div className=''>
                    <label htmlFor="doctorTreating" className="block font-medium">Doctor Treating</label>
                    <select
                        name="doctorTreating"
                        {...formik.getFieldProps('doctorTreating')}
                        className="border p-2 dark:border-transparent rounded-md w-full bg-primary-bg"
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor, index) => (
                            <option key={index} value={doctor}>
                                {doctor}
                            </option>
                        ))}
                    </select>
                        {formik.touched.doctorTreating && formik.errors.doctorTreating ? (
                    <p className='text-red-800'>{formik.errors.doctorTreating}</p>
                ) : null}
                </div>
                <div className=''>
                <label htmlFor="nextAppointmentDate" className="block font-medium">Next Appointment Date</label>
                <input
                    type="datetime-local"
                    {...formik.getFieldProps('nextAppointmentDate')}
                    className={`border p-2 h-[38px] rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? 'border-red-500' : ''}`}
                />
                {formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? (
                    <p className='text-red-800'>{formik.errors.nextAppointmentDate}</p>
                ) : null}
            </div>
                {/* Diagnosis Dropdown */}
                <div className=''>
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
                            className="border p-2 rounded-md w-full dark:border-transparent bg-primary-bg mt-2"
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
                    className="border p-2 dark:border-transparent rounded-md w-full bg-primary-bg"
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
                <div className=''>
                    <label htmlFor="jobDone" className="block font-medium">Select Job</label>
                   {/* Show custom input field if "Other" is selected */}
                   {otherOptionToggle==='jobDone' ? (
                        <div className='flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Enter custom job"
                            value={otherOption}
                            onChange={(e) => setOtherOption(e.target.value)}
                            onBlur={(e) => handleCustomSubmit('jobDone', setSelectedJobs, selectedJobs)}
                            className="border p-2 rounded-md w-full dark:border-transparent bg-primary-bg mt-2"
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
                    className="border p-2 dark:border-transparent rounded-md w-full bg-primary-bg"
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
                                    onClick={() => handleRemoveItem(setSelectedJobs, selectedJobs, job)}
                                    />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Medicine Dropdown */}
                <div className=''>
                    <label htmlFor="medicine" className="block font-medium">Select Medicine</label>
                   {/* Show custom input field if "Other" is selected */}
                   {otherOptionToggle==='medicine' ? (
                        <div className='flex justify-between items-center'>
                        <input
                            type="text"
                            placeholder="Enter custom medicine"
                            value={otherOption}
                            onChange={(e) => setOtherOption(e.target.value)}
                            onBlur={(e) => handleCustomSubmit('medicine', setSelectedMedicines, selectedMedicines)}
                            className="border p-2 rounded-md w-full dark:border-transparent bg-primary-bg mt-2"
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
                    className="border p-2 rounded-md w-full bg-primary-bg dark:border-transparent"
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

            <div className=''>
                <label htmlFor="additionalNotes" className="block font-medium">Additional Notes</label>
                <textarea
                    name="additionalNotes"
                    {...formik.getFieldProps('additionalNotes')}
                    className={`border p-2 rounded-md w-full dark:border-transparent bg-primary-bg ${formik.touched.additionalNotes && formik.errors.additionalNotes ? 'border-red-500' : ''}`}
                />
                {formik.touched.additionalNotes && formik.errors.additionalNotes ? (
                    <p className='text-red-800'>{formik.errors.additionalNotes}</p>
                ) : null}
            </div>
            <div className=''>
            <label className="flex items-center gap-3 mb-1">
                Case Photos (up to 10)
                <div className="font-bold text-2xl hover:opacity-60" onClick={() => fileInputRef.current.click()}>+</div>
            </label>
                <div className="mt-2 flex flex-wrap">
                <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                />
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
            <div className='w-full flex justify-center pt-5'>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md mx-auto w-80">
                Add Patient
            </button>
            </div>
        </form>
        </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
    )
};

export default AddPatient;
