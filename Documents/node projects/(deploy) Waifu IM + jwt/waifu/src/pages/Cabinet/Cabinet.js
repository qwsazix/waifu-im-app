import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouritesContext";

import { LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import Lightbox from "../Home/Components/Lightbox/Lightbox";

import './Cabinet.css';


const Cabinet = () => {
    const [isActive, setActive] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
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

    const openLightBox = (url) => { setActive(true); setCurrentImage(url); };
    const closeLightBox = () => { setActive(false); setCurrentImage(null); };

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
                        <button
                            className="feed-button"
                            onClick={() => setPages(p => p - 1)}
                            disabled={pages <= 1}
                            style={{ opacity: pages > 1 ? 1 : 0 }}
                        >
                            <ChevronLeft />
                        </button>

                        <div className="fav-grid">
                            {page_array.map((url) => (
                                <img
                                    key={url}
                                    className="favourite-img"
                                    src={getThumbnail(url)}
                                    alt="Favourite"
                                    onClick={() => openLightBox(url)}
                                />
                            ))}
                        </div>

                        <button
                            className="feed-button"
                            onClick={() => setPages(p => p + 1)}
                            disabled={pages >= max_page}
                            style={{ opacity: pages < max_page ? 1 : 0 }}
                        >
                            <ChevronRight />
                        </button>
                    </>
                )}
            </div>

            <Lightbox
                isActive={isActive}
                closeLightBox={closeLightBox}
                imageSrc={currentImage}
                mode="cabinet"
            />
        </div>
    );
};

export default Cabinet;