import '../Auth.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoaderCircle } from 'lucide-react';

import { BASE_URL } from '../../../config';


function Login({ theme }) {
    useEffect(() => {
        document.title = "Login";
    }, []);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [fetchStatus, setFetchStatus] = useState('sleep');
    const controller = new AbortController();
    const handleSubmit = async (e) => {
        e.preventDefault();

        setFetchStatus('loading');
        let timeoutId;
        try {
            timeoutId = setTimeout(() => {
                controller.abort();
            }, 60000);

            const response = await fetch(`${BASE_URL}/auth/login`, {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const loginResult = await response.json();
            if (!response.ok) throw new Error(`${loginResult.message}. ${loginResult.error}`);
            else {
                setFetchStatus('success');
                localStorage.setItem("token", loginResult.token);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            alert(error.message);
            setFetchStatus('error')
        } finally {
            clearTimeout(timeoutId);
        }
    }

    return (
        <div data-bs-theme={theme} >
            <form className="form" onSubmit={handleSubmit}>
                {fetchStatus === 'sleep' &&
                    (
                        <>
                            <div className="mb-3">
                                <label htmlFor="login" className="form-label text-body">
                                    Email or username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="login"
                                    name="login"
                                    required
                                    value={formData.login}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-body">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="avg-button">
                                Submit
                            </button>
                        </>
                    )}

                {fetchStatus === 'loading' && (
                    <div className="loading">
                        <p>Please wait for the server to response</p>
                        <LoaderCircle className="loader" size={45} />
                    </div>
                )}

                {fetchStatus === 'success' && (
                    <div className="loading">
                        <p>Login successful! Redirecting…</p>
                        <LoaderCircle className="loader" size={45} />
                    </div>
                )}

                {fetchStatus === 'error' && (
                    <div className='loading'>
                        <p style={{ color: 'red' }}>Login failed. Please check your console.</p>
                        <button className="avg-button" onClick={() => setFetchStatus('sleep')}>
                            Try Again
                        </button>
                    </div>
                )}

            </form>
        </div>
    )
}

export default Login;