import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Popup, Input, Divider, Button, Modal, Form} from "semantic-ui-react";

import "./tag.creator.component.css";
import Tag from "./tag.component";
import LoaderComponent from "../../utils/loader.component";
import { rgb } from "d3";

const ColorPicker = (props) => {
    const [selected, setSelected] = React.useState(false);
    return(
        <div
            className={((!props.disabled && selected) || props.selected === props.color)? "color-box selected" : "color-box"}
            style={{backgroundColor: props.color}}
            onClick={() => {
                setSelected(true)
                if(!props.disabled) props.onColorSelect(props.color);
            }}
            onMouseOver={() => setSelected(true)}
            onMouseLeave={() => setSelected(false)}/>
    );
}


const TagsCreatorModal = (props) => {

    const { tagsStore } = React.useContext(MobXProviderContext);

    const [open, setOpen] = React.useState(!!props.open);
    const [name, setName] = React.useState("tag name");
    const [nameDefault, setNameDefault] = React.useState(true);
    const [color, setColor] = React.useState("#AAAAAA");
    const [colorDefault, setColorDefault] = React.useState(true);
    const [sended, setSended] = React.useState(false);



    const handleInput = (field) => {
        setName(field.target.value? field.target.value : "tag name");
        setNameDefault(!field.target.value);
    }

    const handleColorSelect = (color) => {
        setColor(color);
        setColorDefault(false);
    }

    const handleCreate = (name, color) => {
        setSended(true);
        tagsStore.createTag(name, color).then(
            (response) => {
                if(response.status !== 200) console.log(response.status, response.data)
                else {
                    setSended(false);
                    setOpen(false);
                    props.onClose();
                }
            }
        ).catch((error) => console.log(error));
    }

    const colors = [
        "#5d9cec",
        "#fad732",
        "#ff902b",
        "#f05050"
    ];
    return(
        <Modal
        open={open}
        size='tiny'>
            <Modal.Header>
                CREATE NEW TAG
            </Modal.Header>

            <Modal.Content>
							<div className="modal-content">
								<div className="tag-preview">
									<Tag
										name={name}
										color={color}
										textColor="white"
										fontSize="30px"
										opacity={nameDefault? "0.5" : "1"}
									/>
								</div>
								<Input disabled={sended} nameClass="" placeholder="tag name" onChange={handleInput}/>
								<div style={{textAlign:"center", margin: "15px"}}>
										{colors.map((col, index) => <ColorPicker disabled={sended} selected={color} color={col} onColorSelect={handleColorSelect}/>)}
								</div>
							</div>
            </Modal.Content>

            <Modal.Actions>
                <Button
                    onClick={props.onClose}
                    content="Cancel"
                    disabled={sended}
                />
                <Button
                    loading={sended}
                    type="submit"
                    color="green"
                    disabled={nameDefault || colorDefault}
                    content="Create"
                    onClick={ () => handleCreate(name, color)}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default TagsCreatorModal;


