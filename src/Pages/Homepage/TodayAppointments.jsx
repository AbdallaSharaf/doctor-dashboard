import React from 'react';
import { convert12HourTo24Hour } from '../../helpers/Helpers';

const TodayAppointments = ({ appointments }) => {
    const currentTime = new Date();

    // Filter appointments for today
    const todayDate = currentTime.toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
    const todayAppointments = appointments
        .filter((appointment) => appointment.date.startsWith(todayDate))
        .sort((a, b) => {
            // Convert "5:00 PM" to Date objects and compare
            const timeA = new Date(`1970-01-01T${convert12HourTo24Hour(a.time)}`).getTime();
            const timeB = new Date(`1970-01-01T${convert12HourTo24Hour(b.time)}`).getTime();
            return timeA - timeB;
        });


    return (
        <section className="bg-table-container-bg col-span-2 shadow-md rounded-lg p-7 ">
            <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
            {todayAppointments.length > 0 ? (
                <ul className="space-y-4 h-[500px] overflow-y-auto scrollbar-hide">
                    {todayAppointments.map((appointment) => (
                        <li
                            key={appointment.id}
                            className="p-3 bg-primary-bg rounded-lg border border-gray-100 dark:border-transparent shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">{appointment.name}</h3>
                                    <p className="text-sm pt-2">{appointment.phone}</p>
                                </div>
                                <p className="text-sm">{appointment.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    No appointments for today.
                </p>
            )}
        </section>
    );
};

export default TodayAppointments;
