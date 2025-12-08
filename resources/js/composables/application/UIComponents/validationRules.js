// useValidation.js
export function useValidation() {
    const validators = {
        required: value => !!value || 'This field is required',
        name: value => /^[a-zA-Z]+(?:[\s.]+[a-zA-Z]+)*$/.test(value) || 'Invalid name. Only letters allowed',
        nic: value => value?(value.length <= 10 ? /^([0-9]{9})(X|V)$/.test(value) : /^[0-9]{12}$/.test(value)) || 'Invalid NIC format':null,
        email: value => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email format',
        phoneNumber: value => value? /^[0-9]{10}$/.test(value) || 'Contact Number must be valid':null,
        maxLength: max => value => value.length <= max || `Maximum length is ${max} characters`,
    };

    const getValidationRules = validationTypes => validationTypes.map(type => {
        if (type.includes(':')) {
            const [validatorName, param] = type.split(':');
            return validators[validatorName](parseInt(param, 10));
        }
        return validators[type];
    });

    return { getValidationRules };
}

export default useValidation;
