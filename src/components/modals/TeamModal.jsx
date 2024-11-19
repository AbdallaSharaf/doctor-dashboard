import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPhoto } from '../../helpers/Helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const TeamModal = ({ isModalOpen, setIsModalOpen, handleAddMember }) => {
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const fileRef = useRef()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('image', file);
                setImagePreview(reader.result); // Set the image preview
            };
            reader.readAsDataURL(file);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            job: '',
            college: '',
            description: '',
            image: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required'),
            job: Yup.string()
                .required('Job is required'),
            college: Yup.string()
                .required('College is required'),
            description: Yup.string()
                .required('Description is required'),
            image: Yup.string().required('Image is required')
        }),
        onSubmit: async (values) => {
            try {
                const imageUrl = await uploadPhoto(formik.values.image); // Upload image
                const newMember = {
                    name: values.name,
                    job: values.job,
                    college: values.college,
                    description: values.description,
                    isVisible: true,
                    image: imageUrl // Store the URL in the new member object
                };

                handleAddMember(newMember); // Call the handler with the new member object
                handleCloseModal()
            } catch (error) {
                console.error('Error uploading photo:', error);
                // Handle error (e.g., show a notification)
            }
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
                    className="fixed bg-black z-40 bg-opacity-50 inset-0 flex w-screen h-screen items-center justify-center"
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
                        <h3 className="text-lg font-bold mb-6">Add New Team Member</h3>

                        {/* Name Input */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 dark:border-transparent bg-primary-bg rounded p-2 w-full mb-4"
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
                            className="border border-gray-300 dark:border-transparent bg-primary-bg rounded p-2 w-full mb-4"
                        />
                        {formik.touched.job && formik.errors.job && (
                            <div className="text-red-600 mb-2">{formik.errors.job}</div>
                        )}

                        {/* Job Input */}
                        <input
                            type="text"
                            name="college"
                            placeholder="College"
                            value={formik.values.college}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 dark:border-transparent bg-primary-bg rounded p-2 w-full mb-4"
                        />
                        {formik.touched.college && formik.errors.college && (
                            <div className="text-red-600 mb-2">{formik.errors.college}</div>
                        )}

                        {/* Description Input */}
                        <textarea
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border border-gray-300 dark:border-transparent bg-primary-bg rounded p-2 w-full mb-4"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-600 mb-2">{formik.errors.description}</div>
                        )}

                        {/* Image Input */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden" // Add class for styling
                        />
                        {formik.touched.image && formik.errors.image && (
                            <div className="text-red-600 mb-2">{formik.errors.image}</div>
                        )}

                        {/* Image Preview */}
                        {imagePreview ? (
                            <div className="mb-4 mx-auto w-fit relative" onClick={() => fileRef.current.click()}>
                                <img src={imagePreview} alt="Preview" className="w-52 h-auto mx-auto rounded mb-2 " />
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="absolute top-0 right-0 h-6 w-6 cursor-pointer text-red-500"
                                    onClick={(e) => {e.stopPropagation(); setImagePreview(null)}}
                                    />
                            </div>
                        ) : <div className="w-3/5 mx-auto flex justify-center items-center border border-dashed border-primary-text p-5 cursor-pointer mb-4" onClick={() => fileRef.current.click()}>Add photo</div>}
                        <div className='h-10'/>
                        <div className="flex justify-center gap-5 absolute bottom-5">
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
