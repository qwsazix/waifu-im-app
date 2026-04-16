import { useAuth } from "../../../../../context/AuthContext";
import { useFavourites } from "../../../../../context/FavouritesContext";
import { useState, useEffect, useRef } from "react";
import { Trash2, Bookmark, ExternalLink, X } from 'lucide-react';

import { BASE_URL } from "../../../../../config";

export default function HeadBar({ closeLightBox, image, mode }) {
    const { token, logout } = useAuth();
    const { favourites, setFavourites } = useFavourites();
    const [status, setStatus] = useState(null);
    // { type: 'success' | 'error', message: string, image: image.url }
    const logoutTimerRef = useRef(null);


    useEffect(() => {
        if (!status) return;

        const timer = setTimeout(() => {
            setStatus(null);
        }, 3500);

        return () => clearTimeout(timer);
    }, [status]);

    const [loading, setLoading] = useState(false); //preventing button spam
    const addToFavourite = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/fav/addFavourite`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    img: {
                        url: image.url,
                        source: image.source
                    }
                })

            })

            if (response.status === 401) {
                setStatus({ type: 'error', message: 'Expired token. Logging out in 5s.' })

                if (!logoutTimerRef.current) {
                    logoutTimerRef.current = setTimeout(() => {
                        logout();
                    }, 5000);
                }
                return;
            }

            if (response.status === 409) {
                setLoading(false);
                await removeFavourite(image.url);
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Unknown error');
            }

            setStatus({ type: 'success', message: 'Sucess', image: image.url });
            setFavourites(prev => [...prev, image]);

        } catch (error) {
            setStatus({ type: 'error', message: 'Error (check console)' });
            console.log(`Error adding image to favouirtes ${error.message}. Probably backend server is down`);
        } finally {
            setLoading(false);
        }
    }

    const removeFavourite = async (url) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/fav/removeFavourite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    img: {url: url}
                })
            })

            const data = await response.json();

            if (response.status === 409) {
                setStatus({ type: 'error', message: data.message });
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            setStatus({ type: 'success', message: data.message, image });
            setFavourites(prev => prev.filter(img => img !== url));
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            console.error(`Failed to remove: ${error.message}`)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lightbox-header">
            <button
                className="header-buttons"
                title="Close"
                onClick={() => {
                    closeLightBox();
                    setStatus(null);
                }}
            ><X size={16}/> Close</button>

            {token && mode === "main" && (
                <button
                    className={`header-buttons favourite ${status
                        ? status.type
                        : favourites.includes(image.url)
                            ? 'added'
                            : ''
                        }`}
                    title="Add/remove to favourites (you can check your images in the cabinet)"
                    onClick={addToFavourite}
                >{status
                    ? status.message
                    : favourites.includes(image.url)
                        ? 'Already in favourites'
                        : (
                            <>
                                <Bookmark size={18}/> Add to favouirtes
                            </>
                        )
                    }
                </button>
            )}

            {token && mode === "cabinet" && (
                <button
                    className={`header-buttons remove ${status ? status.type : ""}`}
                    title="Remove from favourites"
                    onClick={() => removeFavourite(image.url)}
                >{status ? (status.message) : (
                    <>
                        <Trash2 size={16} />
                        <span>Remove</span>
                    </>
                )}</button>
            )}

            <button
                className="header-buttons"
                title="Link to the origin of the image"
                onClick={() => {
                    window.open(image.source, "_blank", "noopener,noreferrer");
                }}
            ><ExternalLink size={16}/> Origin</button>
        </div>
    )
}