import React, { useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomDropdown = ({ options, selectedStatus, setSelectedStatus }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value) => {
        setSelectedStatus(value);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left w-[170px]">
            {/* Dropdown Button */}
            <div>
                <button
                   e type="button"
                    className=" p-2 w-full text-sm flex justify-between items-center bg-gray-100 rounded"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedStatus ? selectedStatus : "Select Status"}
                    <FontAwesomeIcon className='ml-5' icon={faChevronDown}/>
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <ul className="absolute z-10 w-full -mt-2 bg-white border border-gray-300 rounded shadow-lg ">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`p-2 cursor-pointer ${selectedStatus === option.value ? 'bg-primary-btn text-secondary-text' : 'hover:bg-gray-100'}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdown;
