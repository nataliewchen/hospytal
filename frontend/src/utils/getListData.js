import date from 'date-and-time';

const showColumns = (arr, n) => {
  return arr.slice(0, n);
}

const getListData = (type, arr, width) => {
  let rows = [];
  let columns = [];
  if (type === 'patients') {
    rows = arr.map(patient => ({
      id: patient.id,
      col1: patient.lastname,
      col2: patient.firstname,
      col3: patient.birthday,
      col4: patient.gender
    }))

    columns= [
      { field: 'col1', headerName: 'Last Name', flex: 2},
      { field: 'col2', headerName: 'First Name', flex: 2},
      { field: 'col3', headerName: 'Birthday', flex: 2},
      { field: 'col4', headerName: 'Gender', flex: 1},
    ];
    
  } 
  else if (type === 'doctors') {
    rows = arr.map(doctor => ({
      id: doctor.id,
      col1: doctor.lastname,
      col2: doctor.firstname,
      col3: doctor.gender
    }))

    columns= [
      { field: 'col1', headerName: 'Last Name', flex: 2},
      { field: 'col2', headerName: 'First Name', flex: 2},
      { field: 'col3', headerName: 'Gender', flex: 1},
    ];
  }
  else if (type === 'appointments') {
    rows = arr.map(appt => ({
        id: appt.id,
        col1: appt.patient_name,
        col2: appt.doctor_name,
        col3: String(appt.date) + ' ' + String(appt.formatted_time), 
        col4: appt.status
    }))

    columns= [
      { field: 'col1', headerName: 'Patient', flex: 1},
      { field: 'col2', headerName: 'Doctor', flex: 1},
      { field: 'col3', headerName: 'Date & Time', flex: 1},
      { field: 'col4', headerName: 'Status', flex: 1},
    ];

    if (width >= 700 && width < 800) {
      columns = showColumns(columns, 3);
    }
  }

  if (width < 700) {
    columns = showColumns(columns, 2);
  }

  return { rows: rows, columns: columns }

}

export default getListData;