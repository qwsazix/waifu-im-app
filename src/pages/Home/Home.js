import Lightbox from "./Components/Lightbox/Lightbox";
import Main from "./Components/Main/Main";
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";

import { BASE_URL } from "../../config";


export default function Home() {
    const { token, setToken, logout } = useAuth();

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

    const [isActive, setActive] = useState(false);
    const [activeImageSrc, setActiveImageSrc] = useState(null);

    const openLightBox = (src) => {
        setActive(true);
        setActiveImageSrc(src);
    }

    const closeLightBox = () => {
        setActive(false);
        setActiveImageSrc(null);
    }

    return (
        <>
            <Main
                openLightBox={openLightBox}
            />
            <Lightbox
                isActive={isActive}
                closeLightBox={closeLightBox}
                imageSrc={activeImageSrc}
                mode="main"
            />
        </>
    )
}