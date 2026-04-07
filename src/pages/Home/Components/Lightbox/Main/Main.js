export default function Main({ imageSrc, closeLightBox }) {
    return (
        <div className="lightbox-overlay" onClick={closeLightBox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img
                    className="lightbox-img"
                    src={imageSrc}
                    alt="A female anime/manga character" />
            </div>
        </div>
    )
}