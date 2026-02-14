export default function Main({ imageSrc }) {
    return (
        <div className="lightbox-overlay">
            <div className="lightbox-content">
                <img 
                className="lightbox-img"
                src={imageSrc}
                alt="A female anime/manga character" />
            </div>
        </div>
    )
}