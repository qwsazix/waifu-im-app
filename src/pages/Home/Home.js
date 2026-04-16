import Lightbox from "./Components/Lightbox/Lightbox";
import Main from "./Components/Main/Main";
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";

import { BASE_URL } from "../../config";


const MobileBlocker = () => (
    <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        color: '#333',
        fontFamily: 'sans-serif'
    }}>
        <div>
            <h1>Mobile version is not ready yet</h1>
            <p>Please use a pc or a tablet to access the website.</p>
        </div>
    </div>
);

export default function Home() {
    const [isMobile, setIsMobile] = useState(false);
    const { token, setToken, logout } = useAuth();
    const [isActive, setActive] = useState(false);
    const [activeImage, setActiveImage] = useState({});

    useEffect(() => {
        const checkDevice = () => {
            const mobileWidth = window.innerWidth < 768;
            const isMobileHardware = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobileWidth || isMobileHardware);
        }
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [setToken]);

    useEffect(() => {
        document.title = "Home";

        const checkToken = async () => {
            try {
                const response = await fetch(`${BASE_URL}/token/check`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status === 401) {
                    logout();
                }
            } catch (error) {
                console.error("Token, check failed, err")
            }
        }

        if (token) checkToken();
    }, [token, logout]);


    const openLightBox = (src) => {
        setActive(true);
        setActiveImage(src);
    }

    const closeLightBox = () => {
        setActive(false);
        setActiveImage({});
    }

    if (isMobile) {
        return (
            <MobileBlocker />
        )
    }

    return (
        <>
            <Main
                openLightBox={openLightBox}
            />
            <Lightbox
                isActive={isActive}
                closeLightBox={closeLightBox}
                image={activeImage}
                mode="main"
            />
        </>
    )
}