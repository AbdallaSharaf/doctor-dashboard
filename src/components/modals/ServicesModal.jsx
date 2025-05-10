import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addService, editService } from '../../store/slices/servicesSlice';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  IconButton,
  Typography
} from '@mui/material';

const ServiceModal = ({ isModalOpen, setIsModalOpen, selectedService }) => {
  const [iconPreview, setIconPreview] = useState(selectedService?.icon || null);
  const existingServices = useSelector(state => state.services.list);
  const dispatch = useDispatch();

  const handleAddService = async (serviceData, mainServiceId = null) => {
    await dispatch(addService({ serviceData, mainServiceId }));
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `${serviceData.name} has been successfully added to the services.`,
      confirmButtonText: 'OK',
    });
  };

  const handleEditService = async (serviceData, mainServiceId = null) => {
    await dispatch(editService({ 
      id: serviceData.id, 
      updatedData: serviceData, 
      mainServiceId: serviceData.mainServiceId 
    }));
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `${serviceData.name} has been successfully edited.`,
      confirmButtonText: 'OK',
    });
  };
  console.log(selectedService)
  const formik = useFormik({
    initialValues: {
      name: selectedService?.name || '',
      shortDescription: selectedService?.shortDescription || '',
      longDescription: selectedService?.longDescription || '',
      icon: selectedService?.icon || '',
      parentServiceId: selectedService?.parentServiceId || ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      shortDescription: Yup.string().required('Short description is required'),
      longDescription: Yup.string().required('Long description is required'),
      icon: Yup.string().required('Icon is required'),
      parentServiceId: Yup.string()
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const iconUrl = await uploadPhoto(formik.values.icon);
        const newService = {
          name: values.name,
          shortDescription: values.shortDescription,
          longDescription: values.longDescription,
          icon: iconUrl,
          ...(values.parentServiceId && { parentServiceId: values.parentServiceId })
        };
        selectedService 
          ? handleEditService(newService, values.parentServiceId) 
          : handleAddService(newService, values.parentServiceId);
        handleCloseModal();
      } catch (error) {
        console.error('Error uploading icon:', error);
      }
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    setIconPreview(null);
    setIsModalOpen();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('icon', file);
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (selectedService) {
      setIconPreview(selectedService.icon);
    }
  }, [selectedService]);

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
            {selectedService ? 'Edit Service' : 'Add New Service'}
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
        <form onSubmit={formik.handleSubmit}>
          {!selectedService && <FormControl fullWidth margin="normal" className="dark:text-white">
            <InputLabel 
              id="service-type-label" 
              className="dark:text-white"
            >
              Service Type
            </InputLabel>
            <Select
              labelId="service-type-label"
              name="parentServiceId"
              value={formik.values.parentServiceId || ''} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Service Type"
              className="dark:text-white"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              }}
              MenuProps={{
                PaperProps: {
                  className: 'dark:bg-gray-800 dark:text-white',
                },
              }}
            >
              <MenuItem value='' className="dark:hover:bg-gray-700 dark:text-white">Main Service</MenuItem>
              {existingServices.map((service) => (
                <MenuItem 
                  key={service.id} 
                  value={service.id}
                  className="dark:hover:bg-gray-700 dark:text-white"
                >
                  {service.name} (Sub-Service)
                </MenuItem>
              ))}
            </Select>
            {formik.touched.parentServiceId && formik.errors.parentServiceId && (
              <Typography color="error" variant="caption" className="dark:text-red-400">
                {formik.errors.parentServiceId}
              </Typography>
            )}
          </FormControl>}

          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Service Name"
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
            margin="normal"
            name="shortDescription"
            label="Short Description"
            value={formik.values.shortDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            rows={3}
            error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
            helperText={formik.touched.shortDescription && formik.errors.shortDescription}
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
            margin="normal"
            name="longDescription"
            label="Long Description"
            value={formik.values.longDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            multiline
            rows={5}
            error={formik.touched.longDescription && Boolean(formik.errors.longDescription)}
            helperText={formik.touched.longDescription && formik.errors.longDescription}
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

          {iconPreview && (
            <Box display="flex" marginBottom={2}>
              <img 
                src={iconPreview} 
                alt="Icon Preview" 
                className="max-w-[60%] h-auto rounded dark:border dark:border-gray-600" 
              />
            </Box>
          )}
          <Box marginTop={2} marginBottom={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="icon-upload">
              <Button 
                variant="outlined" 
                component="span"
                className="dark:text-white dark:border-gray-500 hover:dark:bg-gray-700"
              >
                Upload Icon
              </Button>
            </label>
            {formik.touched.icon && formik.errors.icon && (
              <Typography color="error" variant="caption" display="block" className="dark:text-red-400">
                {formik.errors.icon}
              </Typography>
            )}
          </Box>
        </form>
      </DialogContent>

      <DialogActions className="dark:bg-gray-800 dark:border-t dark:border-gray-700">
        <button 
          onClick={handleCloseModal} 
          className='hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-text dark:text-white rounded p-1 transition duration-150 w-20'
        >
          Cancel
        </button>
        <button 
          onClick={formik.handleSubmit} 
          className="bg-primary-btn hover:bg-hover-btn dark:bg-blue-600 dark:hover:bg-blue-700 text-secondary-text dark:text-white rounded p-1 transition duration-150 w-20"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceModal;