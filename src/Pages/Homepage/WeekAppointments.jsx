import React from 'react';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, getStatusClass, statusOptions } from '../../helpers/Helpers';
import PhoneWithActions from '../../components/actions/PhoneWithActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Pagination, PaginationItem } from '@mui/material';
import CustomDropdown from '../../components/CustomDropdown';
import ActionsDropdown from '../../components/actions/AppointmentsActionsDropdown';
import {deleteAppointment, updateAppointment} from '../../store/slices/appointmentsSlice';
import { MobileViewModal } from '../../components/modals/MobileViewModal';
import AddPatient from '../AddPatient';
import Spinner from '../../components/Spinner';

const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
  ];

const WeekAppointments = ({appointments}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const loading = useSelector((state) => state.appointments.loading);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [phoneHovered, setPhoneHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [addPatientModalAppointment, setAddPatientModalAppointment] = useState(false);
    const [isMobileViewModalOpen, setIsMobileViewModalOpen] = useState(false);
    const [mobileViewAppointment, setMobileViewAppointment] = useState(null);
    const patients = useSelector(state => state.patients.list)
    
    const openMobileViewModal = (appointment) => {
        setMobileViewAppointment(appointment)
        setIsMobileViewModalOpen(true);
    };
    
    const closeMobileViewModal = () => {
        setIsMobileViewModalOpen(false);
        setMobileViewAppointment(null)
    };
    
    
      const handleDeleteAppointment = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This appointment will be deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await dispatch(deleteAppointment(id));
                Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting appointment:', error);
                Swal.fire('Error!', 'There was a problem deleting the appointment.', 'error');
            }
        }
    };
    
    
    const handleAddPatient = async (appointment) => {
        // Extract necessary data from the appointment
        const patientData = {
            name: appointment.name,
            phone: appointment.phone,
            age: appointment.age,
            gender: appointment.gender,
            problem: appointment.problem,
            appointmentDate: appointment.date,
            appointmentTime: appointment.time,
        };

        
        // Check for existing patients by phone number
        const existingPatient = patients.find(patient => patient.phone === patientData.phone);
    
        if (existingPatient) {
            // Show SweetAlert prompt if patient already exists
            Swal.fire({
                title: 'Patient Already Exists',
                text: 'A patient with this phone number already exists. Would you like to view their data or add a new record?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add Record',
                cancelButtonText: 'View Data'
            }).then((result) => {
                if (result.isConfirmed) {
                    // If user chooses to add a record, navigate to patient details and trigger modal open
                    navigate(`/patients/patient-details/${existingPatient.id}`, {
                        state: { openAddRecordModal: true }  // Pass state to open modal
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // If user chooses to view data, navigate to patient details without opening the modal
                    navigate(`/patients/patient-details/${existingPatient.id}`);
                }
            });
        } else {
            // If no matching patient, navigate to add-patient form with pre-filled data
            setIsAddPatientModalOpen(true)
            setAddPatientModalAppointment(appointment)
        }
    };
    
      const handleReply = (type, phoneNumber) => {
        if (type === 'call') {
            window.open(`tel:${phoneNumber}`);
        } else if (type === 'whatsapp') {
            console.log('clicked')
            window.open(`https://wa.me/${phoneNumber}`);
        }
    };
    const handleChangeStatus = async (id, newStatus) => {
        console.log('clicked')
        await dispatch(updateAppointment({ id: id, updatedData: { status: newStatus } }));
    };
    
    const handleCopyPhone = (phone) => {
        navigator.clipboard.writeText(phone)
          .then(() => {
            alert('Phone number copied!');
          })
          .catch((err) => {
            console.error('Error copying phone number:', err);
          });
      };
    
      const filterNextWeekAppointments = useMemo(() => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date); // Ensure `appointment.date` is in YYYY-MM-DD format
            return appointmentDate >= today && appointmentDate <= nextWeek;
        });
    }, [appointments]);

      const filteredAppointments = React.useMemo(() => {
        return filterNextWeekAppointments.filter((appointment) => {
            const nameMatch = appointment.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const phoneMatch = appointment.phone?.toLowerCase().includes(searchQuery.toLowerCase());
            const statusMatch = selectedStatus === 'All' || appointment.status === selectedStatus;
            return (nameMatch || phoneMatch) && statusMatch;
        });
        }, [filterNextWeekAppointments, searchQuery, selectedStatus]);
    
    
      const totalPages = Math.ceil(filteredAppointments.length / 10);
      const indexOfLastAppointment = currentPage * 10;
      const indexOfFirstAppointment = indexOfLastAppointment - 10;
      const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

      
  return (
    <section className='col-span-3 bg-table-container-bg shadow-md rounded-lg p-7 relative'>
            <div className='flex justify-between items-center mb-6 '>
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            <Link
                to={'/appointments'}
                className="py-2 px-4 bg-primary-btn hover:bg-hover-btn text-white rounded flex items-center justify-center w-[170px]"
                >
                Veiw all
            </Link>
            </div>
            <div className='flex justify-between items-center mb-6'>
            <div className='flex gap-4 items-center'>
            <div className='w-[140px]'>
            <CustomDropdown
                options={statusOptions}
                selectedStatus={{ value: selectedStatus, label: `${selectedStatus}` }}
                setSelectedStatus={setSelectedStatus}
            />
            </div>
            </div>
            <div className="relative p-2 text-sm">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                />
                <input
                    type="text"
                    placeholder="Search Appointment"
                    className="p-2 pl-8 bg-primary-bg border border-transparent rounded w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </div>
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
            <>
            <div className='min-h-[500px]'>
            <table className="w-full table-auto md:table hidden ">
                <thead>
                    <tr className='text-center font-normal text-sm border-b-[16px] border-transparent'>
                        <th className=""></th>
                        <th className="p-2">
                            Patient Name
                        </th>
                        <th className="p-2">
                            Date
                        </th>
                        <th className="p-2">
                            Time
                        </th>
                        <th className="p-2">Phone Number</th>
                        <th className="w-fit">
                            Status
                        </th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {currentAppointments.map((appointment, index) => (
                        <tr key={appointment.id} className={`max-h-14 text-center ${index % 2 ===0 ? 'bg-even-row-bg':''}`}>
                            <td className="py-2">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center ${colors[index % colors.length]} text-white font-semibold rounded-full shadow-xl`}
                                >
                                    {appointment.name?.charAt(0).toUpperCase()}
                                </div>
                            </td>                            
                            <td className="font-bold text-sm p-2">{appointment.name}</td>
                            <td className=" text-sm p-2">{appointment.date}</td>
                            <td className=" text-sm p-2">{appointment.time}</td>
                            <td className="text-sm p-2" onMouseEnter={() => setPhoneHovered(appointment.id)} onMouseLeave={() => setPhoneHovered(null)}>
                                <PhoneWithActions phone={appointment.phone} handleCopyPhone={handleCopyPhone} handleReply={handleReply} isHovered={phoneHovered} id={appointment.id}/>
                            </td>
                            <td>
                                <div className={`font-semibold text-opacity-70 text-sm p-1 mx-auto rounded-md bg-opacity-20 ${getStatusClass(appointment.status)} max-w-[85px] text-center justify-center items-center`}>
                                    {capitalizeFirstLetter(appointment.status)}
                                </div>
                            </td>
                            <td className=" text-sm p-2">
                                <>
                                    <ActionsDropdown
                                        appointment={appointment}
                                        handleRejectDelete={handleDeleteAppointment}
                                        handleChangeStatus={handleChangeStatus}
                                        handleAddPatient={handleAddPatient}
                                    />
                                    <AddPatient patientData={addPatientModalAppointment} isModalOpen={isAddPatientModalOpen} onClose={setIsAddPatientModalOpen} />
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className='flex flex-col justify-between items-center md:hidden'>
                {currentAppointments.map((appointment, id) => (
                    <div className={`${id % 2 ===0 ? 'bg-even-row-bg':''} flex justify-between items-center w-full px-3 py-2`} key={id}>
                    <div className='flex justify-between items-center w-full' onClick={() => openMobileViewModal(appointment)}>
                        <div >
                        <p className='font-medium'>{appointment.name}</p>
                        <p className='text-sm font-light'>{appointment.date}</p>
                        <p className={`${getStatusClass(appointment.status)} bg-opacity-0 text-sm`}>{capitalizeFirstLetter(appointment.status)}</p>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                        <ActionsDropdown
                            appointment={appointment}
                            handleRejectDelete={handleDeleteAppointment}
                            handleAddPatient={handleAddPatient}
                            handleChangeStatus={handleChangeStatus}
                            />
                        <AddPatient patientData={addPatientModalAppointment} isModalOpen={isAddPatientModalOpen} onClose={setIsAddPatientModalOpen} />
                        </div>
                    </div>
                    <MobileViewModal 
                        isOpen={isMobileViewModalOpen} 
                        onClose={closeMobileViewModal} 
                        appointment={mobileViewAppointment}
                        handleRejectDelete={handleDeleteAppointment}
                        handleReply={handleReply}
                        handleAddPatient={handleAddPatient}
                        handleCopyPhone={handleCopyPhone}
                    />
                    </div>
                ))}
            </div>
            </div>
            </>
            )}
            <div className="mt-4 flex justify-center md:justify-end text-secondary-text"> 
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
                classes={{
                    root: "text-primary-text dark:text-primary-text", // Default text color
                    selected: "bg-pagination-500-important dark: bg-pagination-500-dark-important", // Use the important class
                }}
                />
            )}
            />
            </div>
      </section>
  )
}

export default WeekAppointments