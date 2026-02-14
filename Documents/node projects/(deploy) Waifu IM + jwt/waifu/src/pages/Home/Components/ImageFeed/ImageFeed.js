import './ImageFeed.css';

export default function ImageFeed({ fetchedImages, setFetchedImage, openLightBox }) {
    const handleClear = () => {
        setFetchedImage([]);
    }

    return (
        <div id="imageFeedContainer">

            {fetchedImages.length > 0 && (
                <button
                    className='avg-button feedClear'
                    onClick={handleClear}
                    title='Remove all images from image feed'
                >Clear feed</button>
            )}

            <div className="imageFeed">
                {fetchedImages.map((img) => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={img.tags.map(t => t.description).join(', ')}
                        onClick={() => openLightBox(img.url)}
                    />
                ))}
            </div>
        </div>
    )
}