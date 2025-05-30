// AddRecordModal.js
import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { addPatientRecord, updateRecord } from '../../store/slices/patientsSlice'; // Adjust the import path
import {selectDiagnoses, selectDoctorNames, selectJobs, selectMedicines} from '../../store/Selectors'
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing an icon for removing selected items
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { uploadPhoto } from '../../helpers/Helpers';

const AddRecordModal = ({ isOpen, onClose, patientId, record }) => {
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctorNames);
  const diagnoses = useSelector(selectDiagnoses);
  const services = useSelector((state) => state.services.list.map((service) => service.name));
  const jobs = useSelector(selectJobs);
  const medicines = useSelector(selectMedicines);
  const [otherOptionToggle, setOtherOptionToggle] = useState('');
  const [otherOption, setOtherOption] = useState('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [casePhotos, setCasePhotos] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (record) {
    formik.setValues({
        doctorTreating: record.doctorTreating || '',
        dueDate: record.dueDate || '',
        nextAppointmentDate: record.nextAppointmentDate || '',
        service: record.service || '',
        price: record.price || 0,
        additionalNotes: record.additionalNotes || '',
        });
      setSelectedDiagnoses(record.diagnoses || []);
      setSelectedJobs(record.jobs || []);
      setSelectedMedicines(record.medicines || []);
      setCasePhotos(record.casePhotos || []);
    }
  }, [record]);

  const formik = useFormik({
    initialValues: {
        doctorTreating: '',
        dueDate: '',
        nextAppointmentDate: '',
        service: '',
        price: {paid: 0, remaining: 0},
        additionalNotes: '',
      },
    validationSchema: Yup.object({
      doctorTreating: Yup.string().required('Required'),
      service: Yup.string().required('Required'),
      nextAppointmentDate: Yup.date().required('Required'),
      dueDate: Yup.date().required('Required'),
      price: Yup.object({
        paid: Yup.number().required("Paid amount is required"),
        remaining: Yup.number().required("Remaining amount is required"),
      }),
      additionalNotes: Yup.string(),
    }),
    validateOnBlur: false,  // Disable immediate validation on input change
    onSubmit: async (values, { resetForm }) => {
        const recordData = {
            doctorTreating: values.doctorTreating,
            diagnoses: selectedDiagnoses,
            jobs: selectedJobs,
            service: values.service,
            medicines: selectedMedicines,
            casePhotos: casePhotos, // Initialize as an empty array
            dueDate: values.dueDate,
            nextAppointmentDate: values.nextAppointmentDate,
            additionalNotes: values.additionalNotes,
            price: values.price
        };
    
    // Upload photos and store their URLs in recordData
    if (casePhotos.length > 0) {
      try {
        // Initialize the existing URLs
    const existingUrls = (Array.isArray(recordData.casePhotos) ? recordData.casePhotos : []).filter(url => typeof url === 'string')
    // Filter the casePhotos to get only the file objects
    const newPhotos = casePhotos.filter(photo => photo instanceof File); // Keep only File objects    
        // If there are new photos to upload
        if (newPhotos.length > 0) {
          const uploadPromises = await newPhotos.map(photo => uploadPhoto(photo)); // Upload new photos only
          const newPhotoUrls = await Promise.all(uploadPromises); // Wait for all uploads to complete
          // Combine the existing URLs with the newly uploaded URLs
          recordData.casePhotos = [...existingUrls, ...newPhotoUrls]; 
        } else {
          // If no new photos, just use the existing casePhotos
          recordData.casePhotos = existingUrls;
        }
    
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
            const recordId = record?.id
            const actionResult = record ? await dispatch(updateRecord({patientId, recordId, updatedRecordData: recordData})): await dispatch(addPatientRecord({ patientId, recordData }));
            if (record){
                if (updateRecord.fulfilled.match(actionResult)) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Record updated successfully.',
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
            }else{
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
    <AnimatePresence>
        <motion.div
            onClick={() =>handleCloseModal(formik.resetForm)}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
              <motion.div
                        className="bg-table-container-bg rounded-lg p-6 shadow-md w-[80%] z-10 max-h-[90vh] overflow-y-auto scrollbar-hide"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={e=>e.stopPropagation()}
                    >
        <h2 className="text-xl font-bold mb-4">Add Patient Record</h2>
        <form onSubmit={formik.handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-10 w-full'>
            <div>
            <label className="block mb-1">Doctor Treating</label>
            <select
              name="doctorTreating"
              {...formik.getFieldProps('doctorTreating')}
              className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full"
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
              className="border dark:border-transparent p-2 w-full bg-primary-bg"
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
              className="border dark:border-transparent p-2 w-full bg-primary-bg"
            />
            {formik.touched.nextAppointmentDate && formik.errors.nextAppointmentDate ? (
              <div className="text-red-600">{formik.errors.nextAppointmentDate}</div>
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
                {casePhotos?.map((photo, index) => (
                  <div key={index} className="relative mr-2 mb-2">
                    <img
                      src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
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
              <div  className='flex gap-4 justify-between'>
              {/* Paid Field */}
              <div className="mb-3 w-1/2">
                  <label className="block mb-1">Paid</label>
                  <input
                      type="number"
                      {...formik.getFieldProps('price.paid')}
                      className="border dark:border-transparent p-2 w-full bg-primary-bg"
                  />
                  {formik.touched.price?.paid && formik.errors.price?.paid ? (
                      <div className="text-red-600">{formik.errors.price.paid}</div>
                  ) : null}
              </div>

              {/* Remaining Field */}
              <div className="mb-3 w-1/2">
                  <label className="block mb-1">Remaining</label>
                  <input
                      type="number"
                      {...formik.getFieldProps('price.remaining')}
                      className="border dark:border-transparent p-2 w-full bg-primary-bg"
                  />
                  {formik.touched.price?.remaining && formik.errors.price?.remaining ? (
                      <div className="text-red-600">{formik.errors.price.remaining}</div>
                  ) : null}
              </div>
              </div>
          </div>
            </div>

            <div>
            <div className='w-full"'>
                    <label htmlFor="service" className="block font-medium">Service</label>
                    <select
                        name="service"
                        {...formik.getFieldProps('service')}
                        className="border p-2 dark:border-transparent rounded-md w-full bg-primary-bg mb-1"
                    >
                        <option value="">Select Service</option>
                        {services.map((service, index) => (
                            <option key={index} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                        {formik.touched.service && formik.errors.service ? (
                    <p className='text-red-800'>{formik.errors.service}</p>
                ) : null}
                </div>
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
                            className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full mt-2"
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
                    className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full"
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
                            className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full mt-2"
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
                    className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full"
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
                            className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full mt-2"
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
                    className="border dark:border-transparent p-2 rounded-md bg-primary-bg w-full"
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
              className="border dark:border-transparent p-2 w-full bg-primary-bg h-32"
            />
          </div>
            </div>
        </div>
          </div>
          <div className='flex justify-center'>
          <button type="submit" className="mt-4 px-4 py-2 bg-primary-btn text-white rounded">
            Submit
          </button>
          </div>
        </form>
        </motion.div>
        </motion.div>
        </AnimatePresence>
  );
};

export default AddRecordModal;
