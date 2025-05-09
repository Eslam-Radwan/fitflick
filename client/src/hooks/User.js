export const getUserToken = () => {
    const token = sessionStorage.getItem('token');
    console.log('token', token);    
    
    return token;
}

export const getUserName = () => {

    const user = JSON.parse(sessionStorage.getItem('user'));
    return user.name;
}

export const getUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('user', user);
    return user;
}