import { AnimatePresence, motion } from "framer-motion";
import AppointmentActionsDropdown from "../actions/AppointmentsActionsDropdown";
import PhoneWithActions from "../actions/PhoneWithActions";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../helpers/Helpers";

export const MobileViewModal = ({ isOpen, handleCopyPhone, onClose, appointment, handleChangeStatus, handleEditClick, handleRejectDelete, handleReply, handleAddPatient }) => {
    const [isHovered, setIsHovered] = useState(null)
    return (
        <AnimatePresence>
            {isOpen && appointment && (
                <div 
                    onClick={onClose} 
                    className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-15 z-50"
                >
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: "0%", opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-primary-bg p-6 rounded-lg shadow-lg w-2/3 bg-white"
                        onClick={(e) => {e.stopPropagation(); setIsHovered(null)}}
                    >
                        {/* Modal content */}
                        <h2 className="text-xl font-semibold mb-6">{appointment.name}</h2>
                        <p className="mb-2"><strong>Date:</strong> {appointment.date}</p>
                        <p className="mb-2"><strong>Time:</strong> {appointment.time}</p>
                        <p className="mb-2" onClick={(e)=>{e.stopPropagation(); setIsHovered(appointment.id);}}><strong>Phone:</strong> <PhoneWithActions phone={appointment.phone} handleCopyPhone={handleCopyPhone} handleReply={handleReply} isHovered={isHovered} id={appointment.id}/></p>
                        <p className="mb-6"><strong>Status:</strong> {capitalizeFirstLetter(appointment.status)}</p>

                        {/* Buttons for actions */}
                        <AppointmentActionsDropdown
                            appointment={appointment}
                            handleChangeStatus={handleChangeStatus}
                            handleEditClick={handleEditClick}
                            handleRejectDelete={handleRejectDelete}
                            handleReply={handleReply}
                            handleAddPatient={handleAddPatient}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
