import HeadBar from "./Header/HeadBar"
import Main from "./Main/Main"
import "./Lightbox.css";

export default function Lightbox({isActive, closeLightBox, image, mode}) {
    return (
        <div className={`lightbox ${isActive ? "active" : ""}`}>
            <HeadBar 
            closeLightBox={closeLightBox}
            image={image}
            mode={mode}
            />
            <Main 
            image={image}
            closeLightBox={closeLightBox}
            />
        </div>
    )
}