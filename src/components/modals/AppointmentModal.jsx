import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion components

const formikInitialValues = {
    name: '',
    phone: '',
    age: '',
    gender: '',
    problem: '',
    date: '',
    time: '',
}

const formikValidationSchema = {
    name: Yup.string()
                .matches(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على حروف عربية أو إنجليزية فقط')
                .min(3, 'الاسم يجب أن يكون على الأقل ٣ أحرف')
                .required('الاسم مطلوب'),
            phone: Yup.string()
                .matches(/^\+?[0-9]{10,15}$/, 'رقم الهاتف غير صحيح')
                .required('رقم الهاتف مطلوب'),
            age: Yup.number()
                .min(1, 'يجب أن يكون العمر أكبر من 0')
                .max(120, 'العمر غير صحيح')
                .required('العمر مطلوب'),
            gender: Yup.string()
                .oneOf(['male', 'female'], 'يرجى اختيار الجنس')
                .required('الجنس مطلوب'),
            problem: Yup.string().required('الوصف مطلوب'),
            date: Yup.date().required('Appointment date is required').nullable(),
            time: Yup.string().required('Appointment time is required'),
}

const AppointmentModal = ({ isModalOpen, setIsModalOpen, handleSubmit }) => {
    const formik = useFormik({
        initialValues: formikInitialValues,
        validationSchema: Yup.object(formikValidationSchema),
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
            {/* Wrap modal content with AnimatePresence to manage animations */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        onClick={handleCloseModal}
                        className="fixed bg-black z-10 bg-opacity-50 inset-0 flex w-screen h-screen items-center justify-center"
                        initial={{ opacity: 0 }}      // Initial state before animation
                        animate={{ opacity: 1 }}      // Animate to this state
                        exit={{ opacity: 0 }}         // Exit animation
                    >
                        <motion.div
                            className="bg-white p-5 rounded shadow-md w-[90%] max-w-[400px] h-[90%] z-50 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
                            initial={{ scale: 0.8, opacity: 0 }}  // Modal starts small and transparent
                            animate={{ scale: 1, opacity: 1 }}    // Animates to full size and opacity
                            exit={{ scale: 0.8, opacity: 0 }}     // Animates back to small and transparent on close
                            transition={{ duration: 0.3 }}        // Control the timing of the animation
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
                                className="border border-gray-300 rounded p-2 w-full mb-4"
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
                                className="border border-gray-300 rounded p-2 w-full mb-4"
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
                                className="border border-gray-300 rounded  p-2 w-full mb-4"
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
                                className="border border-gray-300 rounded p-2 w-full mb-4"
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
                                className="border border-gray-300 rounded p-2 w-full mb-4"
                            />
                            {formik.touched.time && formik.errors.time ? (
                                <div className="text-red-600 mb-2">{formik.errors.time}</div>
                            ) : null}

                            {/* Gender Selection */}
                            <div className="flex space-x-4 mb-2">
                                <button
                                    type="button"
                                    className={`w-full px-2 py-3 rounded border transition-all duration-100 ease-in-out ${formik.values.gender === 'male' ? 'bg-primary-btn text-secondary-text' : 'bg-gray-200 text-primary-text'}`}
                                    onClick={() => formik.setFieldValue('gender', 'male')}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    className={`w-full px-2 py-3 transition-all duration-100 ease-in-out rounded border ${formik.values.gender === 'female' ? 'bg-primary-btn text-secondary-text' : 'bg-gray-200 text-primary-text'}`}
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
                                className="border rounded mb-2 p-2 w-full size-32"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.problem}
                                placeholder='Description of the problem'
                            />
                            {formik.touched.problem && formik.errors.problem ? (
                                <div className="text-red-600 mb-2">{formik.errors.problem}</div>
                            ) : null}
                            <div className='flex justify-center gap-5'>
                            <button type='submit' onClick={handleCloseModal} className=" text-primary-text hover:bg-gray-100 rounded w-40 p-2">
                                Cancel
                            </button>
                            <button onClick={formik.handleSubmit} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 w-40 ">
                                Save
                            </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppointmentModal;
