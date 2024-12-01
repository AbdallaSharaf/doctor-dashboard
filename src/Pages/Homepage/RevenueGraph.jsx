import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../helpers/Helpers";
import CustomDropdown from "../../components/CustomDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Lottie from 'lottie-react';
import noDataAnimation from '../../assets/Animation - 1730816811189.json';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

// Define a fixed color palette for services
const colorPalette = [
  "#FF7F7F", "#FFB74D", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0",
  "#00BCD4", "#8BC34A", "#FF4081", "#3F51B5", "#FF9800", "#8E24AA",
  "#009688", "#CDDC39", "#F44336",
];

const RevenueChart = ({ patients }) => {
  const [selectedService, setSelectedService] = useState("All");
  const [currentTimespan, setCurrentTimespan] = useState(dayjs());
  const [timespanType, setTimespanType] = useState("month");
  const services = useSelector((state) => state.services.list.map((service) => service.name));
  
  // Store colors assigned to services
  const serviceColors = {};

  // 1. Filter Records by Timespan
  const filterByTimespan = () => {
    return patients.flatMap((patient) =>
      patient.records.filter((record) => {
        const recordDate = dayjs(record.dueDate);

        if (timespanType === "month") {
          return recordDate.isSame(currentTimespan, "month");
        }
        if (timespanType === "quarter") {
          const currentQuarter = Math.floor(currentTimespan.month() / 3);
          const recordQuarter = Math.floor(recordDate.month() / 3);
          return currentQuarter === recordQuarter && recordDate.year() === currentTimespan.year();
        }
        if (timespanType === "year") {
          return recordDate.isSame(currentTimespan, "year");
        }
        return false;
      })
    );
  };

  // 2. Filter by Service
  const filterByService = (records) => {
    return selectedService === "All"
      ? records
      : records.filter((record) => record.service === selectedService);
  };

  // 3. Group Revenues by Service and Assign Colors
  const groupRevenueByService = (records) => {
    const revenueByService = {};

    records.forEach((record) => {
      const revenue = record.price.paid + record.price.remaining;
      if (!revenueByService[record.service]) {
        revenueByService[record.service] = { revenue: 0, service: record.service };
      }

      revenueByService[record.service].revenue += revenue;

      // Assign a color to each service based on the color palette
      if (!serviceColors[record.service]) {
        const serviceIndex = services.indexOf(record.service);
        serviceColors[record.service] = colorPalette[serviceIndex % colorPalette.length];
      }
    });

    return Object.entries(revenueByService).map(([service, data]) => ({
      ...data,
      color: serviceColors[service],
    }));
  };

  // Processed Data
  const filteredRecords = filterByService(filterByTimespan());
  const chartData = groupRevenueByService(filteredRecords);

  // Calculate total revenue
  const totalRevenue = chartData.reduce((sum, entry) => sum + entry.revenue, 0);

  // Prepare Chart.js Data
  const data = {
    labels: chartData.map((item) => item.service),
    datasets: [
      {
        label: "Revenue (EGP)",
        data: chartData.map((item) => item.revenue),
        backgroundColor: chartData.map((item) => item.color),
      },
    ],
  };

  // Chart.js Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: ${context.raw.toLocaleString()} EGP`,
        },
      },
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            // Custom title
            return `Service: ${tooltipItems[0].label}`;
          },
          label: (tooltipItem) => {
            // Custom label content
            const value = tooltipItem.raw; // Get the raw value
            return `Revenue: ${value}`;
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
    scales: {
      x: {
        title: {
          display: true,
          text: "Services",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue (EGP)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  // Handlers for the Slider
  const handlePrev = () => {
    setCurrentTimespan((prev) =>
      timespanType === "month" ? prev.subtract(1, "month") :
      timespanType === "quarter" ? prev.subtract(3, "month") :
      prev.subtract(1, "year")
    );
  };

  const handleNext = () => {
    setCurrentTimespan((prev) =>
      timespanType === "month" ? prev.add(1, "month") :
      timespanType === "quarter" ? prev.add(3, "month") :
      prev.add(1, "year")
    );
  };

  return (
    <section className="bg-table-container-bg shadow-md col-span-3 rounded-md p-7 h-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Revenue</h2>
        <div className="flex gap-4">
          <div className="w-[100px]">
          <CustomDropdown
            options={[{ value: "All", label: "All Services" }, ...services.map((option) => ({ value: option, label: option }))]}
            selectedStatus={{ value: selectedService, label: selectedService }}
            setSelectedStatus={setSelectedService}
          />
          </div>
          <div className="w-[120px]">
          <CustomDropdown
            options={["month", "quarter", "year"].map((option) => ({ value: option, label: `${capitalizeFirstLetter(option)}ly` }))}
            selectedStatus={{ value: timespanType, label: `${capitalizeFirstLetter(timespanType)}ly` }}
            setSelectedStatus={setTimespanType}
          />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrev} className="h-8 w-8 rounded-md bg-primary-bg">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span>
          {currentTimespan.format(
            timespanType === "month"
              ? "MMMM YYYY"
              : timespanType === "quarter"
              ? `[Q]${Math.floor(currentTimespan.month() / 3) + 1} YYYY`
              : "YYYY"
          )}
        </span>
        <button onClick={handleNext} className="h-8 w-8 rounded-md bg-primary-bg">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      {chartData.length > 0 ? (
        <div style={{ height: 400 }}>
          <Bar data={data} options={options} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Lottie animationData={noDataAnimation} loop={true} style={{ width: 150, height: 150 }} />
          <p className="text-gray-500 text-lg">There are no data for this {timespanType}.</p>
        </div>
      )}
      <div className="mt-4 text-center">
        <p>Total Revenue: <strong>{totalRevenue.toLocaleString()}</strong> EGP</p>
      </div>
    </section>
  );
};

export default RevenueChart;
