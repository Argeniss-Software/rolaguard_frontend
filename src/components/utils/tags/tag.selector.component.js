import * as React from "react";
import { MobXProviderContext } from "mobx-react";
import { Popup, Input, Divider, Button} from "semantic-ui-react";

import "./tag.selector.component.css";
import Tag from "./tag.component";
import TagsCreatorModal from "./tag.creator.component";


const TagSelector = (props) => {

    const { tagsStore } = React.useContext(MobXProviderContext);

    const [open, setOpen] = React.useState(false);
    const [tags, setTags] = React.useState([]);
    const [tagsFiltered, setTagsFiltered] = React.useState([])
    const [tagCreate, setTagCreate] = React.useState("")
    const [loading, setLoading] = React.useState(true);
    const [showTagCreatorModal, setShowTagCreatorModal] = React.useState(false);


    const handleSearch = (search) => {
        setTagsFiltered(tags.filter((tag) => tag.name.includes(search.target.value)));
        setTagCreate(search.target.value);
    }

    const handleTagSelection = (selectedTag) => {
        setOpen(false);
        props.onSelection(selectedTag);
    }

    
    const handleOpen = () => {
        setOpen(true);
        setLoading(true);
        tagsStore.getTags().then(
        (response) => {
            const tagsRetreived = response.data
                .filter((tag) => !props.alreadyAssignTags.map((t) => t.id).includes(tag.id))
                .sort((a, b) => a.name.length - b.name.length);
            setTags(tagsRetreived);
            setTagsFiltered(tagsRetreived);
            setLoading(false);
        });
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
        <Popup
            trigger={
                <Tag selectable={true} name="+ add label" color="#e0e1e2" textColor="rgba(0,0,0,.6)"/>
            }
            on='click'
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            pinned
            flowing hoverable
            position='bottom center'
        >
            <span className="tag-selector-popup">

                {/* Show tag search input field */}
                <div style={{textAlign: "center"}}>
                    <Input size='mini' placeholder='Search by name' onChange={handleSearch}/>
                </div>

                <Divider/>

                {/* Shows tags that can be assign to the selected devices*/}
                {!loading && tagsFiltered && tagsFiltered.length !== 0 &&
                    <div className="tag-list-selector center">
                        {tagsFiltered.map((tag) => <Tag key={tag.id} selectable={true} name={tag.name} color={tag.color} onClick={() => handleTagSelection(tag)}/>)}
                    </div>
                }
                {/* No items to show */}
                {!loading && tagsFiltered && tagsFiltered.length === 0 &&
                    <div className="tag-list-selector center">
                        {<Tag selectable={true} creatable={true} name={tagCreate}  color={"#f05050"} onClick={() => {setShowTagCreatorModal(true); setOpen(false);}}/>}
                    </div>
                   
                }
                {/* Loading state */}
                {loading &&
                    <div className="animated fadeInDown loading-message loading-tags"><i className="fas fa-circle-notch"/>loading tags</div>
                }

                <Divider/>

                {/* Create new tag button */}
                <div style={{textAlign:"center"}}>
                    <Button size='mini' onClick={() => {setShowTagCreatorModal(true); setOpen(false);}}>Create new label</Button>
                </div>
            </span>
        </Popup>
        {showTagCreatorModal &&
            <TagsCreatorModal
            open={showTagCreatorModal}
            name={tagCreate}
            onClose={() => setShowTagCreatorModal(false)}/>
            }
        </React.Fragment>
    );
}

export default TagSelector;