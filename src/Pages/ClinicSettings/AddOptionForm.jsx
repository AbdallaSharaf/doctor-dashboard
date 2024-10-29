import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOption } from '../../store/slices/clinicSettingsSlice';

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
        <div>
            <input 
                type="text" 
                placeholder={`New ${type}`}
                value={newOption} 
                onChange={(e) => setNewOption(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleAddOption}>Add</button>
        </div>
    );
};

export default AddOptionForm;
