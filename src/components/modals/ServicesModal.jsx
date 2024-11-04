import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPhoto } from '../../helpers/Helpers'; // Adjust based on your upload logic
import { useSelector } from 'react-redux';

const ServiceModal = ({ isModalOpen, setIsModalOpen, handleAddService }) => {
    const [iconPreview, setIconPreview] = useState(null); // State for icon preview
    const existingServices = useSelector(state => state.services.list)
    const formik = useFormik({
        initialValues: {
            name: '',
            shortDescription: '',
            longDescription: '',
            icon: '', // This will be for the uploaded icon
            parentServiceId: '' // For sub-services, select from existing services
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            shortDescription: Yup.string().required('Short description is required'),
            longDescription: Yup.string().required('Long description is required'),
            icon: Yup.string().required('Icon is required'),
            parentServiceId: Yup.string() // Optional for main services
        }),
        onSubmit: async (values) => {
            try {
                const iconUrl = await uploadPhoto(formik.values.icon); // Upload icon
                const newService = {
                    name: values.name,
                    shortDescription: values.shortDescription,
                    longDescription: values.longDescription,
                    icon: iconUrl, // Store the URL in the new service object
                    ...(values.parentServiceId && { parentServiceId: values.parentServiceId }) // Include only if sub-service
                };

                handleAddService(newService); // Call the handler with the new service object
                handleCloseModal();
            } catch (error) {
                console.error('Error uploading icon:', error);
                // Handle error (e.g., show a notification)
            }
        },
    });

    const handleCloseModal = () => {
        formik.resetForm();
        setIconPreview(null); // Reset the icon preview on close
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
                        <h3 className="text-lg font-bold mb-6">Add New Service</h3>


                        {/* Select Service Type */}
                        <select
                            name="parentServiceId"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        >
                            <option value="">Select Service Type</option>
                            <option value="">Main Service</option>
                            {existingServices.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} (Sub-Service)
                                </option>
                            ))}
                        </select>
                        {formik.touched.parentServiceId && formik.errors.parentServiceId && (
                            <div className="text-red-600 mb-2">{formik.errors.parentServiceId}</div>
                        )}


                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Service Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-600 mb-2">{formik.errors.name}</div>
                        )}

                        {/* Short Description Input */}
                        <textarea
                            name="shortDescription"
                            placeholder="Short Description"
                            value={formik.values.shortDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.shortDescription && formik.errors.shortDescription && (
                            <div className="text-red-600 mb-2">{formik.errors.shortDescription}</div>
                        )}

                        {/* Long Description Input */}
                        <textarea
                            name="longDescription"
                            placeholder="Long Description"
                            value={formik.values.longDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                        />
                        {formik.touched.longDescription && formik.errors.longDescription && (
                            <div className="text-red-600 mb-2">{formik.errors.longDescription}</div>
                        )}

                        {/* Icon Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        formik.setFieldValue('icon', file);
                                        setIconPreview(reader.result); // Set the icon preview
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="mb-4" // Add class for styling
                        />
                        {formik.touched.icon && formik.errors.icon && (
                            <div className="text-red-600 mb-2">{formik.errors.icon}</div>
                        )}

                        {/* Icon Preview */}
                        {iconPreview ? (
                            <div className="mb-4">
                                <img src={iconPreview} alt="Icon Preview" className="max-w-[60%] h-auto mx-auto rounded mb-2" />
                            </div>
                        ) : <div className="mb-4 max-w-[60%] h-52"></div>}

                        <div className="flex justify-center gap-5">
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

export default ServiceModal;
