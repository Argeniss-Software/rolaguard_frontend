import React, {useEffect, useState} from "react";
import ShowAssetInfo from "../utils/show-asset-info/show-asset-info.component";
import { Divider } from "semantic-ui-react";

const ViewAsset = (props) => {
  const [id, setId] = useState(null)
  const [type, setType] = useState(null)
  useEffect(() => {
    setId(parseInt(props.match.params.id))
    setType(props.match.params.type)
  }, [])

   return (
     <div className="app-body-container-view">
       <div className="animated fadeIn animation-view">
         <div className="view-header">
           <h1 class="mb0">ASSET 360 VIEW</h1>
         </div>
           {id && type && (
             <ShowAssetInfo
               defaultActiveIndex="0"
               id={id}
               type={type}
               doRequest={true}
             ></ShowAssetInfo>
           )}           
           <Divider />
       </div>
     </div>
   );
}

export default ViewAsset;
