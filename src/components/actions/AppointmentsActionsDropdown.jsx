import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faBan,
  faUserPlus,
  faTrash,
  faHourglass,
} from '@fortawesome/free-solid-svg-icons';


import { Tooltip } from 'react-tooltip';

const AppointmentActionsDropdown = ({ appointment, handleChangeStatus, handleRejectDelete, handleAddPatient }) => {
  return (
    <div className="grid grid-cols-4 gap-2 justify-center w-fit mx-auto text-xl">
      {/* Add Patient */}
      <button onClick={() => handleAddPatient(appointment)} data-tooltip-id="add-patient-single-tooltip">
        <FontAwesomeIcon icon={faUserPlus} className="text-purple-500 hover:text-purple-600" />
      </button>
      <Tooltip id="add-patient-single-tooltip" content="Add as New Patient" place="top" />

      {/* Conditionally Render Approve or Pending */}
      {
        appointment.status === 'pending' ? (
          <button onClick={() => handleChangeStatus(appointment.id, 'approved')} data-tooltip-id="approve-single-tooltip">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500  hover:text-green-600" />
          </button>
        ) : (
          <button onClick={() => handleChangeStatus(appointment.id, 'pending')} data-tooltip-id="pending-single-tooltip">
            <FontAwesomeIcon icon={faHourglass} className="text-yellow-500  hover:text-yellow-600" />
          </button>
        )
      }
      <Tooltip id="approve-single-tooltip" content="Mark as Approved" place="top" />
      <Tooltip id="pending-single-tooltip" content="Mark as Pending" place="top" />

      {/* Cancelled */}
      <button onClick={() => handleChangeStatus(appointment.id, 'cancelled')} data-tooltip-id="cancelled-single-tooltip">
        <FontAwesomeIcon icon={faBan} className="text-gray-500 hover:text-gray-600" />
      </button>
      <Tooltip id="cancelled-single-tooltip" content="Mark as Cancelled" place="top" />

      {/* Delete */}
      <button onClick={() => handleRejectDelete(appointment.id)} data-tooltip-id="delete-single-tooltip">
        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-600" />
      </button>
      <Tooltip id="delete-single-tooltip" content="Delete Appointment" place="top" />
    </div>
  );
};

export default AppointmentActionsDropdown;
