import React, {useCallback, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from "../../services/AuthProvider";

import useApi from "../../services/useApi";
import useStorage from "../../services/useStorage";
import Loader from "../../components/loader/Loader";
import './Auth.css';
import Constant from '../../Constant';

function Login({handleSignIn, email, password, onEmailTextChange, onPasswordTextChange}) {
    return (
        <>
            <input className='auth-input-field' type="email" placeholder="Email" value={email} required
                   onChange={(e) => onEmailTextChange(e.target.value)}/>
            <input className='auth-input-field' type="password" placeholder="Password" value={password} required
                   onChange={(e) => onPasswordTextChange(e.target.value)}/>
            <button className='btn' type="submit" onClick={handleSignIn}>Login</button>
        </>
    );
}

function Signup({handleSignup, email, password, name, onEmailTextChange, onPasswordTextChange, onNameTextChange}) {
    return (
        <>
            <input className='auth-input-field' type="name" placeholder="Name" value={name} required
                   onChange={(e) => onNameTextChange(e.target.value)}/>
            <input className='auth-input-field' type="email" placeholder="Email" value={email} required
                   onChange={(e) => onEmailTextChange(e.target.value)}/>
            <input className='auth-input-field' type="password" placeholder="Password" value={password} required
                   onChange={(e) => onPasswordTextChange(e.target.value)}/>
            <button className='btn' type="submit" onClick={handleSignup}>Signup</button>
        </>
    );
}

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [flow, setFlow] = useState(Constant.login);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {setUserInfo} = useContext(AuthContext);
    const authService = useApi();
    const storageService = useStorage();

    const handleSignIn = useCallback(async () => {
        if (!email || !password) {
            return setError('Please enter valid info')
        }
        setIsLoading(true);
        try {
            const payload = {
                email: email,
                password: password
            }
            const response = await authService.signin(payload);
            setIsLoading(false);
            if (response.data && response.data.data) {
                setUserInfo(response.data.data);
                storageService.setItem(response.data.data);
                navigate('/services');
            } else {
                setError('Email or password is incorrect');
            }
        } catch {
            setIsLoading(false);
            setError('Something went wrong. Try again later');
        }
    }, [email, password]);

    const handleSignup = useCallback(async () => {
        if (!email || !password || !name) {
            return setError('Please enter valid info')
        }
        setIsLoading(true);
        try {
            const payload = {
                email: email,
                password: password,
                name: name,
            }
            const response = await authService.signup(payload);
            setIsLoading(false);
            if (response.data && response.data.data) {
                setUserInfo(response.data.data);
                storageService.setItem(response.data.data);
                navigate('/services');
            } else {
                setError('Please ensure email is unique');
            }
        } catch {
            setIsLoading(false);
            setError('Something went wrong. Try again later');
        }
    }, [email, password]);

    const onEmailTextChange = useCallback((text) => {
        setError('');
        setEmail(text);
    }, []);

    const onPasswordTextChange = useCallback((text) => {
        setError('');
        setPassword(text);
    }, [])

    const onNameTextChange = useCallback((text) => {
        setError('');
        setName(text);
    }, [])

    const onSelectFlow = (flow) => {
        setFlow(flow)
    }

    return (
        <div className="app-container">
            <div className='auth-card'>
                <div className='navigation'>
                    <button className={flow === Constant.login ? 'selectedNavigationBtn' : 'navigationBtn'}
                            onClick={() => onSelectFlow(Constant.login)}>Login
                    </button>
                    <button className={flow === Constant.signup ? 'selectedNavigationBtn' : 'navigationBtn'}
                            onClick={() => onSelectFlow(Constant.signup)}>Signup
                    </button>
                </div>
                {flow === Constant.login ?
                    <Login handleSignIn={handleSignIn} onEmailTextChange={onEmailTextChange}
                           onPasswordTextChange={onPasswordTextChange}/> :
                    <Signup handleSignup={handleSignup} onEmailTextChange={onEmailTextChange}
                            onPasswordTextChange={onPasswordTextChange} onNameTextChange={onNameTextChange}/>
                }
                <div className='error'>{error}</div>
                {isLoading ? <Loader/> : null}
            </div>
        </div>
    );
}

export default Auth;
