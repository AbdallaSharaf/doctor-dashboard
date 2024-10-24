import React, { useState } from 'react';
import axios from '../../helpers/Axios';

const AddOptionForm = ({ setOptions, endpoint, type }) => {
    const [newOption, setNewOption] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddOption();
            setNewOption('')
        } else if (e.key === 'Escape') {
            setNewOption(''); // Discard edits
        }
    };

    const handleAddOption = async () => {
        if (newOption.trim() === '') {
            return;
        }
        const response = await axios.post(`${endpoint}.json`, { name: newOption });
        setOptions((prev) => [...prev, { id: response.data.name, name: newOption }]); // Assuming response returns the ID
        setNewOption('');
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder={`New ${type}`}
                value={newOption} 
                onChange={(e) => setNewOption(e.target.value)} 
                onKeyDown={(e) => handleKeyDown(e)} // Handle key down events
            />
            <button onClick={handleAddOption}>Add</button>
        </div>
    );
};

export default AddOptionForm;
