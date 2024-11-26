import React, { useState, useEffect, useRef, useCallback } from 'react';
import AddOptionForm from './AddOptionForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOption, editOption } from '../../store/slices/clinicSettingsSlice';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Lottie from 'lottie-react';
import noDataAnimation from '../../assets/Animation - 1730816811189.json'
import SelectAllCheckbox from '../../components/checkbox/SelectAllCheckbox';
import { capitalizeFirstLetter } from '../../helpers/Helpers';
import IndividualCheckbox from '../../components/checkbox/IndividualCheckbox';

const CardOptions = ({choice}) => {
    const [editIndex, setEditIndex] = useState(null);
    const [editedOption, setEditedOption] = useState('');
    const dispatch = useDispatch();
    const endpoint = choice;
    const options = useSelector((state) => state.clinicSettings[choice]);
    const inputRef = useRef();
    const [selectedOptions, setSelectedOptions] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredOptions = React.useMemo(() => {
        return options.filter((option) =>
            option.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [options, searchQuery]);

    const totalPages = Math.ceil(filteredOptions.length / 10);
    const indexOfLastOption = currentPage * 10;
    const indexOfFirstOption = indexOfLastOption - 10;
    const currentOptions = filteredOptions.slice(indexOfFirstOption, indexOfLastOption);

    const handleCheckboxChange = (id) => {
        setSelectedOptions((prevSelected) =>
            prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
        );
    };
    
    const handleDelete = async (id) => {
        await dispatch(deleteOption({ endpoint, id }));
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedOption(options[index].name);
    };

    const handleSaveEdit = useCallback(
        async (id) => {
            if (!id) return;
            await dispatch(editOption({ endpoint, id, name: editedOption }));
            setEditIndex(null);
        },
        [dispatch, endpoint, editedOption]
    );

    const handleInteraction = useCallback(
        (e) => {
            if (e.type === 'keydown') {
                if (e.key === 'Enter') {
                    handleSaveEdit(options[editIndex]?.id);
                } else if (e.key === 'Escape') {
                    setEditIndex(null);
                }
            } else if (e.type === 'mousedown') {
                if (inputRef.current && !inputRef.current.contains(e.target) && editIndex !== null) {
                    handleSaveEdit(options[editIndex]?.id);
                }
            }
        },
        [editIndex, options, handleSaveEdit]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleInteraction);
        return () => {
            document.removeEventListener('mousedown', handleInteraction);
        };
    }, [handleInteraction]);

    return (
        <div className="p-6 bg-table-container-bg rounded-md shadow-md relative">
            {/* Search */}
            <div className="flex justify-between items-center mb-6 w-full pl-[18px]">
                <h2 className="text-xl font-semibold">{capitalizeFirstLetter(choice)}</h2>
                <div className={`${options.length === 0 && 'hidden'} relative p-2 text-sm `}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder={`Search ${choice}`}
                        className="p-2 pl-8 sidebar w-44 border border-transparent rounded"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className='flex justify-between items-center gap-1 pl-[10px] h-14'>
                <div className='px-2'>
                <SelectAllCheckbox entries={options} selectedEntries={selectedOptions} setSelectedEntries={setSelectedOptions}/>
                </div>
                {selectedOptions.length > 0 ?
                    <button className={`bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 text-sm ${!selectedOptions.length > 0 ? 'cursor-not-allowed opacity-50' : ''}`}>Delete selected</button> :
                    <div className='w-full'>
                        <AddOptionForm endpoint="options" type="Option" />
                    </div>
                }
                
            </div>
            {options.length > 0 ? (
                <>
            {/* Options List */}
            <div className="flex flex-col justify-between items-center mb-4">
            {currentOptions.map((option, index) => (
                <div
                className={`${
                    index % 2 === 0 ? 'bg-even-row-bg' : ''
                } flex justify-between items-center w-full px-3 py-2 h-14`}
                key={option.id} // Use a proper unique key
                >
                <div
                    className="flex justify-between items-center w-full cursor-pointer"
                    onClick={() => handleEdit(index)}
                >
                    {editIndex === index ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedOption}
                        onChange={(e) => setEditedOption(e.target.value)}
                        onKeyDown={(e) => handleInteraction(e, option.id)}
                        onBlur={() => handleSaveEdit(option.id)}
                        className="p-1 rounded-md border pl-10 text-lg bg-transparent  w-fit"
                    />
                    ) : (
                    <>
                        <div className='flex items-center gap-2'>
                        <div className='px-2' onClick={(e)=>e.stopPropagation()}>
                        <IndividualCheckbox entry={option} selectedEntries={selectedOptions} handleCheckboxChange={handleCheckboxChange}/>
                        </div>
                        <div className="font-medium text-lg">{option.name}</div>
                        </div>
                        <div
                        onClick={(e) => e.stopPropagation()} // Stop propagation on delete click
                        >
                        <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-500 hover:text-blue-600 pr-4 transition-all duration-300 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button
                            onClick={() => handleDelete(option.id)}
                            className="text-red-500 hover:text-red-600 transition-all duration-300 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        </div>
                    </>
                    )}
                </div>
                </div>
            ))}
            </div>

            <div className='flex justify-center'>
            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{
                            color: 'var(--primary-text)',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--pagination-500-important)',
                            },
                        }}
                    />
                )}
            /></div> </>) :  (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Lottie 
                    animationData={noDataAnimation} 
                    loop={true} 
                    style={{ width: 150, height: 150 }} 
                />
                <p className="text-gray-500 text-lg">There are no options to display.</p>
            </div>
               )
        }
        </div>
    );
};

export default CardOptions;
