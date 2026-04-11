import { useEffect, useMemo } from "react";


export default function NsfwTags({ isNsfw, setNsfw, tags, toggle, selectedTags, setSelected }) {
    const nsfw = useMemo(
        () => tags.filter(item => ['ero', 'ecchi', 'oppai', 'hentai', 'milf', 'ass', 'paizuri', 'oral'].includes(item.slug)),
        [tags]
    );
    const nsfwSlugs = useMemo(
        () => nsfw.map(item => item.slug),
        [nsfw]
    );

    useEffect(() => {
        if (isNsfw !== 'True') {
            setSelected(prev => {
                const filtered = prev.filter(tag => !nsfwSlugs.includes(tag));
                return filtered.length === prev.length ? prev : filtered;
            });
        }
    }, [isNsfw, nsfwSlugs,setSelected]);


    return (
        <>
            <div className="toggle-wrapper">
                <div className={`nsfw-toggle isNsfw-${isNsfw}`}>
                    <div className="slider"></div>
                    <div className="title">
                        <span className={isNsfw === 'False' ? 'active' : 'disabled'} onClick={() => setNsfw('False')}>SFW</span>
                        <span className={isNsfw === 'True' ? 'active' : 'disabled'} onClick={() => setNsfw('True')}>NSFW</span>
                        <span className={isNsfw === 'All' ? 'active' : 'disabled'} onClick={() => setNsfw('All')}>Both</span>
                    </div>
                </div>
            </div>

            {isNsfw === 'True' && (
                <div className="NsfwTags">
                    <div className='tags-container'>
                        {nsfw.map(item => (
                            <button
                                key={item.id}
                                className={`tag ${selectedTags.includes(item.slug) ? 'active' : ""}`}
                                title={item.description}
                                onClick={() => toggle(item.slug)}
                            >{item.name}</button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}