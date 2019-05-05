const validator = require('validator');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

checkPassword = (password) => {
    let errors = [];

    errors = passwordSchema.validate(password, {list: true});

    return errors;
};

checkEmail = (email) => {
    let errors = [];

    if (validator.isEmpty(email)) {
        errors.push('null');
    }

    if (!validator.isLength(email, {min: 6, max: 100})) {
        errors.push('length');
    }

    if (!validator.isEmail(email)) {
        errors.push('validation');
    }

    return errors;
};

checkFirstName = (firstName) => {
    let errors = [];

    if (validator.isEmpty(firstName)) {
        errors.push('null');
    }

    if (!validator.isLength(firstName, {min: 1, max: 50})) {
        errors.push('length');
    }
};

checkBirthDate = (year, month, day) => {
    let errors = [];

    if (!validator.isInt(year.toString(), {allow_leading_zeroes: false, min: 1900, max: 2019})) {
        errors.push('validation');
    }

    if (!validator.isInt(month.toString(), {allow_leading_zeroes: true, min: 1, max: 12})) {
        errors.push('validation');
    }

    if (!validator.isInt(day.toString(), {allow_leading_zeroes: true, min: 1, max: 31})) {
        errors.push('validation');
    }

    if (errors.length < 1) {
        if (day > new Date(year, month, 0).getDate()) {
            errors.push('validation');
        }
    }

    return errors;
};

exports.validateRegBody = async (body) => {
    let errors = {};

    errors['email'] = await checkEmail(body.email);

    errors['firstName'] = await checkFirstName(body.firstName);

    errors['password'] = await checkPassword(body.password);

    errors['birthDate'] = await checkBirthDate(body.birthYear, body.birthMonth, body.birthDay);

    if (errors['email'].length > 0 || errors['password'].length > 0 || errors['birthDate'].length > 0 || errors['firstName']) {
        return errors;
    }

    return {};
};

exports.validateLoginBody = async (body) => {
    let errors = {};

    errors['email'] = await checkEmail(body.email);

    errors['password'] = await checkPassword(body.password);

    if (errors['email'].length > 0 || errors['password'].length > 0) {
        return errors;
    }

    return {};
};
