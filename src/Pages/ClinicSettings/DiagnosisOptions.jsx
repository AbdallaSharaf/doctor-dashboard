import React, { useState, useEffect, useRef } from 'react';
import AddOptionForm from './AddOptionForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOption, editOption } from '../../store/slices/clinicSettingsSlice';

const DiagnosisOptions = () => {
    const [editIndex, setEditIndex] = useState(null);
    const [editedDiagnosis, setEditedDiagnosis] = useState('');
    const dispatch = useDispatch();
    const endpoint = '/diagnoses';
    const diagnoses = useSelector((state) => state.clinicSettings.diagnoses);
    const loading = useSelector((state) => state.clinicSettings.loading);
    const inputRef = useRef();

    const handleDelete = async (id) => {
        await dispatch(deleteOption({ endpoint, id }));
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedDiagnosis(diagnoses[index].name);
    };

    const handleSaveEdit = async (id) => {
        await dispatch(editOption({ endpoint, id, name: editedDiagnosis }));
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
            handleSaveEdit(diagnoses[editIndex].id);
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
    }, [editIndex, diagnoses]);

    return (
        <div className="p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Diagnosis Options</h2>
            <AddOptionForm endpoint="/settings/diagnoses" type="Diagnosis" />
            <div className="flex flex-wrap mt-4 space-x-4 w-fit">
                {diagnoses.map((diagnosis, index) => (
                    <div
                        key={diagnosis.id}
                        className="flex items-center w-fit pr-7 space-x-2 p-2 border rounded-lg group hover:border-primary-text transition-all duration-200 ease-in-out relative"
                    >
                        {editIndex === index ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editedDiagnosis}
                                onChange={(e) => setEditedDiagnosis(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, diagnosis.id)}
                                onBlur={() => handleSaveEdit(diagnosis.id)}
                                className="border p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-fit"
                            />
                        ) : (
                            <span
                                className="cursor-pointer text-primary-text font-medium"
                                onClick={() => handleEdit(index)}
                            >
                                {diagnosis.name}
                            </span>
                        )}
                        <button
                            onClick={() => handleDelete(diagnosis.id)}
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

export default DiagnosisOptions;
