import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHourglassHalf, faBan, faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

const BulkActionsDropdown = ({ handleBulkAction, isActive }) => {
  return (
    <div className="flex justify-center gap-3 items-center">
      {/* Approve Button */}
      <button
        onClick={() => handleBulkAction('approve')}
        className={`text-xl ${isActive ? 'text-green-500 hover:text-green-600' : 'text-gray-400 cursor-not-allowed'}`}
        data-tooltip-id="approve-tooltip"
        disabled={!isActive} // Disable the button when isActive is false
      >
        <FontAwesomeIcon icon={faCheckCircle} />
      </button>
      <Tooltip id="approve-tooltip" content="Mark Selected as Approved" place="top" />

      {/* Pending Button */}
      <button
        onClick={() => handleBulkAction('pending')}
        className={`text-xl ${isActive ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 cursor-not-allowed'}`}
        data-tooltip-id="pending-tooltip"
        disabled={!isActive}
      >
        <FontAwesomeIcon icon={faHourglassHalf} />
      </button>
      <Tooltip id="pending-tooltip" content="Mark Selected as Pending" place="top" />

      {/* Cancelled Button */}
      <button
        onClick={() => handleBulkAction('cancelled')}
        className={`text-xl ${isActive ? 'text-gray-500 hover:text-gray-600' : 'text-gray-400 cursor-not-allowed'}`}
        data-tooltip-id="cancelled-tooltip"
        disabled={!isActive}
      >
        <FontAwesomeIcon icon={faBan} />
      </button>
      <Tooltip id="cancelled-tooltip" content="Mark Selected as Cancelled" place="top" />

      {/* Delete Button */}
      <button
        onClick={() => handleBulkAction('delete')}
        className={`text-xl ${isActive ? 'text-red-500 hover:text-red-600' : 'text-gray-400 cursor-not-allowed'}`}
        data-tooltip-id="delete-tooltip"
        disabled={!isActive}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <Tooltip id="delete-tooltip" content="Delete Selected" place="top" />

      {/* Message Button */}
      <button
        onClick={() => handleBulkAction('message')}
        className={`text-xl ${isActive ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`}
        data-tooltip-id="message-tooltip"
        disabled={!isActive}
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </button>
      <Tooltip id="message-tooltip" content="Send Message to Selected" place="top" />
    </div>
  );
};

export default BulkActionsDropdown;
