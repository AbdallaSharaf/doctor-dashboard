import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../helpers/Helpers";
import CustomDropdown from "../../components/CustomDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Lottie from 'lottie-react';
import noDataAnimation from '../../assets/Animation - 1730816811189.json'

// Define a fixed color palette for services
const colorPalette = [
    "#FF7F7F", // Pink
    "#FFB74D", // Orange
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#FFC107", // Yellow
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#8BC34A", // Light Green
    "#FF4081", // Light Pink
    "#3F51B5", // Indigo
    "#FF9800", // Deep Orange
    "#8E24AA", // Deep Purple
    "#009688", // Teal
    "#CDDC39", // Lime
    "#F44336", // Red
  ];

const RevenueChart = ({ patients }) => {
  const [selectedService, setSelectedService] = useState("All");
  const [currentTimespan, setCurrentTimespan] = useState(dayjs()); // Default to today
  const [timespanType, setTimespanType] = useState("month"); // Default timespan type
  const services = useSelector((state) => state.services.list.map((service) => service.name));
  
  // Store colors assigned to services
  const serviceColors = {};

  // 1. Filter Records by Timespan
  const filterByTimespan = () => {
    return patients.flatMap((patient) =>
      patient.records.filter((record) => {
        const recordDate = dayjs(record.dueDate);

        if (timespanType === "month") {
          // Match month and year
          return recordDate.isSame(currentTimespan, "month");
        }
        if (timespanType === "quarter") {
          // Match quarter and year
          const currentQuarter = Math.floor(currentTimespan.month() / 3); // 0-based quarter
          const recordQuarter = Math.floor(recordDate.month() / 3);
          return currentQuarter === recordQuarter && recordDate.year() === currentTimespan.year();
        }
        if (timespanType === "year") {
          // Match year
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

        // Add the revenue and round it to the nearest whole number
        const totalRevenue = revenueByService[record.service].revenue + revenue;
        revenueByService[record.service].revenue = Math.round(totalRevenue);

      // Assign a color to each service based on the color palette
      if (!serviceColors[record.service]) {
        const serviceIndex = services.indexOf(record.service);
        serviceColors[record.service] = colorPalette[serviceIndex % colorPalette.length];
      }
      revenueByService[record.service].color = serviceColors[record.service];
    });

    return Object.values(revenueByService);
  };

  // Processed Data
  const filteredRecords = filterByService(filterByTimespan());
  const chartData = groupRevenueByService(filteredRecords);

    // Calculate total revenue
    const totalRevenue = chartData.reduce((sum, entry) => sum + entry.revenue, 0);

  // Handlers for the Slider
  const handlePrev = () => {
    setCurrentTimespan((prev) => {
      if (timespanType === "month") {
        return prev.subtract(1, "month");
      }
      if (timespanType === "quarter") {
        const newMonth = prev.month() - 3; // Move 3 months back
        return prev.month(newMonth).startOf("month"); // Ensure we adjust to the start of the new quarter
      }
      if (timespanType === "year") {
        return prev.subtract(1, "year");
      }
      return prev;
    });
  };

  const handleNext = () => {
    setCurrentTimespan((prev) => {
      if (timespanType === "month") {
        return prev.add(1, "month");
      }
      if (timespanType === "quarter") {
        const newMonth = prev.month() + 3; // Move 3 months forward
        return prev.month(newMonth).startOf("month"); // Ensure we adjust to the start of the new quarter
      }
      if (timespanType === "year") {
        return prev.add(1, "year");
      }
      return prev;
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        console.log(payload)
      return (
        <div className="bg-primary-bg p-7 w-fit">
          <p className="text-right text-xl font-semibold mb-6">{`${label}`}</p>
          <p className="font-thin">Revenue: <strong className="font-medium">{payload[0].value}</strong> EGP</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <section className="bg-table-container-bg shadow-md col-span-3 rounded-md p-7 h-auto">
    {/* Filters */}
    <div className="flex flex-col md:flex-row justify-between items-center">
      <h2 className="text-xl font-semibold mb-4">Revenue</h2>
      <div className="mb-4 flex gap-4">
        <div className="w-[150px]">
          <CustomDropdown
            options={[{ value: "All", label: "All Services" }, ...services.map((option) => ({ value: option, label: option }))]}
            selectedStatus={{ value: selectedService || "All", label: selectedService || "All Services" }}
            setSelectedStatus={(selected) => setSelectedService(selected === "all" ? null : selected)}
          />
        </div>
        <div className="w-[120px]">
          <CustomDropdown
            options={["month", "quarter", "year"].map((option) => ({ value: option, label: `${capitalizeFirstLetter(option)}ly` }))}
            selectedStatus={{ value: timespanType, label: `${capitalizeFirstLetter(timespanType)}ly` }}
            setSelectedStatus={(selected) => setTimespanType(selected)}
          />
        </div>
      </div>
    </div>
    <div className="mx-4 mb-6 w-full justify-between flex gap-4 items-center">
      <button onClick={handlePrev} className="h-8 w-8 rounded-md bg-primary-bg">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className="leading-none text-lg pt-2">
        {currentTimespan.format(
          timespanType === "month"
            ? "MMMM YYYY"
            : timespanType === "quarter"
            ? `[Q]${Math.floor(currentTimespan.month() / 3) + 1} YYYY`
            : "YYYY"
        )}
      </div>
      <button onClick={handleNext} className="h-8 w-8 rounded-md bg-primary-bg">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
    {/* Chart or No Data Message */}
    {chartData.length > 0 ? (
      <>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Total Revenue Display */}
        <div className="mt-4 text-center text-lg">
          <p>Total Revenue: <strong>{totalRevenue.toLocaleString()}</strong> EGP</p>
        </div>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
         <Lottie 
             animationData={noDataAnimation} 
             loop={true} 
             style={{ width: 150, height: 150 }} 
             className="mb-4"
         />
         <p className="text-gray-500 text-lg">There are no data for this {timespanType}.</p>
     </div>
    )}
  </section>
  );
};

export default RevenueChart;
