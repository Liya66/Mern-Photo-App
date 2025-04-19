import './authPage.css'
import Image from '../../components/image/image'
import { useState } from 'react';
const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className='authPage'>
            <div className="authContainer">
                <Image path='/general/logo.png' alt='' />
                <h1>{isRegister ? "Create an Account" : "Login to your account"}</h1>
                {isRegister ? (<form key='registerForm'>
                    <div className="formGroup">
                        <label htmlFor="username">Username</label>
                        <input type="text" placeholder='username' required name='username' id='username' />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="name"> Name</label>
                        <input type="text" placeholder='name' required name='name' id='name' />
                    </div>
                    <button type='submit'>Register</button>
                    <p onClick={() => setIsRegister(false)}>Do you have an account? <b>Login</b></p>
                    {error && <p className='error'>{error}</p>}


                </form>) : (<form key='loginForm'>
                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input type="text" placeholder='Email' required name='email' id='email' />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password</label>
                        <input type="text" placeholder='password' required name='password' id='password' />
                    </div>
                    <button type='submit'>Login</button>
                    <p onClick={() => setIsRegister(true)}>Don't have an account? <b>Register</b></p>
                    {error && <p className='error'>{error}</p>}
                </form>)}
            </div>
        </div>
    )
}

export default AuthPage