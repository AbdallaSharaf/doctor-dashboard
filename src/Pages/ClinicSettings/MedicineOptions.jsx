import React, { useState, useEffect, useRef } from 'react';
import AddOptionForm from './AddOptionForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOption, editOption } from '../../store/slices/clinicSettingsSlice';

const MedicineOptions = () => {
    const [editIndex, setEditIndex] = useState(null);
    const [editedMedicine, setEditedMedicine] = useState('');
    const inputRef = useRef();
    const dispatch = useDispatch();
    const endpoint = '/medicines';
    const medicines = useSelector((state) => state.clinicSettings.medicines);
    const loading = useSelector((state) => state.clinicSettings.loading);

    const handleDelete = async (id) => {
        await dispatch(deleteOption({ endpoint, id }));
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedMedicine(medicines[index].name);
    };

    const handleSaveEdit = async (id) => {
        await dispatch(editOption({ endpoint, id, name: editedMedicine }));
        setEditIndex(null);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleSaveEdit(id);
        } else if (e.key === 'Escape') {
            setEditIndex(null); // Discard edits
        }
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) && editIndex !== null) {
            handleSaveEdit(medicines[editIndex].id);
            setTimeout(() => {
                handleSaveEdit(medicines[editIndex].id);
            }, 100); // 100ms delay before saving and closing
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editIndex, medicines]);

    return (
        <div className="p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medicine Options</h2>
            <AddOptionForm endpoint="/settings/medicines" type="Medicine" />
            <div className="flex flex-wrap mt-4 space-x-4 w-fit">
                {medicines.map((medicine, index) => (
                    <div
                        key={medicine.id}
                        className="flex items-center w-fit pr-7 space-x-2 p-2 border rounded-lg group hover:border-primary-text transition-all duration-200 ease-in-out relative"
                    >
                        {editIndex === index ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editedMedicine}
                                onChange={(e) => setEditedMedicine(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, medicine.id)}
                                onBlur={() => handleSaveEdit(medicine.id)}
                                className="border p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-fit"
                            />
                        ) : (
                            <span
                                className="cursor-pointer text-primary-text font-medium"
                                onClick={() => handleEdit(index)}
                            >
                                {medicine.name}
                            </span>
                        )}
                        <button
                            onClick={() => handleDelete(medicine.id)}
                            className="absolute right-2 top-1 text-sm"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicineOptions;
