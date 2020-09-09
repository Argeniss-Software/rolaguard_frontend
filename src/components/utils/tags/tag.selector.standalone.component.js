import React from "react";
import { MobXProviderContext } from "mobx-react";
import * as HttpStatus from "http-status-codes";
import _ from "lodash";

import TagSelector from "./tag.selector.component";

const TagSelectorStandalone = (props) => {
  /**
   * @param props:
   *    type: "device" or "gateway"
   *    id: device or gateway id
   *    alreadyAssignTags: tags already assign to the device or gateway
   *    callback: funtion to run after asssign
   */

  const { tagsStore } = React.useContext(MobXProviderContext);

  const hanldleTagSelected = (tag) => {
    const item = { type: props.type, id: props.id };
    console.log(tag)
    tagsStore.assignTag(tag, item).then((response) => {
      if (response.status === HttpStatus.OK && _.isFunction(props.callback)) {
        console.log("here")
        props.callback(tag);
      }
    });
  };

  return (
    <TagSelector
      alreadyAssignTags={props.alreadyAssignTags ? props.alreadyAssignTags : []}
      onSelection={hanldleTagSelected}
    />
  );
};

export default TagSelectorStandalone;
