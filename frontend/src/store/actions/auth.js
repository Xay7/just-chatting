import axios from 'axios';

export const signUp = data => {
    return async dispatch => {
        try {
            const res = await axios.post('http://localhost:3001/users/signup', data);
            console.log(res);

        } catch (err) {
            console.log(err);
        }
    }
}