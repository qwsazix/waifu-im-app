import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

import { BASE_URL } from "../config";

const FavouritesContext = createContext(null);

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState([]);
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
        setFavourites([]);
        return;
    }

    const getFavourites = async () => {
            try {
                const response = await fetch(`${BASE_URL}/fav/getFavourite`, {
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
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        }

        getFavourites();
  }, [token, logout]);

  return (
    <FavouritesContext.Provider value={{ favourites, setFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
};
