

import React, { useEffect, useState } from "react"
// import {Modal}from "./model/index";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Modal } from "./model/index";
import Select from 'react-select';
import moment from 'moment';
import { EnvelopeIcon, PhoneIcon, PencilIcon } from '@heroicons/react/20/solid'
import { setDefaultResultOrder } from "dns";
import Alert from "./alert";



const user = {
  name: 'Rebecca Nicholas',
  role: 'Product Designer',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const stats = [
  { label: 'Vacation days left', value: 12 },
  { label: 'Sick days left', value: 4 },
  { label: 'Personal days left', value: 2 },
]

export default function Index() {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [openCard, setOpenCard] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [startTimeSelected, setStartTimeSelected] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [endTimeOptions, setEndTimeOptions] = useState<{ value: string; label: string }[]>([]);
  const [time, setTime] = useState('');
  const [startTimeOptions, setStartTimeOptions] = useState<{ value: string; label: string }[]>([]);
  const [endTimeSelected, setEndTimeSelected] = useState<{ value: string; label: string } | null>(
    null,
  );
  const [alertMessage, setAlertMessage] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);


  const schemaCourse = yup.object().shape({
    jobName: yup.string().required('This Field is Required'),
  });
  const currentTime = new Date().getTime();
  type Person = {
    jobName: any;
    jobStartTime: { value: string; label: string } | null;
    jobEndTime: { value: string; label: string } | null;
  };

  const [people1, setPeople1] = useState<Person[]>([]);
  // const [people1, setPeople1] = useState<{ jobName: any; jobStartTime: { value: string; label: string; } | null; jobEndTime: { value: string; label: string; } | null; }[]> = [];
  // Course Formik
  const formikJobCreate = useFormik({
    initialValues: {
      jobName: '',
      jobStartTime: '',
      jobEndTime: '',
    },
    validationSchema: schemaCourse,
    onSubmit: async (values, { resetForm }) => {
      const valuesToPass = {
        jobName: values.jobName,
        jobStartTime: startTimeSelected,
        jobEndTime: endTimeSelected,
      };
      if(!isEdit){
      people1.push(valuesToPass);
    }
      setOpenCard(false);
    },
  });

  const {
    handleSubmit, values, handleChange, handleBlur, errors, touched,resetForm,
  } = formikJobCreate;


  const intervals = (startString: string, endString: string) => {
    var start = moment(startString, 'YYYY-MM-DD hh:mm a');
    var end = moment(endString, 'YYYY-MM-DD hh:mm a');

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    var result = [];

    var current = moment(start);

    while (current <= end) {
      result.push(current.format('YYYY-MM-DD HH:mm'));
      current.add(15, 'minutes');
    }

    return result;
  };

   const updateMeetingLinkOptions = (
    dateStart: string,
    startTime: { value: string; label: string } | null,
  ) => {
    const timeIntervals = intervals(`${dateStart} 12:00:00 AM`, `${dateStart} 11:59:00 PM`);
    const timeOption = timeIntervals.map((item) => ({
      value: item,
      label: moment(item).format('hh:mm A'),
    }));

    setStartTimeOptions(timeOption);

    if (startTime) {
      const endTimeOption: { value: string; label: string }[] = [];
      let selected = false;
      timeOption.forEach((item) => {
        if (selected) {
          endTimeOption.push(item);
        }
        if (item.value === startTime.value) {
          selected = true;
        }
      });

      setEndTimeSelected(null);
      setEndTimeOptions(endTimeOption);
    } else {
      setEndTimeOptions(timeOption);
    }
  };

  const handleDelete = (index:number) => {
    const updatedPeople = [...people1];
    updatedPeople.splice(index, 1);
    setPeople1(updatedPeople);
    setAlertMessage(true);
    setTimeout(()=>{
     setAlertMessage(false);
    },2000)
  };

  useEffect(() => {
    updateMeetingLinkOptions(startDate, startTimeSelected);
  }, [startTimeSelected, startDate]);
  
 
/*   function timeStringToNumber(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes; // Convert to total minutes from midnight
  }
  const timer = () => {
    const date = new Date();
    const showTime = date.getHours() + ':' + date.getMinutes();
    
    people1.forEach((element: Person) => {
      if (element.jobEndTime) { 
        const endValue = element.jobEndTime.value.slice(11);
        if (timeStringToNumber(endValue) - timeStringToNumber(showTime) <= 3) {
          setOpenAlert(true);
        }
        // console.log(endValue,showTime)
      }
      console.log('called1')
    });
  } */


  return (
    <>
      <Modal setOpen={setOpenCard} open={openCard}>
        <div className="flex align-middle relative px-10">
          <h2 className="text-xl font-semibold text-gray-900 pr-10">
            Add to do Job
          </h2>
        </div>
        <form className="mt-8 px-10" onSubmit={handleSubmit} >
          <div className="flex mt-6">
            <div className="flex-1 mr-2">
              <div className="mt-1">
                <input
                  autoComplete="off"
                  id="jobName"
                  name="jobName"
                  placeholder="Add job"
                  className="shadow-sm focus:ring-primary focus:border-sky-500 px-3 py-5 text-black  block w-full sm:text-sm border border-gray-300 rounded-md"
                  value={values.jobName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.jobName && touched.jobName && (
                  <span className="text-red-500 text-sm pt-1">{errors.jobName}</span>
                )}
            </div>
            <div className="flex-1 ml-2">
              <div className="mt-0">
                <div className="ml-2 mt-2">
                  <Select
                    value={startTimeSelected}
                    options={startTimeOptions}
                    placeholder="Start Time"
                    className="text-sm"
                    onChange={(value: any) => {
                      setStartTimeSelected(value);
                      values.jobStartTime = value;
                    }}
                  />
                  {errors.jobStartTime && touched.jobStartTime && (
                  <span className="text-red-500 text-sm pt-1">{errors.jobStartTime}</span>
                )}
                </div>

                <div className="ml-2 mt-2">
                  <Select
                    value={endTimeSelected}
                    options={endTimeOptions}
                    placeholder="End Time"
                    className="text-sm"
                    onChange={(value: any) => {
                      setEndTimeSelected(value);
                    }}
                  />
                  {errors.jobEndTime && touched.jobEndTime && (
                  <span className="text-red-500 text-sm pt-1">{errors.jobEndTime}</span>
                )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-right">
            {isEdit && (
             <button
             disabled={!endTimeSelected || !startTimeSelected}
             type="submit"
             // onClick={()=> }
             className="disabled:opacity-70 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
           >
             {' '}
             Save
           </button>
            )}
            {!isEdit && (
            <button
              disabled={!endTimeSelected || !startTimeSelected}
              type="submit"
              className="disabled:opacity-70 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {' '}
              Add
            </button>
            )}
            <button
              type="submit"
              onClick={() => {setOpenCard(false), setIsEdit(false), resetForm()}}
              className="disabled:opacity-70 inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-400 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      {/* <Modal setOpen={setOpenAlert} open={openAlert}>
      <div className="flex align-middle relative px-10">
          <h2 className="text-xl font-semibold text-gray-900 pr-10">
            The time for task is about to finish! Mark it as complete!
          </h2>
          </div>
            <button
              type="submit"
              onClick={() => {setOpenAlert(false),clearInterval(intervalID), setTimeout(() => {
                timer();
              }, 5 * 60 * 1000), handleClose()}}
              className="disabled:opacity-70 inline-flex mt-5 justify-center py-2 px-4 ml-10 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-400 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
             Close
        </button>
      </Modal> */}
      <div className="overflow-hidden rounded-lg bg-white shadow mt-5">
        <h2 className="sr-only" id="profile-overview-title">
          Profile Overview
        </h2>
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img className="mx-auto h-20 w-20 rounded-full" src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60`}
                alt="" />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{'Vamsi krishna'}</p>
                <p className="text-sm font-medium text-gray-600">{'Software Developer'}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="https://www.linkedin.com/in/vamsi-krishna-41928aa9/"
                className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View profile
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          
          <div className="px-6 py-5 text-center text-sm font-medium" onClick={() => setOpenCard(true)}>
            <span className="text-gray-900">Add Task To Do</span> <span className="text-gray-600">Card</span>
          </div>
        </div>
      </div>
      {alertMessage && (
      <Alert/>
      )}
      <div className="mt-5 ml-5 mb-5 mr-5">
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {people1.map((person: any, index: number) => (
            <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">{person.jobName}</h3>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      {'Created'}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="mr-4"> {/* Container for Start Time */}
                      <p className="mt-1 truncate text-sm text-gray-500">{'Start Time'}</p>
                      <p className="mt-1 truncate text-sm text-gray-500">{person.jobStartTime.label}</p>
                    </div>
                    <div className="justufy-content-end"> {/* Container for End Time */}
                      <p className="mt-1 truncate text-sm text-gray-500">{'End Time'}</p>
                      <p className="mt-1 truncate text-sm text-gray-500">{person.jobEndTime.label}</p>
                    </div>
                  </div>
                </div>

                <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={person.imageUrl} alt="" />
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                    onClick={()=>{handleDelete(index)}}
                      // href={`mailto:${person.email}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      {/* <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                      Mark Completed
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </>
  )
}

