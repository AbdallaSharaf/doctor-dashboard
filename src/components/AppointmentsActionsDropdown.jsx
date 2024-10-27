import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'; // Import the Menu component

const ActionsDropdown = ({ appointment, handleChangeStatus, handleEditClick, handleRejectDelete, handleReply, handleAddPatient}) => {
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
            className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
            onClick={() => handleChangeStatus(appointment.id, 'approved')}
            >
            Mark as Approved
            </button>
        )}
        </MenuItem>
        <MenuItem>
            {({ focus }) => (
            <button
                className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleChangeStatus(appointment.id, 'pending')}
            >
                Mark as Pending
            </button>
            )}
        </MenuItem>
        <MenuItem>
            {({ focus }) => (
            <button
                className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleChangeStatus(appointment.id, 'cancelled')}
            >
                Mark as Cancelled
            </button>
            )}
        </MenuItem>
        <MenuItem>
            {({ focus }) => (
            <button
                className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleReply('call',appointment.phone)}
            >
                Call Reply
            </button>
            )}
        </MenuItem>
        <MenuItem>
            {({ focus }) => (
            <button
                className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleReply('whatsapp',appointment.phone)}
            >
                WhatsApp Reply
            </button>
            )}
        </MenuItem>
        <MenuItem>
            {({ focus }) => (
            <button
                className={`${
                focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleAddPatient(appointment)}
            >
                Add Patient
            </button>
            )}
        </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
              className={`${
                  focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleEditClick(appointment)}
              >
                Edit
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
              className={`${
                  focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                onClick={() => handleRejectDelete(appointment.id)}
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

export default ActionsDropdown;
