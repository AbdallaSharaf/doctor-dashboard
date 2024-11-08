import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import CustomDropdown from '../components/CustomDropdown';
import Spinner from '../components/Spinner';
import { PaginationItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PatientActionsDropdown from '../components/PatientActionsDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateTime } from '../helpers/Helpers';
import { archivePatient } from '../store/slices/patientsSlice'; // Import Redux actions
import Swal from 'sweetalert2';



const Patients = () => {
    const patients = useSelector(state => state.patients.list); // Get patients from Redux state
    const loading = useSelector(state => state.patients.loading); // Loading state from Redux
    const teamMembers = useSelector(state => state.team.members);
    const [selectedPatients, setSelectedPatients] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage, setPatientsPerPage] = useState(5);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const dispatch = useDispatch()
    const handleCheckboxChange = (id) => {
        setSelectedPatients((prevSelected) =>
            prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
};

const handleBulkAction = async (action) => {
    switch (action) {
        case 'delete':
            try {
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'You are about to delete the selected patients. This action cannot be undone.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete them!',
                    cancelButtonText: 'Cancel'
                });
        
                if (result.isConfirmed) {
                    try {
                await Promise.all(selectedPatients.map(async id => await dispatch(archivePatient(id)))).then(setSelectedPatients([]))
                // Show success Swal
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `The selected patients have been deleted.`,
                    timer: 1000,
                    showConfirmButton: false
                });
                } catch (error) {
                    console.error('Error deleting patient:', error);
                    Swal.fire('Error!', 'There was a problem deleting the patient.', 'error');
                }          
            } }catch (error) {
                console.error('Error updating status:', error);
                Swal.fire('Error!', 'There was a problem deleting the selected patients.', 'error');
            }           
            break;
            case 'message':
                setSelectedPatients([])
                break;
                default:
                    break;
                }
    };
    
    
    // Define action handler functions
    const handleReply = (type, phoneNumber) => {
        if (type === 'call') {
            window.open(`tel:${phoneNumber}`);
        } else if (type === 'message') {
            window.open(`https://wa.me/${phoneNumber}`);
        }
    };
    
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This patient will be deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await dispatch(archivePatient(id))     
                Swal.fire('Deleted!', 'The patient has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting patient:', error);
                Swal.fire('Error!', 'There was a problem deleting the patient.', 'error');
            }
        }
    };
    
    const doctorImages = useMemo(() => {
        return teamMembers.reduce((acc, member) => {
            acc[member.name] = member.image;
            return acc;
        }, {});
    }, [teamMembers]);

    const doctorNames = useMemo(() => {
        return teamMembers.map(member => ({
            value: member.name,
            label: member.name,
        }));
    }, [teamMembers]);
    
    const filterOptions = [
        { value: 'All', label: 'All' },
        ...doctorNames,
    ];

    
    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const nameMatch = patient.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const phoneMatch = patient.phone?.toLowerCase().includes(searchQuery.toLowerCase());
            const statusMatch = selectedStatus === 'All' || 
            (patient.records && Object.values(patient.records).some(record => record.doctorTreating === selectedStatus));
            return (nameMatch || phoneMatch) && statusMatch;
        });
    }, [patients, searchQuery, selectedStatus]);
    
    const getNextAppointmentDate = (records) => {
        const futureAppointments = records
          .map(record => new Date(record.nextAppointmentDate))
          .filter(date => date > new Date()); // Only keep future dates
        if (futureAppointments.length === 0) {
          return "No upcoming appointments";
        }
        const nextAppointment = new Date(
          Math.min(...futureAppointments.map(date => date.getTime()))
        );
      
        return nextAppointment.toLocaleDateString(); // Format as needed
      }
    
      function getTotalAmounts(records) {
        const totals = records.reduce(
          (acc, record) => {
            acc.totalPaid += record.price.paid || 0;
            acc.totalRemaining += record.price.remaining || 0;
            return acc;
          },
          { totalPaid: 0, totalRemaining: 0 }
        );

          // Remove decimal points by flooring or rounding
            const totalPaid = Math.floor(totals.totalPaid);
            const totalRemaining = Math.floor(totals.totalRemaining);
                
        return `(${totalPaid}, ${totalRemaining})`;
      }

    // Sort records by dueDate in ascending order
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    const currentPatients = filteredPatients.slice((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage);
    return (
        <div className="p-7 w-full">
            <div className='flex justify-between mb-6'>
                <h2 className="text-lg font-semibold">Patients</h2>
                <Link to="/add-patient" className="mb-2 py-2 px-4 bg-primary-btn hover:bg-hover-btn w-[170px] text-center text-white rounded">
                    Add Patient
                </Link>
            </div>
            <div className='p-7 rounded-md shadow-[10px_10px_10px_10px_rgba(0,0,0,0.04) border border-gray-200]'>
                <div className='flex justify-between items-center  mb-7'>
                <div className='flex gap-4 w-full'>
                <div className='w-44'>
                    <CustomDropdown 
                        options={filterOptions} 
                        selectedStatus={{ value: selectedStatus, label: `${selectedStatus}` }} 
                        setSelectedStatus={setSelectedStatus} 
                    />
                </div>
                <div className="text-sm">
                    {selectedPatients.length > 0 && 
                        <div className="flex">
                            <button onClick={() => handleBulkAction('message')} className="bg-primary-btn hover:bg-hover-btn text-secondary-text rounded p-2 text-sm">
                                Send Message
                            </button>
                            <button onClick={() => handleBulkAction('delete')} className="ml-4 p-2 text-sm hover:bg-gray-100 rounded text-primary-text">
                                Delete All
                            </button>
                        </div>
                    }
                </div>
                </div>
                    <div className="relative p-2 text-sm">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass} 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        />
                        <input
                            type="text"
                            placeholder="Search Patients"
                            className="p-2 pl-8 bg-gray-100 rounded w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className='text-center border-b-[16px] border-white'>
                                <th className="px-2 ">
                                    <input
                                    type="checkbox"
                                    className='scale-125'
                                    onChange={(e) =>
                                        setSelectedPatients(
                                            e.target.checked ? patients.map(patient => patient.id) : []
                                        )
                                    }
                                    checked={selectedPatients.length === patients.length && patients.length > 0}/>
                                </th>
                                <th className="font-normal text-sm p-2">No</th>
                                <th className="font-normal text-sm p-2">Name</th>
                                <th className="font-normal text-sm p-2">First Appointment</th>
                                <th className="font-normal text-sm p-2">Next Appointment</th>
                                <th className="font-normal text-sm p-2">
                                    <div>
                                        <h1>Total Payments</h1>
                                        <h1>(Paid, Remaining)</h1>
                                    </div>
                                </th>
                                <th className="font-normal text-sm p-2">Doctor Treating</th>
                                <th className="font-normal text-sm p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPatients.map((patient, index) => (
                                <tr key={patient.id} className={`text-center ${index % 2 === 0 ? 'bg-gray-100 bg-opacity-80' : ''} h-14`}>
                                    <td className="p-2">
                                        <input
                                        type="checkbox"
                                        className='scale-125'
                                        checked={selectedPatients.includes(patient.id)}
                                        onChange={() => handleCheckboxChange(patient.id)}/>
                                    </td>
                                    <td className="text-sm p-2">{(currentPage - 1) * patientsPerPage + index + 1}</td>
                                    <td className="font-bold text-sm p-2">
                                        <Link to={`/patients/patient-details/${patient.id}`}>
                                            {patient.name}
                                        </Link>
                                    </td>
                                    <td className="text-sm p-2">{formatDateTime(patient.firstAppointmentDate)}</td>
                                    <td className="text-sm p-2">{getNextAppointmentDate(patient.records)}</td>
                                    <td className="text-sm p-2">{getTotalAmounts(patient.records)}</td>
                                    <td className="text-sm p-2">
                                    <div className="relative flex justify-center group gap-2">
                                    {patient.records && (() => {
                                        const uniqueDoctors = Array.from(
                                            new Set(Object.values(patient.records).map(record => record.doctorTreating))
                                        );

                                        return (
                                            <>
                                            {/* Display up to 3 doctor images */}
                                            {uniqueDoctors.slice(0, 2).map((doctorId, i) => (
                                                <img 
                                                key={i} 
                                                src={doctorImages[doctorId]} 
                                                alt={`Doctor treating ${patient.name}`} 
                                                className="w-8 h-8 rounded-full" 
                                                />
                                            ))}

                                            {/* Show additional doctor count if more than 3 */}
                                            {uniqueDoctors.length > 1 && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-xs font-semibold rounded-full cursor-pointer relative">
                                                +{uniqueDoctors.length - 1}

                                                {/* Hover block showing all doctor images */}
                                                <div className="absolute top-full mt-1 hidden group-hover:inline-flex gap-2 bg-white shadow-lg border border-gray-200 z-50 w-auto min-w-max px-2 py-1 rounded-md">
                                                
                                                {uniqueDoctors.slice(2).map((doctorId, j) => (
                                                    <img 
                                                        key={j} 
                                                        src={doctorImages[doctorId]} 
                                                        alt={`Doctor treating ${patient.name}`} 
                                                        className="w-8 h-8 rounded-full" 
                                                    />
                                                    ))}
                                                </div>
                                                </div>
                                            )}
                                            </>
                                        );
                                        })()}
                                    </div>
                                    </td>
                                    <td className="text-sm p-2">
                                        <PatientActionsDropdown
                                            patient={patient}
                                            onReply={handleReply}
                                            onDelete={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="mt-4 flex justify-between">
            <div className="mb-4 flex justify-between items-center">
                <label htmlFor="patients-per-page" className="mr-4">Show:</label>
                <div className='w-[150px]'>
                <CustomDropdown 
                    options={[5, 10, 20, 50, 100].map(option => ({ value: option, label: `${option} per page` }))} 
                    selectedStatus={{ value: patientsPerPage, label: `${patientsPerPage} per page` }} 
                    setSelectedStatus={(selected) => setPatientsPerPage(selected)} 
                />
                </div>
            </div>    
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                shape="rounded"
                color="#1B84FF"
                siblingCount={1} // Show one sibling on each side of the current page
                boundaryCount={1} 
                renderItem={(item) => (
                    <PaginationItem {...item} />
                )}
            />
            </div>
            </div>
        </div>
    );
};

export default Patients;
