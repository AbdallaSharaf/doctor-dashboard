import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer } from "recharts";

const PerformanceAnalysis = ({ patients, appointments }) => {
  const doctors = useSelector((state) => state.team.members);
  const currentMonth = dayjs().month(); // Current month
  const currentYear = dayjs().year(); // Current year

  // 1. Most Popular Service This Month
  const getMostPopularService = () => {
    const serviceCount = {};

    patients.forEach((patient) => {
      patient.records.forEach((record) => {
        const recordDate = dayjs(record.dueDate);
        if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
          serviceCount[record.service] = (serviceCount[record.service] || 0) + 1;
        }
      });
    });

    if (Object.keys(serviceCount).length === 0) {
      return null; // Return null or a fallback value
    }

    return Object.entries(serviceCount).map(([service, count]) => ({
      name: service,
      value: count,
    }));
  };

  // 2. Percentage of Completed Appointments
  const getCompletedAppointmentsPercentage = () => {
    let totalAppointments = 0;
    let completedAppointments = 0;

    appointments.forEach((appointment) => {
      const recordDate = dayjs(appointment.date);
      if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
        totalAppointments++;
        if (appointment.status !== "canceled") {
          completedAppointments++;
        }
      }
    });

    return totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
  };

  // 3. Best Doctor for the Month
  const getBestDoctor = () => {
    const doctorCount = {};

    patients.forEach((patient) => {
      patient.records.forEach((record) => {
        const recordDate = dayjs(record.dueDate);
        if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
          doctorCount[record.doctorTreating] = (doctorCount[record.doctorTreating] || 0) + 1;
        }
      });
    });

    if (Object.keys(doctorCount).length === 0) {
      return null;
    }

    const bestDoctorId = Object.keys(doctorCount).reduce((a, b) =>
      doctorCount[a] > doctorCount[b] ? a : b
    );

    const bestDoctor = doctors.find((doctor) => doctor.name === bestDoctorId);
    return bestDoctor;
  };

  const mostPopularService = getMostPopularService();
  const completedAppointmentsPercentage = getCompletedAppointmentsPercentage();
  const bestDoctor = getBestDoctor();

  return (
    <section className="bg-table-container-bg shadow-md col-span-2 rounded-md p-7 h-auto">
      <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
      <div className="grid grid-cols-1  gap-6">
        {/* Most Popular Service */}
        <div className="mb-6 grid">
          <h3 className="text-lg font-medium mb-2">Most Popular Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mostPopularService}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
=              <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Completed Appointments Percentage */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium mb-2">Completed Appointments</h3>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={[
        { name: "Completed", value: completedAppointmentsPercentage },
        { name: "Pending", value: 100 - completedAppointmentsPercentage }
      ]}
      innerRadius="60%"
      outerRadius="80%"
      fill="#8884d8"
      paddingAngle={5}
      dataKey="value"
    >
      <Cell key="completed" fill="#4CAF50" />
      <Cell key="pending" fill="#FF7F7F" />
      <Label
        value={`${Math.round(completedAppointmentsPercentage)}%`}
        position="center"
        fontSize={24}
        fontWeight="bold"
        className="text-black dark:text-white"
      />
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
        </div>

        {/* Best Doctor */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium mb-2">Best Doctor This Month</h3>
          <div className="flex justify-center items-center">
            <img
              src={bestDoctor?.image} // Display doctor's image
              alt={bestDoctor?.name}
              className="w-16 h-16 rounded-full border-2 border-primary-bg"
            />
            <p className="text-xl font-semibold ml-4">{bestDoctor?.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceAnalysis;
