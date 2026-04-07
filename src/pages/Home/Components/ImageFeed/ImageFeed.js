import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageFeed({ fetchedImages, openLightBox }) {
    const ITEMS_ON_PAGE = 6;
    const [pages, setPages] = useState(1);
    const start = (pages - 1) * ITEMS_ON_PAGE;
    const page_array = fetchedImages.slice(start, start + ITEMS_ON_PAGE);
    const max_page = Math.ceil(fetchedImages.length / ITEMS_ON_PAGE);

    const getThumbnail = (originalUrl) => {
        return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=400&output=webp&il`;
    };

    useEffect(() => {
        if (fetchedImages.length === 0) {
            setPages(1);
            return;
        }

        const currentPage = Math.ceil(fetchedImages.length / ITEMS_ON_PAGE);
        if (pages < currentPage) {
            setPages(currentPage); //auto swapping pages
        }
    }, [fetchedImages.length]);

    return (
        <div className={`image-feed-container ${fetchedImages.length === 0 ? 'hidden' : ''}`}>

            <button
                className="feed-button"
                onClick={() => setPages(p => p - 1)}
                style={{
                    opacity: pages > 1 ? 1 : 0,
                    pointerEvents: pages > 1 ? 'auto' : 'none'
                }}
            ><ChevronLeft /></button>

            <div className="image-feed">
                {page_array.map((img) => (
                    <img
                        key={img.id}
                        src={getThumbnail(img.url)}
                        alt={img.tags.map(t => t.description).join(', ')}
                        onClick={() => openLightBox(img.url)}
                    />
                ))}
            </div>

            <button
                className="feed-button"
                onClick={() => setPages(p => p + 1)}
                style={{
                    opacity: pages < max_page ? 1 : 0,
                    pointerEvents: pages < max_page ? 'auto' : 'none'
                }}
            ><ChevronRight /></button>

        </div>

    )
}