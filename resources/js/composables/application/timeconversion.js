import moment from "moment";

const convertTimeZone = (time, offset) => {
    const date = new Date((time + offset) * 1e3);
    const utc = date.getTime() + date.getTimezoneOffset() * 6e4;
    const nd = new Date(utc);
    return nd;
};

const convertToUTCDateTime = (date) => {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate;
};
const utcToSimpleDate = (time, offset) => {
    const date = convertTimeZone(time, offset);
    return date.toLocaleString("default", { weekday: "short", month: "short", day: "numeric" });
};

const utcToSimpleDay = (time, offset) => {
    const date = convertTimeZone(time, offset);
    return date.toLocaleString("default", { weekday: "short"});
};

const utcToSimpleTime = (time, offset) => {
    const date = convertTimeZone(time, offset);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const hour = hours == 12 && ampm == "pm" ? hours : hours % 12;
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHour}:${formattedMinutes} ${ampm}`;
};
const calculateYearsBetweenDates = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, 'years');
};

const calculateDaysBetweenDates = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    return end.diff(start, 'days');
};

const normalizeDate = (dateString)=> {
    let formats = ["YYYY-MM-DD", "YYYY MMMM DD", "YYYY-MM-DD",'MM-DD','MMMM DD'];
    return moment(dateString, formats);
}

const adjustDate = (dateString, days, format = "YYYY-MM-DD") => {
    const date = moment(dateString, format);
    date.add(days, 'days');
    return date.format("YYYY-MM-DD");
};

const daysToReadableFormat = (days) => {
    const years = Math.floor(days / 365); // Calculate full years
    const months = Math.floor((days % 365) / 30); // Calculate remaining months
    const remainingDays = days % 30; // Remaining days after removing full months

    let result = '';

    if (years > 0) {
        result += `${years} year${years > 1 ? 's' : ''} `;
    }
    if (months > 0) {
        result += `${months} month${months > 1 ? 's' : ''} `;
    }
    if (remainingDays > 0 || days < 30) { // Include days if there are any or if total days is less than a month
        result += `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }

    return result.trim();
};
const isDateOlderThan = (date1, date2 = moment().format("YYYY-MM-DD"), format = "YYYY-MM-DD") => {
    const firstDate = moment(date1, format);
    const secondDate = moment(date2, format);
    return firstDate.isBefore(secondDate);
};

const getDateRangeArray = (startDate, endDate, format = "YYYY-MM-DD") => {
    const start = moment(startDate, format);
    const end = moment(endDate, format);
    const dateArray = [];

    let currentDate = start;
    while (currentDate <= end) {
        dateArray.push(currentDate.format(format));
        currentDate = currentDate.add(1, 'days');
    }
    let lastDayExists = _.find(dateArray,o=>o === end.format(format))
    if (!lastDayExists)
        dateArray.push(end.format(format))

    return dateArray;
};

const isWeekend = (date) => {
    const day = moment(date).day();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

const getDateRangeArrayExcludingWeekendsAndHolidays = (startDate, endDate, holidays, format = "YYYY-MM-DD") => {
    const start = moment(startDate, format);
    const end = moment(endDate, format);
    const dateArray = [];

    let currentDate = start;
    while (currentDate <= end) {
        if (!isWeekend(currentDate) && !holidays.includes(currentDate.format(format))) {
            dateArray.push(currentDate.format(format));
        }
        currentDate = currentDate.add(1, 'days');
    }

    let lastDayExists = _.find(dateArray,o=>o === end.format(format))
    if (!lastDayExists) {
        if (!isWeekend(end) && !holidays.includes(end.format(format))) {
            dateArray.push(end.format(format));
        }
    }

    return dateArray;
};

const sortDatasetByDate = (dataset, dateAttribute) => {
    return dataset.sort((a, b) => {
        const dateA = moment(a[dateAttribute]);
        const dateB = moment(b[dateAttribute]);
        if (dateA.isBefore(dateB)) return -1;
        if (dateA.isAfter(dateB)) return 1;
        return 0;
    });
};
export  {utcToSimpleDate,utcToSimpleTime,calculateYearsBetweenDates,calculateDaysBetweenDates,normalizeDate,
    adjustDate,daysToReadableFormat,isDateOlderThan,convertToUTCDateTime,getDateRangeArray,
    getDateRangeArrayExcludingWeekendsAndHolidays,sortDatasetByDate}

