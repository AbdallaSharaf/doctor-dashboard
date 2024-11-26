import React from 'react';
import { formatDateTime } from '../helpers/Helpers';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const App = () => {
  const currentTime = new Date();
  const appointments = useSelector((state) => state.appointments.list);

  // // Filter appointments for today
  const todayDate = currentTime.toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
  const todayAppointments = appointments.filter((appointment) =>
    appointment.date.startsWith(todayDate)
  );

  console.log(appointments[0].date)
  console.log(todayDate)

  return (
    <div className="p-4 bg-primary-bg">
      {/* Header Section */}
      <header className="mb-6">
        <div>
          <h1 className="text-2xl font-bold sidebar">
            Welcome, Dr. Smith!
          </h1>
          <p className="text-lg font-medium sidebar opacity-60">
            {formatDateTime(currentTime)}
          </p>
        </div>
      </header>

      {/* Today's Appointments */}
      <div className='grid grid-cols-3'>
      <section className='bg-table-container-bg '>
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        {todayAppointments.length > 0 ? (
          <ul className="space-y-4">
            {todayAppointments.map((appointment) => (
              <li
                key={appointment.id}
                className="p-4 shadow-md rounded-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">
                    {appointment.name}
                  </h3>
                  <p className="text-sm">
                    {appointment.time}
                  </p>
                </div>
                <p className="text-sm pt-2">
                  {appointment.phone}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No appointments for today.
          </p>
        )}
      </section>
      <section className='grid-cols-2'>
        <div className="p-7">
            <div className='flex justify-between items-center mb-6 '>
            <h2 className="text-lg font-semibold">Appointments</h2>
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
                    className="p-2 pl-8 sidebar border border-transparent rounded w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </div>
            
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (
                    currentAppointments.length > 0 ? 
            (<> <table className="w-full table-auto md:table hidden">
                <thead>
                    <tr className='text-center font-normal text-sm border-b-[16px] border-transparent'>
                        <th className="p-2">NO</th>
                        <th className="p-2 cursor-pointer">
                            Patient Name
                        </th>
                        <th className="p-2 cursor-pointer">
                            Date
                        </th>
                        <th className="p-2 cursor-pointer">
                            Time
                        </th>
                        <th className="p-2">Phone Number</th>
                        <th className=" cursor-pointer w-fit">
                            Status
                        </th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAppointments.map((appointment, index) => (
                        <tr ref={editId === appointment.id ? rowRef : null} onDoubleClick={() => handleEditClick(appointment)} key={appointment.id} className={`h-14 text-center ${index % 2 ===0 ? 'bg-even-row-bg':''}`}>
                            <td className="p-2">
                                <IndividualCheckbox entry={appointment} selectedEntries={selectedAppointments} handleCheckboxChange={handleCheckboxChange}/>
                            </td>
                            <td className="text-sm p-2">{index + 1}</td>
                            <td className="font-bold text-sm p-2">
                                {editId === appointment.id ? (
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={editData.name} 
                                        onChange={handleInputChange} 
                                        className="border max-w-40 border-gray-300 rounded p-1"
                                    />
                                ) : (
                                    appointment.name
                                )}
                            </td>
                            <td className=" text-sm p-2">
                            {editId === appointment.id ? (
                                    <input 
                                    type='date'
                                    name="date"
                                    value={editData.date} 
                                    onChange={handleInputChange} 
                                    className=""/>
                                ) : (
                                    appointment.date
                                )}
                            </td>
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <input 
                                        type='time'
                                        name="time"
                                        value={editData.time} 
                                        onChange={handleInputChange} 
                                        className=""
                                    />
                                ) : (
                                    appointment.time
                                )}
                            </td>
                            <td className="text-sm p-2" onMouseEnter={() => setPhoneHovered(appointment.id)} onMouseLeave={() => setPhoneHovered(null)}>
                                {editId === appointment.id ? (
                                    <input 
                                        type="text" 
                                        name="phone"
                                        value={editData.phone} 
                                        onChange={handleInputChange} 
                                        className="border border-gray-300 rounded p-1 max-w-32"
                                    />
                                ) : (
                                    <PhoneWithActions phone={appointment.phone} handleCopyPhone={handleCopyPhone} handleReply={handleReply} isHovered={phoneHovered} id={appointment.id}/>
                                )}
                            </td>
                            <td className={``}>
                                {editId === appointment.id && (appointment.status === 'pending' || appointment.status === 'approved' || appointment.status === 'cancelled') ? (
                                    <div className='w-[125px] mx-auto'>
                                        <CustomDropdown
                                            options={editableStatusOptions}
                                            selectedStatus={{ value: editData.status, label: `${editData.status}` }}
                                            setSelectedStatus={(status) =>
                                                setEditData((prev) => ({ ...prev, status }))
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className={`font-semibold text-opacity-70 text-sm p-1 mx-auto rounded-md bg-opacity-20 ${getStatusClass(appointment.status)} max-w-[85px] text-center justify-center items-center`}>
                                       {capitalizeFirstLetter(appointment.status)}</div>
                                )}
                            </td>
                            <td className=" text-sm p-2">
                                {editId === appointment.id ? (
                                    <div className="space-x-2 mx-auto flex items-center justify-center h-[38px]">
                                        <button onClick={() =>handleSave(editId)} className="bg-green-500 hover:bg-green-400 text-secondary-text rounded p-1  transition duration-150 w-16">
                                            Save
                                        </button>
                                        <button onClick={() => setEditId(null)} className="bg-red-500 text-white py-1 rounded-md hover:bg-red-400 transition duration-150 w-16">
                                            Discard
                                        </button>
                                    </div>
                                ) : (<>
                                    <ActionsDropdown
                                        appointment={appointment}
                                        handleChangeStatus={handleChangeStatus}
                                        handleEditClick={handleEditClick}
                                        handleRejectDelete={handleDeleteAppointment}
                                        handleReply={handleReply}
                                        handleAddPatient={handleAddPatient}
                                    />
                                    <AddPatient patientData={addPatientModalAppointment} isModalOpen={isAddPatientModalOpen} onClose={setIsAddPatientModalOpen} />
                                    </>
                                )}
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
                            handleChangeStatus={handleChangeStatus}
                            handleEditClick={handleEditClick}
                            handleRejectDelete={handleDeleteAppointment}
                            handleReply={handleReply}
                            handleAddPatient={handleAddPatient}
                        />
                        <AddPatient patientData={addPatientModalAppointment} isModalOpen={isAddPatientModalOpen} onClose={setIsAddPatientModalOpen} />
                        </div>
                    </div>
                    <MobileViewModal 
                        isOpen={isMobileViewModalOpen} 
                        onClose={closeMobileViewModal} 
                        appointment={mobileViewAppointment}
                        handleChangeStatus={handleChangeStatus}
                        handleEditClick={handleEditClick}
                        handleRejectDelete={handleDeleteAppointment}
                        handleReply={handleReply}
                        handleAddPatient={handleAddPatient}
                        handleCopyPhone={handleCopyPhone}
                    />
                    </div>
                ))}
            </div>
            </>) : (
         <div className="flex flex-col items-center justify-center h-64 space-y-4">
         <Lottie 
             animationData={noDataAnimation} 
             loop={true} 
             style={{ width: 150, height: 150 }} 
             className="mb-4"
         />
         <p className="text-gray-500 text-lg">There are no appointments to display.</p>
     </div>
        ))}
            <div className="mt-4 flex justify-center md:justify-between text-secondary-text">
            <div className="mb-4 justify-between items-center hidden md:flex">
                <label htmlFor="appointments-per-page" className="text-primary-text mr-4">Show:</label>
                <div className='w-[150px]'>
                <CustomDropdown 
                    options={[5, 10, 20, 50, 100].map(option => ({ value: option, label: `${option} per page` }))} 
                    selectedStatus={{ value: appointmentsPerPage, label: `${appointmentsPerPage} per page` }} 
                    setSelectedStatus={(selected) => setAppointmentsPerPage(selected)} 
                />
                </div>
            </div>    
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

        </div>
      </section>
      </div>
    </div>
  );
};

export default App;
