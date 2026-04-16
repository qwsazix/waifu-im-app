import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouritesContext";

import { LoaderCircle, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react';

import Lightbox from "../Home/Components/Lightbox/Lightbox";

import './Cabinet.css';


const Cabinet = () => {
    const [isActive, setActive] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [pages, setPages] = useState(1);

    const { favourites, fetchStatus } = useFavourites();
    const { token, setToken } = useAuth();

    const ITEMS_ON_PAGE = 8;
    const max_page = Math.ceil(favourites.length / ITEMS_ON_PAGE);
    const start = (pages - 1) * ITEMS_ON_PAGE;
    const page_array = favourites.slice(start, start + ITEMS_ON_PAGE);

    useEffect(() => {
        document.title = "Cabinet";
        setToken(localStorage.getItem("token"));
    }, [setToken]);

    const openLightBox = (image) => { setActive(true); setCurrentImage(image); };
    const closeLightBox = () => { setActive(false); setCurrentImage({}); };

    if (fetchStatus === 'loading') {
        return (
            <div className="cabinet">
                <div className="loading">
                    <p>Please wait for the server to wake up</p>
                    <LoaderCircle className="loader" size={45} />
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="cabinet">
                <div className="fav-container">
                    <p className="empty-fav">You are not logged in.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cabinet">
            <div className="fav-container">
                {favourites.length === 0 ? (
                    <p className="empty-fav">You haven't saved any images yet</p>
                ) : (
                    <>
                        <div style={{ 'display': 'flex', 'gap': '20px', 'flexDirection': 'row-reverse' }}>
                            <button
                                className="feed-button"
                                onClick={() => setPages(p => p - 1)}
                                style={{
                                    opacity: pages > 1 ? 1 : 0,
                                    pointerEvents: pages > 1 ? 'auto' : 'none'
                                }}
                                title="Previous page"
                            ><ChevronLeft /></button>

                            <button
                                className="feed-button"
                                onClick={() => setPages(1)}
                                style={{
                                    opacity: pages > 1 ? 1 : 0,
                                    pointerEvents: pages > 1 ? 'auto' : 'none'
                                }}
                                title="First page"
                            ><ChevronFirst /></button>
                        </div>

                        <div className="fav-grid">
                            {page_array.map((img) => (
                                <img
                                    key={img.url}
                                    className="favourite-img"
                                    src={img.url}
                                    alt="Favourite"
                                    onClick={() => openLightBox(img)}
                                />
                            ))}
                        </div>

                        <div style={{ 'display': 'flex', 'gap': '20px' }}>
                            <button
                                className="feed-button"
                                onClick={() => setPages(p => p + 1)}
                                style={{
                                    opacity: pages < max_page ? 1 : 0,
                                    pointerEvents: pages < max_page ? 'auto' : 'none'
                                }}
                                title="Next page"
                            ><ChevronRight /></button>

                            <button
                                className="feed-button"
                                onClick={() => setPages(max_page)}
                                style={{
                                    opacity: pages < max_page ? 1 : 0,
                                    pointerEvents: pages < max_page ? 'auto' : 'none'
                                }}
                                title="Last page"
                            ><ChevronLast /></button>
                        </div>
                    </>
                )}
            </div>

            <Lightbox
                isActive={isActive}
                closeLightBox={closeLightBox}
                image={currentImage}
                mode="cabinet"
            />
        </div>
    );
};

export default Cabinet;