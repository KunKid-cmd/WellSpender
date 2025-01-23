export const validateEmail = (email) => {
    // check is that email contant @ and .
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};