import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

import { Button, Input, Table, TableCell, TableColumn, TableRow, TextArea } from '@ui5/webcomponents-react';
import "./TimeSheetDetails.css";

const TimeSheetDetails = () => {
  const [timeSheetDetails, setTimeSheetDetails] = useState([]);
  const [existingTimeSheetDetails, setExistingTimeSheetDetails] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [heading, setHeading] = useState("");
  const [disable, setDisable] = useState(true);
  const [userDetail, setUserDetail] = useState({});
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const token = localStorage.getItem('token');  

  /**
   * Calculate the monthly header using week dates
   * @param {Array<String>} headers 
   */
  const getHeading = (headers) => {
    
    const weekStart = new Date(headers[0]);
    const weekEnd = new Date(headers[6]);

    const weekStartMonth = month[weekStart.getUTCMonth()];
    const weekEndMonth = month[weekEnd.getUTCMonth()];

    const weekStartYear = weekStart.getUTCFullYear();
    const weekEndYear = weekEnd.getUTCFullYear();

    const header =
      weekStartMonth === weekEndMonth
        ? `${weekStartMonth} ${weekStart.getUTCFullYear()}`
        : weekStartYear === weekEndYear
          ? `${weekStartMonth} - ${weekEndMonth} ${weekStart.getUTCFullYear()}`
          : `${weekStartMonth} ${weekStart.getUTCFullYear()} - ${weekEndMonth} ${weekEnd.getUTCFullYear()}`;
    setHeading(header);
  };

  useEffect(() => {
    // To get the current week time-sheet details
    axios
      .get(`${process.env.REACT_APP_SERVER_PREFIX}service/timesheet/SSITimeSheetData`, {
        'headers':{
          'Content-Type': 'application/json',
          token : token
        }
      })
      .then((response) =>{
        const timeSheetData = JSON.parse(JSON.stringify(response.data.value));
        setExistingTimeSheetDetails(response.data.value); // This sets the original data
        setTimeSheetDetails(timeSheetData); // This sets a deep copy
      }
      )
      .catch((error) => console.log(error));

      // Get currently logged in user details
      axios
      .get(`${process.env.REACT_APP_SERVER_PREFIX}service/timesheet/SSIUserDetails`, {
        'headers':{
          'Content-Type': 'application/json',
          token : token
        }
      })
      .then((userDetails) =>
        setUserDetail(userDetails.data.value[0])
        
      )
      .catch((error) => console.log(error));

    // To get the current week dates
    axios
      .get(`${process.env.REACT_APP_SERVER_PREFIX}`)
      .then((res) => {
        getHeading(res.data.weekDates);
        setTableHeaders(res.data.weekDates);
      })
      .catch((error) => console.log(error));
  }, []);

  // Handler to get the previous week date and its data
  const handlePrevious = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_PREFIX}service/timesheet/previous`, {
        curMon: tableHeaders[0],
      }, {
        'headers':{
          'Content-Type': 'application/json',
          token : token
        }
      })
      .then((response) => {
        getHeading(response.data.value.weekDates);
        setTableHeaders(response.data.value.weekDates);
        setExistingTimeSheetDetails(response.data.value.previousWeekData);
        setTimeSheetDetails(JSON.parse(JSON.stringify(response.data.value.previousWeekData)));
      })
      .catch((error) => console.log(error));
  };

  // Handler to get the next week date and its data
  const handleNext = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_PREFIX}service/timesheet/next`, {
        curSun: tableHeaders[6],
      }, {
        'headers':{
          'Content-Type': 'application/json',
          token : token
        }
      })
      .then((response) => {
        getHeading(response.data.value.weekDates);
        setTableHeaders(response.data.value.weekDates);
        setExistingTimeSheetDetails(response.data.value.nextWeekData);
        setTimeSheetDetails(JSON.parse(JSON.stringify(response.data.value.nextWeekData)));
      })
      .catch((error) => console.log(error));
  };

  // Handler to update the user input 
  const handleOnChange = (value, index, key) => { 
    const preTimeSheetDetails = [...timeSheetDetails];

    const existingValue = timeSheetDetails[index][key]
    
    preTimeSheetDetails[index][key] = value;
    setTimeSheetDetails(preTimeSheetDetails);
    
    if((!existingValue || existingValue !== 0) && value >= 0){
      setDisable(false);
    }   
  };

  // Handler to store the time-sheet details
  const handleSave = () => {
    // Filter the null records
    const filteredTimeSheetData = timeSheetDetails.filter((timeSheetDetail, index)=>{
      const isTimeSheetDetail = (timeSheetDetail['Issue'] || timeSheetDetail['Enhancement'] || timeSheetDetail['NewInnovation'] || timeSheetDetail['Comments']);
      /**
       * Checks if the existing has value.
       * If it has value and currently its change to 0, its need to be updated
       */
      const isExistingTimeSheetDetail = (existingTimeSheetDetails[index]['Issue'] || existingTimeSheetDetails[index]['Enhancement'] || existingTimeSheetDetails[index]['NewInnovation'] || existingTimeSheetDetails[index]['Comments']);
      

      if(isTimeSheetDetail || isExistingTimeSheetDetail) return timeSheetDetail;
    })
    
    if(filteredTimeSheetData.length > 0){
    axios
      .post(`${process.env.REACT_APP_SERVER_PREFIX}service/timesheet/save`, {
        timeSheetDetails: JSON.stringify(filteredTimeSheetData),
      }, {
        'headers':{
          'Content-Type': 'application/json',
          token : token
        }
      })
      .then((response) => {
        if(response.data.value.status === 200) {
          toast.success(response.data.value.message);
          setExistingTimeSheetDetails(JSON.parse(JSON.stringify(timeSheetDetails)));
          setDisable(true);
        }
      })
      .catch((error) => console.log(error));
    }
  };

  /**
   * Total Hours calculation per day
   * @param {Object} detail 
   * @param {String} detail.EntryDate
   * @param {Number} detail.Issue
   * @param {Number} detail.Enhancement
   * @param {Number} detail.NewInnovation
   * @returns {Number} total hours for per day
   */
  const totalHoursCalculation = (detail)=>{
    let total = 0;
    ['Issue', 'NewInnovation', 'Enhancement'].map((key)=>{
      if(detail[key]) {        
        total += +detail[key];
      }
  })
    return total === 0 ? '' : total;
  }

  return (
    <div className="main-container">
      <div className="sub-container">
       
        <div className="headers">
          <div className="user-details">
            <h2 className="user-name">{userDetail['PersonName']}</h2>
            <p className="project-name">Exelixis - S/4 AMS</p>
          </div>
          <h2>{heading}</h2>
          
          <div className="actions">
            <Button design="Emphasized" onClick={handlePrevious}>
              Prev Week
            </Button>
            <Button design="Emphasized" onClick={handleNext}>
              Next Week
            </Button>
          </div>
        </div>

        <div className="content-container">
        {tableHeaders.length > 0 && timeSheetDetails.length > 0 && (
          <Table className="table" columns={
            <>
                <TableColumn className="table-header">Category</TableColumn>
                {tableHeaders?.map((dateString) => {
                  const date = new Date(dateString).getUTCDate();
                  return (
                    <TableColumn className="table-header">
                      {`${days[new Date(dateString).getUTCDay()]}-${
                        date < 10 ? `0${date}` : `${date}`
                      }`}
                    </TableColumn>
                  );
                })}
              </>
            }>
              {["Issue", "Enhancement", "NewInnovation", "Comments", "Total"].map(
                (key) => (
                  <TableRow key={key}>
                    <TableCell>{key === "NewInnovation" ? "Innovation / Other" : key}</TableCell>
                    {timeSheetDetails?.map((detail, index) => {
                      
                      return key !== 'Total' ? key !== 'Comments' ? <TableCell>
                        <Input
                          className="input-box"
                          value={!detail[key] ? '' : detail[key]}
                          type={"Number"}
                          onInput={(e) =>
                            handleOnChange(Number(e.target.value), index, key)
                          }
                        ></Input>
                      </TableCell>:
                      <TableCell>
                        <TextArea 
                        value = {!detail[key] ? '' : detail[key]}
                        onInput={(e) =>handleOnChange(e.target.value , index, key)}
                        />
                      </TableCell>
                       :
                      <TableCell className="table-cell">{totalHoursCalculation(detail)}</TableCell>
                    })}
                  </TableRow>
                )
              )}
            
          </Table>
        )}
        </div>

        <div className="store-action">
          <Button design="Emphasized" onClick={handleSave} disabled={disable}>
            Save
          </Button>
        </div>
        <Toaster position="bottom-center"/>
      </div>
    </div>
  )
};

export default TimeSheetDetails;