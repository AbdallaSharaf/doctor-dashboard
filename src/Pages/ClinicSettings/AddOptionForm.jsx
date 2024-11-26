import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOption } from '../../store/slices/clinicSettingsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const AddOptionForm = ({ endpoint, type }) => {
    const [newOption, setNewOption] = useState('');
    const dispatch = useDispatch();
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddOption();
            setNewOption('');
        } else if (e.key === 'Escape') {
            setNewOption(''); // Discard edits
        }
    };

    const handleAddOption = async () => {
        if (newOption.trim() === '') return;
        await dispatch(addOption({ endpoint, name: newOption }));
        setNewOption('');
    };

    return (
            <input 
                type="text" 
                placeholder={`Add new ${type}`}
                value={newOption} 
                onBlur={() => handleAddOption()}
                onChange={(e) => setNewOption(e.target.value)} 
                onKeyDown={handleKeyDown}
                className='px-1 h-8 bg-transparent dark:focus:outline-none rounded-md text-lg'
            />
    );
};

export default AddOptionForm;
