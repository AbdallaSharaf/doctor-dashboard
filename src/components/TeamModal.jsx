import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

const TeamModal = ({ isModalOpen, setIsModalOpen, handleAddMember }) => {
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const formik = useFormik({
        initialValues: {
            name: '',
            job: '',
            description: '',
            image: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required'),
            job: Yup.string()
                .required('Job is required'),
            description: Yup.string()
                .required('Description is required'),
            image: Yup.string().required('Image is required')
        }),
        onSubmit: (values) => {
            console.log(values)
            handleAddMember(values);
        },
    });

    const handleCloseModal = () => {
        formik.resetForm();
        setImagePreview(null); // Reset the image preview on close
        setIsModalOpen(false);
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    onClick={handleCloseModal}
                    className="fixed bg-black z-10 bg-opacity-50 inset-0 flex w-screen h-screen items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-5 rounded shadow-md w-[90%] max-w-[400px] h-[90%] z-50 overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-lg font-bold mb-6">Add New Team Member</h3>

                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-600 mb-2">{formik.errors.name}</div>
                        )}

                        {/* Job Input */}
                        <input
                            type="text"
                            name="job"
                            placeholder="Job"
                            value={formik.values.job}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.job && formik.errors.job && (
                            <div className="text-red-600 mb-2">{formik.errors.job}</div>
                        )}

                        {/* Description Input */}
                        <textarea
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-600 mb-2">{formik.errors.description}</div>
                        )}

                        {/* Image Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        formik.setFieldValue('image', reader.result);
                                        setImagePreview(reader.result); // Set the image preview
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="mb-4" // Add class for styling
                        />
                        {formik.touched.image && formik.errors.image && (
                            <div className="text-red-600 mb-2">{formik.errors.image}</div>
                        )}

                        {/* Image Preview */}
                        {imagePreview ? (
                            <div className="mb-4">
                                <img src={imagePreview} alt="Preview" className="max-w-[60%] h-auto mx-auto rounded mb-2" />
                            </div>
                        ) : <div className="mb-4 max-w-[60%] h-52"></div>}

                        <div className="flex justify-center gap-5 ">
                            <button type='reset' onClick={handleCloseModal} className="text-primary-text hover:bg-gray-100 rounded w-40 p-2">
                                Cancel
                            </button>
                            <button type='submit' onClick={formik.handleSubmit} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 w-40">
                                Save
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeamModal;
