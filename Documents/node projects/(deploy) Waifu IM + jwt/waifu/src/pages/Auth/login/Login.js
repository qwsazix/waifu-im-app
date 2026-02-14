import './Login.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from '../../../config';


function Login({ theme }) {
    useEffect(() => {
        document.title = "Login";
    }, []);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const loginResult = await response.json();
            if (!response.ok) throw new Error(`${loginResult.message}. ${loginResult.error}`);
            else {
                localStorage.setItem("token", loginResult.token);
                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div data-bs-theme={theme} >
            <form className="form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-body">
                        Email
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

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Login;