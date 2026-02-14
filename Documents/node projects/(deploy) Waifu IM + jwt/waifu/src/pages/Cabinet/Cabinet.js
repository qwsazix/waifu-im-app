import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouritesContext";

import Lightbox from "../Home/Components/Lightbox/Lightbox";

import './Cabinet.css';

const Cabinet = () => {
    const [isActive, setActive] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const { favourites } = useFavourites();


    const openLightBox = (url) => {
        setActive(true);
        setCurrentImage(url);
    }

    const closeLightBox = () => {
        setActive(false);
        setCurrentImage(null);
    }
    
    const { token, setToken } = useAuth();

    useEffect(() => {
        document.title = "Cabinet";

        setToken(localStorage.getItem("token"));
    }, []);



    return (
        <>
            {
                token ? (
                    <div className="fav-container" >
                        {
                            favourites.length === 0 ? (
                                <p className="empty-fav">
                                    You haven't saved any images yet (or server is down)
                                </p>
                            ) : (
                                favourites.map((url, index) => (
                                    <img
                                        key={index}
                                        className="favourite-img"
                                        src={url}
                                        alt="Favourite"
                                        onClick={() => openLightBox(url)}
                                    />
                                ))
                            )
                        }
                    </div >
                ) : (
                    <div className="fav-container">
                        <p className="empty-fav">You are not logged in.</p>
                    </div>
                )}

            <Lightbox
                isActive={isActive}
                closeLightBox={closeLightBox}
                imageSrc={currentImage}
                mode="cabinet"
            />
        </>
    );
};

export default Cabinet;