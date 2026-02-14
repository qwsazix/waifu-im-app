export default function SfwTags({ tags, toggle, selectedTags }) {
    const sfw = tags.filter(item => !['ero', 'ecchi', 'oppai', 'hentai', 'milf', 'ass', 'paizuri', 'oral'].includes(item.slug));

    return (
        <>
            {sfw.map(item => (
                <button
                    key={item.id}
                    className={`tag ${selectedTags.includes(item.slug) ? 'active' : ""}`}
                    title={item.description}
                    onClick={() => toggle(item.slug)}
                >{item.name}</button>
            ))}
        </>
    )
}