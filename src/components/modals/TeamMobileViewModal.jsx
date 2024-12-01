import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const TeamMobileViewModal = ({ isOpen, onClose, member, handleRejectDelete }) => {
    
    return (
        <AnimatePresence>
            {isOpen && member && (
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal content */}
                        <h2 className="text-xl font-semibold mb-6">{member.name}</h2>
                        <p className="mb-2"><strong>Job:</strong> {member.job}</p>
                        <p className="mb-2"><strong>Description:</strong> {member.description}</p>
                        <img src={member.img} alt="" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
