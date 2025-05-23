import React, { useState, useRef, useEffect } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../helpers/Helpers';

const CustomDropdown = ({ options, selectedStatus, setSelectedStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (value) => {
        setSelectedStatus(value.value);
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-between rounded-md dark:border-transparent border border-gray-300 px-4 py-2 text-sm font-medium bg-primary-bg"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {selectedStatus.label ? (typeof selectedStatus.label === "string" ? capitalizeFirstLetter(selectedStatus.label) : selectedStatus.label) : "Select Status"}
                    <FontAwesomeIcon className={`ml-2 ${isOpen && 'rotate-180'}`} icon={faChevronDown}/>
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <ul className="absolute right-0 z-10 mt-2 w-full max-h-[150px] scrollbar-hide overflow-y-auto origin-top-right rounded-md bg-primary-bg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`${
                                selectedStatus.value === option.value ? 'text-gray-900 dark:text-gray-500' : ''
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm cursor-pointer hover:opacity-80`}
                            onClick={() => handleSelect(option)}
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
