import React, { useState, useEffect, useRef } from 'react';
import axios from '../../helpers/Axios';
import AddOptionForm from './AddOptionForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const MedicineOptions = () => {
    const [medicines, setMedicines] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editedMedicine, setEditedMedicine] = useState('');
    const inputRef = useRef();

    useEffect(() => {
        const fetchMedicines = async () => {
            const response = await axios.get('/settings/medicines.json');
            const medicinesData = response.data
                ? Object.keys(response.data).map((key) => ({
                      id: key,
                      name: response.data[key].name,
                  }))
                : [];
            setMedicines(medicinesData);
        };
        fetchMedicines();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`/settings/medicines/${id}.json`);
        setMedicines(medicines.filter((medicine) => medicine.id !== id));
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedMedicine(medicines[index].name);
    };

    const handleSaveEdit = async (id) => {
        await axios.patch(`/settings/medicines/${id}.json`, { name: editedMedicine });
        setMedicines(
            medicines.map((medicine, index) =>
                index === editIndex ? { ...medicine, name: editedMedicine } : medicine
            )
        );
        setEditIndex(null);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleSaveEdit(id);
        } else if (e.key === 'Escape') {
            setEditIndex(null);
        }
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) && editIndex !== null) {
            handleSaveEdit(medicines[editIndex].id);
            setTimeout(() => {
                handleSaveEdit(diagnoses[editIndex].id);
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
        <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Medicine Options</h2>
            <AddOptionForm setOptions={setMedicines} endpoint="/settings/medicines" type="Medicine" />
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
