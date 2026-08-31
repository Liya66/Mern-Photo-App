import './authPage.css'
import Image from '../../components/image/image'
import { useState } from 'react';
import apiRequest from '../../utils/apiRequest';
import useAuthStore from '../../utils/authStore';
import { useNavigate } from 'react-router';

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const endpoint = isRegister
                ? '/users/auth/register'
                : '/users/auth/login';
            const res = await apiRequest.post(endpoint, data);
            setCurrentUser(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='authPage'>
            <div className="authContainer">
                <Image path='/general/logo.png' alt='' />
                <h1>{isRegister ? "Create an Account" : "Login to your account"}</h1>
                {isRegister ? (
                    <form key='registerForm' onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label htmlFor="username">Username</label>
                            <input type="text" placeholder='username' required name='username' id='username' />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="displayName">Name</label>
                            <input type="text" placeholder='name' required name='displayName' id='displayName' />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="email">Email</label>
                            <input type="email" placeholder='email' required name='email' id='email' />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password">Password</label>
                            <input type="password" placeholder='password' required name='password' id='password' />
                        </div>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                        <p onClick={() => { setIsRegister(false); setError(''); }}>
                            Do you have an account? <b>Login</b>
                        </p>
                        {error && <p className='error'>{error}</p>}
                    </form>
                ) : (
                    <form key='loginForm' onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label htmlFor="email">Email</label>
                            <input type="email" placeholder='Email' required name='email' id='email' />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="password">Password</label>
                            <input type="password" placeholder='password' required name='password' id='password' />
                        </div>
                        <button type='submit' disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        <p onClick={() => { setIsRegister(true); setError(''); }}>
                            Don't have an account? <b>Register</b>
                        </p>
                        {error && <p className='error'>{error}</p>}
                    </form>
                )}
            </div>
        </div>
    )
}

export default AuthPage
