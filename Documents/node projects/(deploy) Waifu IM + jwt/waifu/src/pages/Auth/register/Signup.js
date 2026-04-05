import '../Auth.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoaderCircle } from 'lucide-react';

import { BASE_URL } from '../../../config';

function Signup({ theme }) {
    useEffect(() => {
        document.title = "Sign up";
    }, []);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
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
        try {
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 60000);

            const response = await fetch(`${BASE_URL}/user/signup`, {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const newUser = await response.json();
            if (!response.ok) {
                throw new Error(`${newUser.message}. ${newUser.error}`);
            }

            setFetchStatus('success');
            setTimeout(() => {
                navigate('/signin');
            }, 5000);

        } catch (error) {
            console.error(error);
            setFetchStatus('error');
        } finally {
            clearTimeout(timeoutId);
        }
    }

    return (
        <div data-bs-theme={theme}>
            <form className="form" onSubmit={handleSubmit}>
                {fetchStatus === 'sleep' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label text-body">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-body">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
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
                        <p>Please wait for the server respond</p>
                        <LoaderCircle className="loader" size={45} />
                    </div>
                )}

                {fetchStatus === 'success' && (
                    <div className="loading">
                        <p>Registration successful. Redirecting...</p>
                        <LoaderCircle className="loader" size={45} />
                    </div>
                )}

                {fetchStatus === 'error' && (
                    <div className='loading'>
                        <p style={{ color: 'red' }}>Registration failed</p>
                        <button className="avg-button" onClick={() => setFetchStatus('sleep')}>
                            Try Again
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Signup;