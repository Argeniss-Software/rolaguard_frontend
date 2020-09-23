import React, {useState} from "react";
import { MobXProviderContext } from "mobx-react";
import _ from "lodash";
import * as HttpStatus from "http-status-codes";
import Tag from "./tag.component";

const RemovableTagStandalone = (props) => {
  const { tagsStore } = React.useContext(MobXProviderContext);
  
  const [allowRemove, setAllowRemove] = useState(
    _.isUndefined(props.allowRemove) ? true : props.allowRemove
  );

  const handleRemove = () => {
    const tag = { id: props.id, name: props.name, color: props.color };
    const item = { type: props.assetType, id: props.assetId };

    tagsStore.removeTag(tag, item).then((response) => {
      if (response.status === HttpStatus.OK && _.isFunction(props.callback)) {
        props.callback(tag);
      }
    });
  };

  return (
    <Tag
      removable={allowRemove}
      onRemoveClick={handleRemove}
      key={props.id}
      name={props.name}
      color={props.color}
    />
  );
};

export default RemovableTagStandalone;
