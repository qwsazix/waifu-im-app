import HeadBar from "./Header/HeadBar"
import Main from "./Main/Main"
import "./Lightbox.css";

export default function Lightbox({isActive, closeLightBox, imageSrc, mode}) {
    return (
        <div className={`lightbox ${isActive ? "active" : ""}`}>
            <HeadBar 
            closeLightBox={closeLightBox}
            imageSrc={imageSrc}
            mode={mode}
            />
            <Main 
            imageSrc={imageSrc}
            closeLightBox={closeLightBox}
            />
        </div>
    )
}