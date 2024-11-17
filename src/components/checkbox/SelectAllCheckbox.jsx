import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const SelectAllCheckbox = ({selectedEntries, entries, setSelectedEntries}) => {
  return (
    <div
        className={`w-5 h-5 border-2 mx-auto rounded flex justify-center items-center text-white cursor-pointer ${
            selectedEntries.length === entries.length &&
            entries.length > 0
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white dark:bg-sidebar-toggler dark:border-transparent border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-300`}
        onClick={() =>
            setSelectedEntries(
            selectedEntries.length === entries.length && entries.length > 0
                ? []
                : entries.map((app) => app.id)
            )
        }
        >
            {selectedEntries.length === entries.length &&
            entries.length > 0 && <FontAwesomeIcon icon={faCheck} className='text-xs'/>}
    </div>
  )
}

export default SelectAllCheckbox