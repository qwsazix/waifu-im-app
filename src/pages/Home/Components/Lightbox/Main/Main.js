export default function Main({ image, closeLightBox }) {
    return (
        <div className="lightbox-overlay" onClick={closeLightBox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img
                    className="lightbox-img"
                    src={image.url}
                    alt="A female anime/manga character" />
            </div>
        </div>
    )
}