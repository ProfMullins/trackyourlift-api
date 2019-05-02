const moment = require('moment');

exports.getAgeFromBirthdate = (year, month, day) => {
    let birthDate = year.toString().padStart(2, '0') +
        month.toString().padStart(2, '0') +
        day.toString().padStart(2, '0') +
        " 12:00";

    let bday = moment(birthDate, "YYYYMMDD HH:mm");
    let today = moment().startOf('day').hour(12);
    let age = today.year() - bday.year();

    if (bday > today.subtract(age, 'years')) {
        age = age - 1;
    }

    return age;
};