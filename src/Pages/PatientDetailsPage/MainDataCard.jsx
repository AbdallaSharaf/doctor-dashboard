import React, {useState, useEffect} from 'react'
import { updatePatient } from '../../store/slices/patientsSlice';
import { formatDateTime, capitalizeFirstLetter } from '../../helpers/Helpers';
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../../helpers/Helpers';

// List of Egyptian cities
const egyptianCities = [
    "Cairo", "Alexandria", 'Tanta'
];


const MainDataCard = ({patientData}) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null); // Store selected image file
    const [imagePreview, setImagePreview] = useState(patientData.imageUrl); // Store image URL for preview

    
    useEffect(() => {
        if (patientData) {
          setEditedData({
            photo: patientData?.photo || 'https://placehold.co/100',
            name: patientData.name,
            phone: patientData.phone,
            age: patientData.age,
            gender: patientData.gender,
            firstAppointmentDate: patientData.firstAppointmentDate,
            lastAppointmentDate: patientData.lastAppointmentDate,
            city: patientData.city || "", // Adding city field with default value
          });
          setImagePreview(patientData.photo); // Initial image preview
        }
      }, [patientData]);
    
      const handleEditToggle = () => {
        setEditMode(!editMode);
      };
    
      const handleFieldChange = (field, value) => {
        setEditedData(prevData => ({ ...prevData, [field]: value }));
      };
    
      const handleSave = async () => {
        try {
            let photoUrl = editedData.photo;

            // Upload the image if a new file has been selected
            if (selectedImage) {
                const uploadResult = await uploadPhoto(selectedImage);
                photoUrl = uploadResult; // Get the secure URL from Cloudinary
            }

            // Dispatch the update with the uploaded photo URL
            await dispatch(updatePatient({ id: patientData.id, updatedData: { ...editedData, photo: photoUrl } }));
            setEditMode(false);
        } catch (error) {
            console.error('Error saving patient data:', error);
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file)); // Show preview of selected image
        }
    };


  return (
        <div className="bg-table-container-bg py-8 px-9 h-fit mt-4 w-full rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.02)] border dark:border-transparent border-gray-200">
             <div className="relative w-24 h-24 mb-4 mx-auto overflow-hidden rounded-full bg-gray-200">
                <img 
                    src={imagePreview || 'https://placehold.co/100'} 
                    alt="Patient" 
                    className="object-cover w-full h-full cursor-pointer" 
                    onClick={() => editMode && document.getElementById('fileInput').click()} 
                />
                <input 
                    type="file" 
                    id="fileInput" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }} // Hide the file input
                />
            </div>
        <div className="text-center font-medium mb-2 text-xl">
            {editMode ? (
            <input
                type="text"
                value={editedData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="border p-1 w-full bg-primary-bg dark:border-transparent text-center"
            />
            ) : (
            <p className='p-[5px]'>{patientData.name}</p>
            )}
        </div>
        <div className="text-center w-full">
            <p className="px-2 py-1 bg-blue-400 bg-opacity-20 text-blue-400 font-medium text-sm w-fit mx-auto rounded-md mb-6">
            Placeholder
            </p>
        </div>
        <p className="text-center mb-4">
            No. of records: <span className="font-medium">{Object.keys(patientData.records).length}</span>
        </p>
        <div className="flex items-center justify-between pb-2 border-b border-opacity-50 border-gray-300">
            <h3 className="font-medium">Details</h3>
            {!editMode ? 
            <button onClick={handleEditToggle} className="px-4 py-2  bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out font-medium text-xs w-fit rounded-md">
            Edit
            </button> : 
            <div className='flex justify-center gap-4'>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-400 bg-opacity-20 text-blue-400 hover:text-secondary-text hover:bg-opacity-100 duration-200 transition-all ease-in-out w-18 font-medium text-xs rounded-md">
                Save
            </button>
            <button onClick={()=>setEditMode(false)} className="px-4 py-2 bg-white bg-opacity-20 text-primary-text hover:bg-gray-100 transition-all duration-200 ease-in-out w-18 font-medium text-xs rounded-md">
                Discard
            </button>
            </div>}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">Phone:</p>
            {editMode ? (
            <input
                type="text"
                value={editedData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="border p-1 w-full bg-primary-bg dark:border-transparent text-sm"
            />
            ) : (
            <p className='py-[5px] font-extralight'>{patientData.phone}</p>
            )}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">Age:</p>
            {editMode ? (
            <input
                type="text"
                value={editedData.age}
                onChange={(e) => handleFieldChange('age', e.target.value)}
                className="border p-1 w-full bg-primary-bg dark:border-transparent text-sm"
            />
            ) : (
            <p className='py-[5px] font-extralight'>{patientData.age}</p>
            )}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">Gender:</p>
            {editMode ? (
            <div className="flex space-x-2">
            <button
                type="button"
                onClick={() => handleFieldChange('gender', 'male')}
                className={`px-4 py-1 text-sm rounded ${editedData.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-20'} w-20`}
            >
                Male
            </button>
            <button
                type="button"
                onClick={() => handleFieldChange('gender', 'female')}
                className={`px-4 text-sm py-1 rounded ${editedData.gender === 'female' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-20'} w-20`}
            >
                Female
            </button>
            </div>
        ): (
            <p className='py-[5px] font-extralight'>{capitalizeFirstLetter(patientData.gender)}</p>
            )}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">City:</p>
            {editMode ? (
                <select
                    value={editedData.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className="border p-1 w-full bg-primary-bg dark:border-transparent text-sm"
                >
                    <option value="">Select a city</option>
                    {egyptianCities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                    <option value="">Other</option>
                </select>
            ) : (
                <p className="py-[5px] font-extralight">{editedData.city || "Not specified"}</p>
            )}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">First Appointment Date:</p>
            {editMode ? (
            <input
                type="date"
                value={editedData.firstAppointmentDate}
                onChange={(e) => handleFieldChange('firstAppointmentDate', e.target.value)}
                className="border p-1 w-full bg-primary-bg dark:border-transparent"
            />
            ) : (
            <p className='py-[5px] font-extralight'>{formatDateTime(patientData.firstAppointmentDate)}</p>
            )}
        </div>
        <div className="text-sm my-4">
            <p className="font-medium mb-1">Last Appointment Date:</p>
            {editMode ? (
            <input
                type="date"
                value={editedData.lastAppointmentDate}
                onChange={(e) => handleFieldChange('lastAppointmentDate', e.target.value)}
                className="border p-1 w-full bg-primary-bg dark:border-transparent"
            />
            ) : (
            <p className='py-[5px] font-extralight '>{formatDateTime(patientData.lastAppointmentDate)}</p>
            )}
        </div>
        </div>
  )
}

export default MainDataCard