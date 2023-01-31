export const SIGNIN_FAILED_CASE_BODIES = [
    {},
    { password: 'password' },
    { email: 'test@gmail.com' },
    { email: 'test@', password: 'password' },
    { email: 'test@gmail.com', password: '' },
    { email: 13412, password: '' },
    { email: 'test@gmail.com', password: 121242 },
];

export const SIGNUP_FAILED_CASE_BODIES = [
    {},
    { email: '' },
    { email: 'TEST@GMAIL.COM' },
    { email: 'test@gmail.com', password: 'password' },
    { email: 'test@', name: 'test', password: 'password', passwordConfirmation: 'password' },
    { email: 'test@gmail.com', name: 'test', password: 'pass', passwordConfirmation: 'pass' },
    { email: 'test@gmail.com', name: 'test', password: 'pass', passwordConfirmation: 'password' },
    { email: 'test@gmail.com', name: 'test', password: 'password', passwordConfirmation: 'passwor' },
    { email: 123456, name: 'test', password: 'password', passwordConfirmation: 'passwor' },
    { email: 'test@gmail.com', name: 12456, password: 12345, passwordConfirmation: 123124 },
    { email: 'test@gmail.com', name: '<script>alert("XSS")</script>', password: 'password', passwordConfirmation: 'password' },
    { email: 'test@gmail.com', name: '(name)', password: 'password', passwordConfirmation: 'password' },
];
