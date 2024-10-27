// src/components/PatientActionsDropdown.js
import React from 'react';
import { Menu, MenuButton, MenuItems, MenuItem} from '@headlessui/react';

const PatientActionsDropdown = ({ patient, onReply, onDelete }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Actions
                </MenuButton>
            </div>
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                onClick={() => onReply('call', patient.phone)}
                                className={`${
                                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                                Call
                            </button>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                onClick={() => onReply('message', patient.phone)}
                                className={`${
                                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                                Message
                            </button>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ focus }) => (
                            <button
                                onClick={() => onDelete(patient.id)}
                                className={`${
                                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                                Delete
                            </button>
                        )}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
};

export default PatientActionsDropdown;
