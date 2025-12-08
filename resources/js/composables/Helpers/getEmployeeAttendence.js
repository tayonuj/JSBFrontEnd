import axios from 'axios';
import { ref } from 'vue';
import moment from 'moment';
import generalAxiosRequest from "../application/generalAxiosRequest";

const apiBaseUrl = 'https://slpahris.g-sentry.com/api/v1/attendance/get';



const getEmployeeAttendance = async (empNumber, startDate, endDate) => {
    const payload = {
        url: apiBaseUrl,
        data: JSON.stringify({
            emp_number: empNumber,
            start_date: startDate,
            end_date: endDate
        })
    };
    const { json_data } = await generalAxiosRequest('curl-requests/post', payload, false);
    return json_data.value;
};

// const leaveEmployeeCount= async (empNumber)=>{
//     const currentDate = moment().format('YYYY-MM-DD');
//     const payload = {
//         url: 'https://slpahris.g-sentry.com/api/v1/leave/getSubbordinateLeave',
//         data: JSON.stringify({
//             emp_number: "457697",
//             date: "2024-05-02",
//         })
//     };
//     const { json_data } = await generalAxiosRequest('curl-requests/post', payload, false);
//     return json_data.value;
//
// }

const checkOnDutyEmployees = async (employeeList) => {
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const currentDate = moment().format('YYYY-MM-DD');
   // const currentDate = "2024-07-17"
    let onDutyCount = 0;
    let notCameCount = 0;

    for (const employee of employeeList) {
        console.log('employee ffff',employee)
        const attendanceData = await getEmployeeAttendance(employee, currentDate, currentDate);
        console.log('attendanceData ffff',attendanceData[0].date)
        if (attendanceData && Array.isArray(attendanceData)) {
            const isOnDuty = attendanceData.some(record => record.date === currentDate);
            console.log('isOnDuty ',isOnDuty)

            if (isOnDuty) {
                onDutyCount++;
            } else {
                notCameCount++;
            }
        } else {
            notCameCount++;
        }
    }


    return {
        onDutyCount,
        notCameCount,
        totalEmployees: employeeList.length
    };
};

export { checkOnDutyEmployees };
