import date from 'date-and-time';

const getListData = (type, arr) => {
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
      { field: 'col1', headerName: 'Last Name', flex: 1},
      { field: 'col2', headerName: 'First Name', flex: 1},
      { field: 'col3', headerName: 'Birthday', flex: 1},
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
      { field: 'col1', headerName: 'Last Name', flex: 1},
      { field: 'col2', headerName: 'First Name', flex: 1},
      { field: 'col3', headerName: 'Gender', flex: 1},
    ];
  }
  else if (type === 'appointments') {
    rows = arr.map(appt => {
      let formatted = date.parse(String(appt.time), 'HH:mm:ss');
      formatted = date.format(formatted, 'h:mm A');
      return {
        id: appt.id,
        col1: appt.patient_name,
        col2: appt.doctor_name,
        col3: appt.date, 
        col4: formatted
      }
    })

    columns= [
      { field: 'col1', headerName: 'Patient', flex: 1},
      { field: 'col2', headerName: 'Doctor', flex: 1},
      { field: 'col3', headerName: 'Date', flex: 1},
      { field: 'col4', headerName: 'Time'}
    ];
  }

  return { rows: rows, columns: columns }

}

export default getListData;