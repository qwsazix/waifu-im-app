import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

import { BASE_URL } from "../config";

const FavouritesContext = createContext(null);

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
    const [fetchStatus, setFetchStatus] = useState("loading");
    const [favourites, setFavourites] = useState([]);
    const { token, logout } = useAuth();

    useEffect(() => {
        if (!token) {
            setFavourites([]);
            return;
        }
        
        const controller = new AbortController();
        const getFavourites = async () => {
            try {
                var timeoutId = setTimeout(() => {
                    controller.abort();
                }, 60000);

                const response = await fetch(`${BASE_URL}/fav/getFavourite`, {
                    signal: controller.signal,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    logout();
                    return;
                }

                const data = await response.json();

                setFavourites(data);
                setFetchStatus("success");
            } catch (error) {
                console.error("Fetch error:", error.message);
                setFetchStatus("error");
            } finally {
                clearTimeout(timeoutId);
            }
        }

        getFavourites();

        return () => controller.abort();
    }, [token, logout]);

    return (
        <FavouritesContext.Provider value={{ favourites, setFavourites, fetchStatus }}>
            {children}
        </FavouritesContext.Provider>
    );
};
