import React, {useState, useEffect} from 'react';
import axios from 'axios';

const TimeSheetDetails = ()=>{

  const [timeSheetDetails, setTimeSheetDetails] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:4004/service/timesheet/SSITimeSheetData')
    .then((timeSheetDetails)=> setTimeSheetDetails(timeSheetDetails.data.value))
    .catch((error)=> console.log(error)
    );

    // axios.get('https://4096ee42trial-dev-timesheet-srv.cfapps.us10-001.hana.ondemand.com/service/timesheet/SSITimeSheetData')
    // .then((timeSheetDetails)=> setTimeSheetDetails(timeSheetDetails.data.value))
    // .catch((error)=> console.log(error)
    // );
  }, [])

  return (
    <div>
      <h1>WELCOME</h1>
      <table>
          <thead>
            <th>Entry Date</th>
            <th>Issue</th>
            <th>Enhancement</th>
            <th>New Innovation</th>
            <th>Comment</th>
          </thead>
          <tbody>
      {timeSheetDetails.map((timeSheetDetail)=>(
        <tr key={timeSheetDetail.ID}>
            <td>{timeSheetDetail.EntryDate}</td>
            <td>{timeSheetDetail.Issue}</td>
            <td>{timeSheetDetail.Enhancement}</td>
            <td>{timeSheetDetail.NewInnovation}</td>
            <td>{timeSheetDetail.Comments}</td>
            </tr> 
      ))}
       </tbody>
       </table>
    </div>
  )
}

export default TimeSheetDetails;