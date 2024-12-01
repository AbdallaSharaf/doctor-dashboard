import React from "react";
import { Pie } from "react-chartjs-2";
import dayjs from "dayjs";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

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
  const chartData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        data: Object.values(ageGroups),
        backgroundColor: ["#FF7F7F", "#FFB74D", "#4CAF50", "#2196F3"],
        hoverBackgroundColor: ["#E57373", "#FFA726", "#388E3C", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom", // Move legend below the chart
        labels: {
          font: {
            size: 15, // Customize font size
          },
          boxWidth: 18,
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // Custom title
            return `Age Group: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            // Custom label content
            const value = tooltipItem.raw; // Get the raw value
            return `Total Patients: ${value}`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Optional: Change background color
        titleFont: {
          size: 16, // Title font size
        },
        bodyFont: {
          size: 14, // Body font size
        },
        padding: 10, // Padding inside the tooltip
        displayColors: true, // Hide color boxes in the tooltip
      },
    },
    maintainAspectRatio: true, // Allow resizing
  };
  
  

  // Total number of patients
  const totalPatients = patients.length;

  return (
    <section className="bg-table-container-bg shadow-md rounded-md p-7 h-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patients Statistics</h2>
        <h2>
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
          <div className="w-full h-[300px]">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientsStatistics;
