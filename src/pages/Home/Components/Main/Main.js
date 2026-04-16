import React, { useEffect, useState } from 'react';

//components and css
import SfwTags from './Components/SfwTags.js';
import NsfwTags from './Components/NsfwTags.js';
import ImageFeed from '../ImageFeed/ImageFeed.js';
import './Main.css';
import { RotateCcw } from 'lucide-react';


const Main = ({ openLightBox }) => {
    const baseURL = "https://api.waifu.im";


    const [tags, setTags] = useState([]);
    const [isNsfw, setNsfw] = useState('False');
    const [selectedTags, setSelected] = useState([]);
    const [fetchedImages, setFetchedImage] = useState([]);
    const [imagesNum, setImagesNum] = useState(1);

    useEffect(() => {
        const getTags = async () => {
            try {
                const response = await fetch(`${baseURL}/tags`, {
                    headers: {
                        "Accept-Version": "v7"
                    }
                });
                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                setTags(data.items);
            } catch (error) {
                console.error(error);
            }
        }

        getTags();
    }, []);

    const toggleTagBtn = (tagName) => {
        setSelected(prev => {
            if (prev.includes(tagName)) {
                return prev.filter(item => item !== tagName);
            } else {
                return [...prev, tagName];
            }
        })
    }

    const [isHollow, setHollow] = useState(false);
    const handleSearch = async () => {
        let set = new Set(selectedTags);
        const params = new URLSearchParams();
        if (imagesNum > 1) {
            params.append('PageSize', imagesNum);
        }
        selectedTags.forEach(tag => params.append('IncludedTags', tag))
        params.append('isNsfw', isNsfw);

        //exlclude fetched ids from search
        const excluded = fetchedImages.filter(img => { //optimization, to prevent images that won't appear anyway from being included in excludedIds and avoid overloading the query
            const slugs = img.tags.map(tag => tag.slug);

            return slugs.some(slug => set.has(slug));
        });

        if (selectedTags.length > 0) {
            excluded.slice(-300).forEach(img => {
                params.append('ExcludedIds', img.id)
            });
        } else {
            fetchedImages.slice(-300).forEach(img => {
                params.append('ExcludedIds', img.id);
            });
        }

        try {
            const response = await fetch(`${baseURL}/images?${params.toString()}`);
            if (!response.ok) throw new Error(response);
            const data = await response.json();

            if (!data.items[0]) {
                setHollow(true); //no images found by selected tags OR every image of selected tags have already been fetched
            } else {
                const uniqueNew = data.items.filter(
                    item => !fetchedImages.some(existing => existing.id === item.id)
                );

                if (uniqueNew.length > 0) {
                    setFetchedImage(prev => [...prev, ...uniqueNew]);
                    setHollow(false);
                }

                if (uniqueNew.length === 0 && fetchedImages.length >= data.totalCount) {
                    setHollow(true);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setHollow(false);
    }, [selectedTags, isNsfw]);

    return (
        <div id='home'>
            <div className='leftside-container'>
                <div className={`hollow-banner ${isHollow ? 'visible' : ''}`} >
                    <strong>No images found</strong>
                    <span>No more images match these tags. Try a new combination.</span>
                </div>

                <div className='filter-panel'>

                    <div className='tags-container sfw'>
                        <SfwTags
                            tags={tags}
                            toggle={toggleTagBtn}
                            selectedTags={selectedTags}
                        />
                    </div>

                    <div className='nsfwWrap'>
                        <NsfwTags
                            isNsfw={isNsfw}
                            setNsfw={setNsfw}
                            tags={tags}
                            toggle={toggleTagBtn}
                            selectedTags={selectedTags}
                            setSelected={setSelected}
                        />
                    </div>

                    <div style={
                        { display: 'flex', 'gap': '5px', justifyContent: 'center', alignItems: 'center' }
                    }>
                        <label htmlFor="images-number">Amount:</label>
                        <div style={{ display: 'flex', 'flexDirection': 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <input
                                id="images-number"
                                value={imagesNum}
                                onChange={(e) => {
                                    setImagesNum(e.target.value);
                                }}
                                onBlur={() => {
                                    if (imagesNum > 50) setImagesNum(50);
                                    if (imagesNum < 1 || imagesNum === "") setImagesNum(1);
                                }}
                                type="number"
                                min="1" max="50"
                                placeholder='1-50'
                            />
                            <button
                                className='reset-btn'
                                title='Reset input to default value'
                                onClick={() => setImagesNum(1)}
                            ><RotateCcw /></button>
                        </div>
                    </div>

                    <div className='button-container'>
                        <button
                            className='avg-button search'
                            onClick={handleSearch}
                            title='Fetch images from waifu.im database'
                        >{`${selectedTags.length === 0 ? 'Search (random)' : 'Search'} x${imagesNum}`}</button>

                        {fetchedImages.length > 0 && (
                            <button
                                className='avg-button feedClear'
                                onClick={() => {
                                    setFetchedImage([]);
                                    setHollow(false);
                                }}
                                title='Remove all images from image feed'
                            >Clear images</button>
                        )}
                    </div>

                    {isNsfw === 'True' && (
                        <span className="label-text warning">Search now includes ONLY NSFW materials</span>
                    )}

                    {isNsfw === 'All' && (
                        <span className="label-text warning">Search now includes BOTH NSFW and SFW materials</span>
                    )}
                </div>
            </div>


            <ImageFeed
                fetchedImages={fetchedImages}
                setFetchedImage={setFetchedImage}
                openLightBox={openLightBox}
            />
        </div>
    )
};

export default Main;