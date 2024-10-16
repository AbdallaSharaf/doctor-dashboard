import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AppointmentModal = ({ isModalOpen, setIsModalOpen, handleSubmit }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            age: '',
            gender: '',
            problem: '',
            date: '',
            time: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Patient name is required'),
            phone: Yup.string().required('Phone number is required'),
            age: Yup.number().required('Age is required').positive().integer(),
            gender: Yup.string().oneOf(['male', 'female'], 'Please select a gender').required('Gender is required'),
            problem: Yup.string().required('Description is required'),
            date: Yup.date().required('Appointment date is required').nullable(),
            time: Yup.string().required('Appointment time is required'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
            formik.resetForm();
            setIsModalOpen(false);
        },
    });

    // Function to handle closing the modal and resetting the form
    const handleCloseModal = () => {
        formik.resetForm(); // Reset form when closing the modal
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <div onClick={handleCloseModal} className="fixed bg-black z-10 bg-opacity-25 inset-0 flex w-screen h-screen items-center justify-center">
                    <div
                        className="bg-white p-5 rounded shadow-md w-[90%] h-[90%] z-50 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
                    >
                        <h3 className="text-lg font-bold mb-4">Add New Appointment</h3>

                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Patient Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded mb-2 p-2 w-full"
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-600 mb-2">{formik.errors.name}</div>
                        ) : null}

                        {/* Phone Input */}
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded mb-2 p-2 w-full"
                        />
                        {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-red-600 mb-2">{formik.errors.phone}</div>
                        ) : null}

                        {/* Age Input */}
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded mb-2 p-2 w-full"
                        />
                        {formik.touched.age && formik.errors.age ? (
                            <div className="text-red-600 mb-2">{formik.errors.age}</div>
                        ) : null}

                        {/* Date Input */}
                        <input
                            type="date"
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            className="border border-gray-300 rounded mb-2 p-2 w-full"
                        />
                        {formik.touched.date && formik.errors.date ? (
                            <div className="text-red-600 mb-2">{formik.errors.date}</div>
                        ) : null}

                        {/* Time Input */}
                        <input
                            type="time"
                            name="time"
                            value={formik.values.time}
                            onChange={formik.handleChange}
                            className="border border-gray-300 rounded mb-2 p-2 w-full"
                        />
                        {formik.touched.time && formik.errors.time ? (
                            <div className="text-red-600 mb-2">{formik.errors.time}</div>
                        ) : null}

                        {/* Gender Selection */}
                        <div className="flex space-x-4 mb-2">
                            <button
                                type="button"
                                className={`w-full px-2 py-3 rounded border transition-all duration-100 ease-in-out ${formik.values.gender === 'male' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
                                onClick={() => formik.setFieldValue('gender', 'male')}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                className={`w-full px-2 py-3 transition-all duration-100 ease-in-out rounded border ${formik.values.gender === 'female' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
                                onClick={() => formik.setFieldValue('gender', 'female')}
                            >
                                Female
                            </button>
                        </div>
                        {formik.touched.gender && formik.errors.gender ? (
                            <div className="text-red-600 mb-2">{formik.errors.gender}</div>
                        ) : null}

                        {/* Problem Textarea */}
                        <textarea
                            name="problem"
                            className="border rounded mb-2 p-2 w-full"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.problem}
                            placeholder='Description of the problem'
                        />
                        {formik.touched.problem && formik.errors.problem ? (
                            <div className="text-red-600 mb-2">{formik.errors.problem}</div>
                        ) : null}

                        <button onClick={formik.handleSubmit} className="bg-green-600 text-white rounded p-2 mr-2">
                            Add Appointment
                        </button>
                        <button type='submit' onClick={handleCloseModal} className="bg-red-600 mb-2 text-white rounded p-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppointmentModal;
