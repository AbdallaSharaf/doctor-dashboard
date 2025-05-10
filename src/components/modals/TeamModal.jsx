import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { uploadPhoto } from '../../helpers/Helpers';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  styled
} from '@mui/material';

const TeamModal = ({ isModalOpen, setIsModalOpen, handleAddMember }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const fileRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('image', file);
                setImagePreview(reader.result);
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
            name: Yup.string().required('Name is required'),
            job: Yup.string().required('Job is required'),
            college: Yup.string().required('College is required'),
            description: Yup.string().required('Description is required'),
            image: Yup.string().required('Image is required')
        }),
        onSubmit: async (values) => {
            try {
                const imageUrl = await uploadPhoto(formik.values.image);
                const newMember = {
                    name: values.name,
                    job: values.job,
                    college: values.college,
                    description: values.description,
                    isVisible: true,
                    image: imageUrl
                };
                handleAddMember(newMember);
                handleCloseModal();
            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        },
    });

    const handleCloseModal = () => {
        formik.resetForm();
        setImagePreview(null);
        setIsModalOpen(false);
    };

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: 'dark:bg-gray-800 dark:text-white'
            }}
        >
            <DialogTitle className="dark:bg-gray-800 dark:text-white">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" className="dark:text-white">
                        Add New Team Member
                    </Typography>
                    <IconButton 
                        onClick={handleCloseModal}
                        className="dark:text-white hover:dark:bg-gray-700"
                    >
                        <i className="fa fa-close" aria-hidden="true"></i>
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        name="name"
                        label="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        className="dark:text-white"
                        InputLabelProps={{
                            className: 'dark:text-white',
                        }}
                        InputProps={{
                            className: 'dark:text-white',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        name="job"
                        label="Job"
                        value={formik.values.job}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.job && Boolean(formik.errors.job)}
                        helperText={formik.touched.job && formik.errors.job}
                        className="dark:text-white"
                        InputLabelProps={{
                            className: 'dark:text-white',
                        }}
                        InputProps={{
                            className: 'dark:text-white',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        name="college"
                        label="College"
                        value={formik.values.college}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.college && Boolean(formik.errors.college)}
                        helperText={formik.touched.college && formik.errors.college}
                        className="dark:text-white"
                        InputLabelProps={{
                            className: 'dark:text-white',
                        }}
                        InputProps={{
                            className: 'dark:text-white',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        name="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        multiline
                        rows={4}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        className="dark:text-white"
                        InputLabelProps={{
                            className: 'dark:text-white',
                        }}
                        InputProps={{
                            className: 'dark:text-white',
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                            },
                        }}
                    />

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />

                    {imagePreview ? (
                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }} onClick={() => fileRef.current.click()}>
                            <Box
                                component="img"
                                src={imagePreview}
                                alt="Preview"
                                sx={{ maxWidth: 200, maxHeight: 200, borderRadius: 1 }}
                                className="dark:border dark:border-gray-600"
                            />
                            <IconButton
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                className="dark:text-red-400 hover:dark:bg-gray-700"
                                onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                            >
                                <i className="fa fa-close" aria-hidden="true"></i>
                            </IconButton>
                        </Box>
                    ) : (
                        <Box 
                            onClick={() => fileRef.current.click()}
                            className="w-3/5 mx-auto flex flex-col justify-center items-center border-2 border-dashed border-gray-400 dark:border-gray-600 p-5 cursor-pointer mb-4 hover:border-primary-btn dark:hover:border-blue-400"
                        >
                            <i className="fa fa-camera fa-2x mb-2 dark:text-white"></i>
                            <Typography className="dark:text-white">Add photo</Typography>
                        </Box>
                    )}

                    {formik.touched.image && formik.errors.image && (
                        <Typography color="error" variant="caption" className="dark:text-red-400">
                            {formik.errors.image}
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions className="dark:bg-gray-800 dark:border-t dark:border-gray-700">
                <button 
                    onClick={handleCloseModal} 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-text dark:text-white rounded p-2 w-20"
                >
                    Cancel
                </button>
                <button 
                    onClick={formik.handleSubmit} 
                    className="bg-primary-btn hover:bg-hover-btn dark:bg-blue-600 dark:hover:bg-blue-700 text-secondary-text dark:text-white rounded p-2 w-20"
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    Save
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamModal;