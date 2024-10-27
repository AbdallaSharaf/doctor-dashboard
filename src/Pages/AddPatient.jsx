import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../helpers/Axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing an icon for removing selected items
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {addPatient} from '../store/slices/patientsSlice'
import Swal from 'sweetalert2';

const AddPatient = () => {
    const location = useLocation();
    const { patientData } = location.state || {};
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: patientData?.name || '',
        phone: patientData?.phone || '',
        age: patientData?.age || '',
        gender: patientData?.gender || '',
        firstAppointmentDate: '',
        lastAppointmentDate: '',
        doctorTreating: '',
        diagnosis: [],
        jobDone: [],
        medicine: [],
        casePhoto: undefined,  // File upload
        nextAppointmentDate: '',
        additionalNotes: ''
    });
    const dispatch = useDispatch()

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

    const doctors = useSelector(state => state.team.members);
    const diagnoses = useSelector(state => state.clinicSettings.diagnoses);
    const jobs = useSelector(state => state.clinicSettings.jobs);
    const medicines = useSelector(state => state.clinicSettings.medicines);
    const [otherOptionToggle, setOtherOptionToggle] = useState('')
    const [otherOption, setOtherOption] = useState('');

    // Fetch options from Firebase on component mount
    useEffect(() => {
    }, [dispatch]);

    const formik = useFormik({
        initialValues: formData,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log('clicked');
            try {
                // First, check if the phone number already exists
                const existingPatientResponse = await axios.get(`/patients.json?orderBy="phone"&equalTo="${values.phone}"`);
    
                // If the response contains data, the phone number already exists
                if (existingPatientResponse.data && Object.keys(existingPatientResponse.data).length > 0) {
                    // Display an error message if the phone number is already registered
                    Swal.fire({
                        title: 'Phone Number Already Exists',
                        text: 'This phone number is already associated with an existing patient.',
                        icon: 'error',
                    });
                    return; // Exit early to prevent further execution
                }
    
                let casePhotoUrl = '';
                if (formData.casePhoto) {
                    const storageRef = await axios.post('/upload', formData.casePhoto);
                    casePhotoUrl = storageRef.data.url;
                }
    
                // Proceed to add the patient since the phone number doesn't exist
                const patientResponse = await axios.post('/patients.json', {
                    name: values.name,
                    phone: values.phone,
                    age: values.age,
                    gender: values.gender,
                    firstAppointmentDate: values.firstAppointmentDate,
                    lastAppointmentDate: values.lastAppointmentDate,
                });
    
                const patientId = patientResponse.data.name;
    
                await axios.post(`/patients/${patientId}/records.json`, {
                    doctorTreating: values.doctorTreating,
                    diagnosis: formData.diagnosis,
                    jobDone: formData.jobDone,
                    medicine: formData.medicine,
                    casePhoto: casePhotoUrl,
                    nextAppointmentDate: values.nextAppointmentDate,
                    additionalNotes: values.additionalNotes,
                });
    
                Swal.fire({
                    title: 'Good Job!',
                    text: 'Patient was added successfully',
                    icon: 'success',
                });
    
                formik.resetForm();
                navigate(`/patients/patient-details/${values.phone}`);
                console.log('Patient and record added successfully');
            } catch (error) {
                console.error('Error submitting contact form:', error.response ? error.response.data : error);
                Swal.fire({
                    title: 'Failed...',
                    text: 'Oops, something went wrong',
                    icon: 'error',
                });
            }
        }
    });
    
    // Handle adding selected item to an array
    const handleAddSelectedItem = (e, field, customValue = '') => {
        const value = e?.target?.value || customValue;
    
        // Check if user selected "Other"
        if (value === 'other') {
            setOtherOptionToggle(field);  // Toggle custom input visibility
            return;
        }
    
        // If there's a custom value or a standard value selected
        if (value && !formData[field].includes(value)) {
            setFormData((prevData) => ({
                ...prevData,
                [field]: [...prevData[field], value]
            }));
        }
    };
    
    const handleCustomSubmit = (field) => {
        if (otherOption && !formData[field].includes(otherOption)) {
            handleAddSelectedItem(null, field, otherOption);
            setOtherOption('');  // Clear custom input after submission
            setOtherOptionToggle('');  // Hide custom input field
        }
    };

    // Handle removing an item from the array
    const handleRemoveItem = (field, itemToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((item) => item !== itemToRemove)
        }));
    };    

    return (
        <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Add Patient</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Main Patient Data */}
            <div>
                <label htmlFor="name" className="block font-medium">Name</label>
                <input
                    type="text"
                    {...formik.getFieldProps('name')}
                    className={`border p-2 rounded-md w-full ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                />
                {formik.touched.name && formik.errors.name ? (
                    <p className='text-red-800'>{formik.errors.name}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="phone" className="block font-medium">Phone</label>
                <input
                    type="tel"
                    {...formik.getFieldProps('phone')}
                    className={`border p-2 rounded-md w-full ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                />
                {formik.touched.phone && formik.errors.phone ? (
                    <p className='text-red-800'>{formik.errors.phone}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="age" className="block font-medium">Age</label>
                <input
                    type="number"
                    {...formik.getFieldProps('age')}
                    className={`border p-2 rounded-md w-full ${formik.touched.age && formik.errors.age ? 'border-red-500' : ''}`}
                />
                {formik.touched.age && formik.errors.age ? (
                    <p className='text-red-800'>{formik.errors.age}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="gender" className="block font-medium">Gender</label>
                <select
                    name="gender"
                    {...formik.getFieldProps('gender')}
                    className={`border p-2 rounded-md w-full ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : ''}`}
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

            <div>
                <label htmlFor="firstAppointmentDate" className="block font-medium">First Appointment Date & Time</label>
                <input
                    type="datetime-local"
                    {...formik.getFieldProps('firstAppointmentDate')}
                    className={`border p-2 rounded-md w-full ${formik.touched.firstAppointmentDate && formik.errors.firstAppointmentDate ? 'border-red-500' : ''}`}
                />
                {formik.touched.firstAppointmentDate && formik.errors.firstAppointmentDate ? (
                    <p className='text-red-800'>{formik.errors.firstAppointmentDate}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="lastAppointmentDate" className="block font-medium">Last Appointment Date & Time</label>
                <input
                    type="datetime-local"
                    {...formik.getFieldProps('lastAppointmentDate')}
                    className={`border p-2 rounded-md w-full ${formik.touched.lastAppointmentDate && formik.errors.lastAppointmentDate ? 'border-red-500' : ''}`}
                />
                {formik.touched.lastAppointmentDate && formik.errors.lastAppointmentDate ? (
                    <p className='text-red-800'>{formik.errors.lastAppointmentDate}</p>
                ) : null}
            </div>

                    {/* Dropdown Fields */}
                    <div>
                    <label htmlFor="doctorTreating" className="block font-medium">Doctor Treating</label>
                    <select
                        name="doctorTreating"
                        {...formik.getFieldProps('doctorTreating')}
                        className="border p-2 rounded-md w-full"
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.name}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                        {formik.touched.doctorTreating && formik.errors.doctorTreating ? (
                    <p className='text-red-800'>{formik.errors.doctorTreating}</p>
                ) : null}
                </div>

               
                {/* Diagnosis Dropdown */}
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
                            onBlur={(e) => handleCustomSubmit('diagnosis')}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('diagnosis')}
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
                    {...formik.getFieldProps('diagnosis')}
                    onChange={(e) => handleAddSelectedItem(e, 'diagnosis')}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Diagnosis</option>
                    {diagnoses.map((diagnosis) => (
                        <option key={diagnosis.id} value={diagnosis.name}>
                            {diagnosis.name}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected diagnoses */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {formData.diagnosis.map((diag, index) => (
                            <span key={index} className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded">
                                {diag}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem('diagnosis', diag)}
                                />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Medicine Dropdown */}
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
                            onBlur={(e) => handleCustomSubmit('jobDone')}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('jobDone')}
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
                    {...formik.getFieldProps('jobDone')}
                    onChange={(e) => handleAddSelectedItem(e, 'jobDone')}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Job</option>
                    {jobs.map((job) => (
                        <option key={job.id} value={job.name}>
                            {job.name}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected jobs */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {formData.jobDone.map((job, index) => (
                            <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {job}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem('jobDone', job)}
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
                            onBlur={(e) => handleCustomSubmit('medicine')}
                            className="border p-2 rounded-md w-full mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleCustomSubmit('medicine')}
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
                    {...formik.getFieldProps('medicine')}
                    onChange={(e) => handleAddSelectedItem(e, 'medicine')}
                    className="border p-2 rounded-md w-full"
                >
                    <option value="">Select Medicine</option>
                    {medicines.map((medicine) => (
                        <option key={medicine.id} value={medicine.name}>
                            {medicine.name}
                        </option>
                    ))}
                    <option value="other">Other</option>
                </select>}
                    {/* Display selected medicines */}
                    <div className="mt-2 space-x-2 flex flex-wrap">
                        {formData.medicine.map((med, index) => (
                            <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {med}
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="h-4 w-4 ml-2 cursor-pointer text-red-500"
                                    onClick={() => handleRemoveItem('medicine', med)}
                                />
                            </span>
                        ))}
                    </div>
                </div>


            <div>
                <label htmlFor="nextAppointmentDate" className="block font-medium">Next Appointment Date</label>
                <input
                    type="datetime-local"
                    {...formik.getFieldProps('nextAppointmentDate')}
                    className={`border p-2 rounded-md w-full ${formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? 'border-red-500' : ''}`}
                />
                {formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? (
                    <p className='text-red-800'>{formik.errors.nextAppointmentDate}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="additionalNotes" className="block font-medium">Additional Notes</label>
                <textarea
                    name="additionalNotes"
                    {...formik.getFieldProps('additionalNotes')}
                    className={`border p-2 rounded-md w-full ${formik.touched.additionalNotes && formik.errors.additionalNotes ? 'border-red-500' : ''}`}
                />
                {formik.touched.additionalNotes && formik.errors.additionalNotes ? (
                    <p className='text-red-800'>{formik.errors.additionalNotes}</p>
                ) : null}
            </div>

            <div>
                <label htmlFor="casePhoto" className="block font-medium">Case Photo</label>
                <input
                    type="file"
                    {...formik.getFieldProps('casePhoto')}
                    value={formik.values.casePhoto || ''}  // Provide an empty string instead of null
                    className={`border p-2 rounded-md w-full ${formik.touched.casePhoto && formik.errors.casePhoto ? 'border-red-500' : ''}`}
                />
                {formik.touched.casePhoto && formik.errors.casePhoto ? (
                    <p className='text-red-800'>{formik.errors.casePhoto}</p>
                ) : null}
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Add Patient
            </button>
        </form>
        </div>
    );
};

export default AddPatient;
