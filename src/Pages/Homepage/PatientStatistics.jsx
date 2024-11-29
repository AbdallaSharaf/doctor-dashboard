import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import dayjs from "dayjs";
import CountUp from "react-countup"; // Import react-countup

// Customize the color palette for the pie chart
const colors = ["#FF7F7F", "#FFB74D", "#4CAF50", "#2196F3"];

const PatientsStatistics = ({ patients }) => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  // Calculate new patients this month
  const newPatientsThisMonth = patients.filter((patient) => {
    const firstAppointment = dayjs(patient.firstAppointmentDate);
    return firstAppointment.month() === currentMonth && firstAppointment.year() === currentYear;
  }).length;

  // Group patients by age range
  const ageGroups = {
    "0-14": 0,
    "15-40": 0,
    "41-60": 0,
    "61+": 0,
  };

  patients.forEach((patient) => {
    const age = patient.age;
    if (age <= 14) {
      ageGroups["0-14"]++;
    } else if (age <= 40) {
      ageGroups["15-40"]++;
    } else if (age <= 60) {
      ageGroups["41-60"]++;
    } else {
      ageGroups["61+"]++;
    }
  });

  // Prepare data for the pie chart
  const chartData = Object.entries(ageGroups).map(([group, count]) => ({
    name: group,
    value: count,
  }));

  // Total number of patients
  const totalPatients = patients.length;

  return (
    <section className="bg-table-container-bg shadow-md rounded-md p-7 h-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Patients Statistics</h2>
      <h2 className="">
        {dayjs().format("MMMM")}, {dayjs().year()}
      </h2>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-1 items-center justify-between gap-6">
        {/* Total Patients */}
        <div className="text-center h-[150px] bg-primary-bg rounded-md p-5 shadow-md transition-transform hover:scale-105 ease-in-out duration-300">
          <h3 className="text-lg font-medium mb-2">Total Patients</h3>
          <p className="text-3xl font-bold">
            <CountUp start={0} end={totalPatients} duration={2} separator="," />
          </p>
        </div>

        {/* New Patients */}
        <div className="text-center h-[150px] bg-primary-bg rounded-md p-5 shadow-md transition-transform hover:scale-105 ease-in-out duration-300">
          <h3 className="text-lg font-medium mb-2">New Patients</h3>
          <p className="text-3xl font-bold">
            <CountUp start={0} end={newPatientsThisMonth} duration={2} separator="," />
          </p>
        </div>

      {/* Patients by Age Group */}
      <div className="mt-6 col-span-2">
        <h3 className="text-lg font-medium text-center">Patients by Age Group</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>

    </section>
  );
};

export default PatientsStatistics;
