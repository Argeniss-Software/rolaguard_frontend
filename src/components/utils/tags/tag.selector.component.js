import * as React from "react";
import { observer, inject } from "mobx-react";
import { Popup, Input, Divider, Button} from "semantic-ui-react";

import "./tag.selector.component.css";
import Tag from "./tag.component";


@inject("generalDataStore", "usersStore", "deviceStore", "alarmStore", "alertStore", "dataCollectorStore")
@observer
class TagSelector extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            isOpen: false,
            tagsListToShow:[],
            itemTags: [],
            maxTagsToShow: 100,
        };
    }

    UNSAFE_componentWillMount(){
        // slice to only show 8 tags, order them by length
        this.setState({
            tagsListToShow: this.props.tags.slice(0,this.state.maxTagsToShow).sort((a, b) => a.name.length - b.name.length),
        });
    }

    handleSearch = (search) => {
        /*
            filter tags and show those that include the search criteria
            slice it to show first 8 and order them by lenght
        */
        this.setState({
            tagsListToShow:
                this.props.tags
                    .filter((tag) => tag.name.includes(search.target.value))
                    .slice(0, this.state.maxTagsToShow)
                    .sort((a, b) => a.name.length - b.name.length)
        });
    }

    handleTagSelection(selectedTag){
        const { tagsListToShow } = this.state;
        this.setState({
            tagsListToShow:
                this.props.tags
                    .filter((tag) => tag.id !== selectedTag.id)
                    .slice(0, this.state.maxTagsToShow)
                    .sort((a, b) => a.name.length - b.name.length),
            isOpen: false
        });
        
        this.props.onSelection(selectedTag);
    }

    
    handleOpen = () => {
        this.setState({ isOpen: true });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    render() {
        const { tagsListToShow, isOpen} = this.state;
        return (
            <Popup
                trigger={
                    <span>
                        <Tag name="+ add tag" color="#e0e1e2" textColor="rgba(0,0,0,.6)"/>
                    </span>
                }
                on='click'
                open={isOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                pinned
                flowing hoverable
                position='bottom center'
            >
                <span className="tag-selector-popup">
                    <div style={{textAlign: "center"}}>
                        <Input size='mini' placeholder='Search by name'onChange={this.handleSearch}/>
                    </div>
                    <Divider/>
                    <div className="tag-list-selector center">
                        {tagsListToShow && tagsListToShow.length !== 0 &&
                            tagsListToShow.map((tag) => <Tag name={tag.name} color={tag.color} onClick={() => this.handleTagSelection(tag)}/>)
                        }
                        {tagsListToShow && tagsListToShow.length === 0 &&
                            <span style={{color: "gray"}}><i>No tags to show</i></span>
                        }
                    </div>
                    <Divider/>
                    <div style={{textAlign:"center"}}>
                        <Button size='mini' onClick={() => alert("Work in progress")}>Create new tag</Button>
                    </div>
                </span>

            </Popup>
        );
    }
}

export default TagSelector;