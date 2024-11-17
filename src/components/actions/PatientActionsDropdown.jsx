// src/components/PatientActionsDropdown.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Tooltip } from 'react-tooltip'; // Import Tooltip

const PatientActionsDropdown = ({ patient, onReply, onDelete }) => {
    return (
        <div className="flex justify-center gap-4">
            <button
                onClick={() => onReply('whatsapp', patient.phone)}
                className="text-green-500 hover:text-green-600"
                data-tooltip-id="whatsapp-tooltip"
                data-tooltip-content="Send WhatsApp message"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
            </button>
            <button
                onClick={() => onReply('call', patient.phone)}
                className="text-blue-500 hover:text-blue-600"
                data-tooltip-id="call-tooltip"
                data-tooltip-content="Make a phone call"
            >
                <FontAwesomeIcon icon={faPhone} className="text-xl" />
            </button>
            <button
                onClick={() => onDelete(patient.id)}
                className="text-red-500 hover:text-red-600"
                data-tooltip-id="delete-tooltip"
                data-tooltip-content="Delete patient"
            >
                <FontAwesomeIcon icon={faTrash} className="text-xl" />
            </button>

            {/* Define tooltips */}
            <Tooltip id="whatsapp-tooltip" />
            <Tooltip id="call-tooltip" />
            <Tooltip id="delete-tooltip" />
        </div>
    );
};

export default PatientActionsDropdown;
