import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const IndividualCheckbox = ({selectedEntries, entry, handleCheckboxChange}) => {
  return (
    <div
    className={`w-4 h-4 mx-auto text-white flex justify-center items-center border-2 rounded cursor-pointer ${
        selectedEntries.includes(entry.id)
        ? 'bg-blue-500 border-blue-500'
        : 'bg-white dark:bg-sidebar-toggler dark:border-transparent  border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-blue-300 scale-125`}
    onClick={() => handleCheckboxChange(entry.id)}
    >
        {selectedEntries.includes(entry.id) &&<FontAwesomeIcon icon={faCheck} className='text-xs'/>}
    </div>
  )
}

export default IndividualCheckbox