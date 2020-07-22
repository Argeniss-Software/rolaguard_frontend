import * as React from "react";
import "./tag.component.css"

const Tag = (props) => {

    /*
        props:
            name: name to display
            color: background color
            textColor: text color
            id: tag id
            selectable: boolean that indicates if the tag is selectable
            removable: boolean that indicates if the tag can be remove
                from where it is (shows a close "button")

            fontSize: in case you need to change it
            opacity: backgorund opacity values from 0 to 1
            onClick: function to run when clicked
            onRemoveClick: function to run when close button clicked
    */


    const { name, color, textColor, onClick, removable, selectable} = props;
    return (
        <div
            className={selectable? "container selectable" : "container"}
            style={{backgroundColor: color, fontSize:props.fontSize, opacity:props.opacity}}
            onClick={onClick}
        >
            <span className="text" style={{color: textColor}}>{name} {removable?<i style={{cursor: "pointer"}} onClick={props.onRemoveClick} className="fas fa-times-circle fa-sm"></i>:""}</span>
        </div>
    );
}

export default Tag;
