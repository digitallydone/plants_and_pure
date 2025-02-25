export const weeks = [
  "week-1",
  "week-2",
  "week-3",
  "week-4",
  "week-5",
  "week-6",
  "week-7",
  "week-8",
  "week-9",
  "week-10",
  "week-11",
  "week-12",
  "week-13",
  "week-14",
  "week-15",
];

export const semester = ["first-semester", "second-semester"];
export const levels = ["100", "200", "300", "400", "600", "700"];
export const typeOfLecture = ["in-person", "online"];

export const session = ["regular", "evening", "weekend"];

export const officialTime = [
  "7:30am - 10:30am",
  "11:00am - 2:00pm",
  "2:15pm - 5:00pm",
  "12:30pm - 3:30pm",
  "5:30pm - 8:30pm",
  "6:30pm - 9:30pm",
];

export const class_start_time = [
  "On-time",
  "10mins late",
  "20mins late",
  "more than 30mins late",
];

export const class_end_time = [
  "On-time",
  "10mins early",
  "20mins early",
  "more than 30mins early",
];

export const isValidAcademicYear = (year) => {
  const regex = /^\d{4}\/\d{2}$/;
  return regex.test(year);
};

export const getAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;

  const formatAcademicYear = (year) =>
    `${year}/${(year + 1).toString().slice(-2)}`;

  return [formatAcademicYear(startYear), formatAcademicYear(startYear + 1)];
};

export const GetActualTimes = (filters, data, field) => {
  const result = {};

  filters.forEach((time) => {
    const filteredData = data.filter(
      (item) => item[field].toLowerCase() === time.toLowerCase()
    );
    result[time] = filteredData.length;
  });

  return result;
};

// //  ******************** //



// Function to convert 12-hour format to 24-hour format
function convertTo24Hour(time) {
  const [hour, minute] = time.split(/[: ]/);
  const modifier = time.slice(-2); // Extract 'am' or 'pm'
  let hours = parseInt(hour, 10);
  let minutes = minute || "00";

  if (modifier === "pm" && hours < 12) {
    hours += 12;
  }
  if (modifier === "am" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Function to get the current time in 24-hour format (+1)
function getCurrentTimeIn24Hour() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Function to check if the current time falls within any of the official time ranges
export function getMatchingAttendanceTimes() {
  const currentTime = getCurrentTimeIn24Hour();
  console.log("====================================");
  // console.log(currentTime);
  console.log("====================================");

  return officialTime.filter((timeRange) => {
    const [rangeStart, rangeEnd] = timeRange.split(" - ");
    const rangeStart24 = convertTo24Hour(rangeStart);
    const rangeEnd24 = convertTo24Hour(rangeEnd);

    // Check if the time range spans midnight
    if (rangeStart24 < rangeEnd24) {
      // Regular range
      return currentTime >= rangeStart24 && currentTime <= rangeEnd24;
    } else {
      // Spanning midnight
      return currentTime >= rangeStart24 || currentTime <= rangeEnd24;
    }
  });
}
