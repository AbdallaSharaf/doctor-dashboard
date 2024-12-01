import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Radar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,   // Register LineElement
  PointElement,  // Register PointElement
  CategoryScale, // Register CategoryScale for line charts (if using)
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,   // Register LineElement for line charts
  PointElement,  // Register PointElement for points in charts
  CategoryScale  // Register CategoryScale for line charts
);

const PerformanceAnalysis = ({ patients, appointments }) => {
  const doctors = useSelector((state) => state.team.members);
  const currentMonth = dayjs().subtract(1, 'month').month();  // Get the previous month
  const currentYear = dayjs().year();

  // 1. Most Popular Service (Radar Chart Data)
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

    return Object.entries(serviceCount).map(([service, count]) => ({
      name: service,
      value: count,
    }));
  };

  const mostPopularServiceData = getMostPopularService();
  const radarChartData = {
    labels: mostPopularServiceData.map((item) => item.name),
    datasets: [
      {
        label: "Frequency ",
        data: mostPopularServiceData.map((item) => item.value),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  // 2. Completed Appointments Percentage (Doughnut Chart Data)
  const getCompletedAppointmentsPercentage = () => {
    let totalAppointments = 0;
    let completedAppointments = 0;

    appointments.forEach((appointment) => {
      const recordDate = dayjs(appointment.date);
      if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
        totalAppointments++;
        if (appointment.status !== "cancelled") {
          completedAppointments++;
        }
      }
    });

    return [completedAppointments, totalAppointments];
  };

  const completedAppointmentsPercentage = getCompletedAppointmentsPercentage();
console.log()
  const doughnutChartData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        data: [
          completedAppointmentsPercentage[0],
          completedAppointmentsPercentage[1]-completedAppointmentsPercentage[0],
        ],
        backgroundColor: ["#4CAF50", "#FF7F7F"],
        borderWidth: 1,
      },
    ],
  };

  // 3. Best Doctor for the Month
  const getBestDoctor = () => {
    const doctorRecordCount = {}; // Track the number of records each doctor has handled
  
    patients.forEach((patient) => {
      patient.records.forEach((record) => {
        const recordDate = dayjs(record.dueDate);
        if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
          doctorRecordCount[record.doctorTreating] = (doctorRecordCount[record.doctorTreating] || 0) + 1;
        }
      });
    });
  
    const bestDoctorId = Object.keys(doctorRecordCount).reduce((a, b) =>
      doctorRecordCount[a] > doctorRecordCount[b] ? a : b, null
  );    
    return [doctors.find((doctor) => doctor.name === bestDoctorId), doctorRecordCount[bestDoctorId]] || null;
  };
  

  const bestDoctor = getBestDoctor();

  return (
    <section className="bg-table-container-bg shadow-md col-span-2 rounded-md p-7 h-auto">
      <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* Most Popular Service */}
        <div>
          <h3 className="text-lg font-medium mb-2">Most Popular Services</h3>
          {mostPopularServiceData.length > 0 ? (
            <Radar
              data={radarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  tooltip: { enabled: true },
                },
                scales: {
                  r: {
                    min: 0,
                    max: Math.max(...mostPopularServiceData.map((item) => item.value)) + 1, // Set max to the highest count + 1 to give some space
                    ticks: {
                      display: false
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 text-center">No data available for this month.</p>
          )}
        </div>

        {/* Completed Appointments */}
        <div>
          <h3 className="text-lg font-medium mb-2">Completed Appointments</h3>
          <Doughnut
            data={doughnutChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { position: "top" },
                tooltip: { enabled: true },
              },
            }}
          />
          <p className="text-center mt-4 text-lg">
            Completed: <strong>{Math.round((completedAppointmentsPercentage[0]*100/completedAppointmentsPercentage[1]))}%</strong>
          </p>
        </div>
      </div>

      {/* Best Doctor */}
      <div className="text-center mt-6">
        <h3 className="text-lg font-medium mb-2">Best Doctor This Month</h3>
        {bestDoctor ? (
          <div className="flex justify-center items-center">
            <img
              src={bestDoctor[0]?.image}
              alt={bestDoctor[0]?.name}
              className="w-16 h-16 rounded-full border-2 border-primary-bg"
            />
            <p className="text-xl font-semibold ml-4">{bestDoctor.name}</p>
            <div className="mt-2 text-gray-600">
              <p>
                <strong>{bestDoctor[0]?.name}</strong> handled <strong>{bestDoctor[1]}</strong> records this month, making them the best doctor for the month.
              </p>
              <p>
                Their excellent performance in treating patients has been recognized!
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No doctor data available for this month.</p>
        )}
      </div>

    </section>
  );
};

export default PerformanceAnalysis;
