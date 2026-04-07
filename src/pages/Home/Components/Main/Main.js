import React, { useEffect, useState } from 'react';

//components and css
import SfwTags from './Components/SfwTags.js';
import NsfwTags from './Components/NsfwTags.js';
import ImageFeed from '../ImageFeed/ImageFeed.js';
import './Main.css';


const Main = ({ openLightBox }) => {
    const baseURL = "https://api.waifu.im";


    const [tags, setTags] = useState([]);
    const [isNsfw, setNsfw] = useState('False');
    const [selectedTags, setSelected] = useState([]);
    const [fetchedImages, setFetchedImage] = useState([]);

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
                console.log(isNsfw);
                return prev.filter(item => item !== tagName);
            } else {
                return [...prev, tagName];
            }
        })
    }

    const [isHollow, setHollow] = useState(false);
    const handleSearch = async () => {
        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append('IncludedTags', tag))
        params.append('isNsfw', isNsfw);
        fetchedImages.slice(-300).forEach(img => {
            params.append('ExcludedIds', img.id);
        });

        try {
            const response = await fetch(`${baseURL}/images?${params.toString()}`);
            console.log(`${baseURL}/images?${params.toString()}`);
            if (!response.ok) throw new Error(response);
            const data = await response.json();
            const newItem = data.items[0];

            if (!newItem) setHollow(true);//no images found by selected tags OR every image of selected tags have already been fetched
            else {
                setHollow(false);
                setFetchedImage(prev => [...prev, newItem])
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

                    <div className='button-container'>
                        <button
                            className='avg-button search'
                            onClick={handleSearch}
                            title='Fetch images from waifu.im database'
                        >{selectedTags.length === 0 ? 'Search (random)' : 'Search'}</button>

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