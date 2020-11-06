import React, {useEffect, useState} from "react";
import ShowAssetInfo from "../utils/show-asset-info/show-asset-info.component";
import { Divider, Grid } from "semantic-ui-react";
import AssetShowSearchComponent from "../utils/asset/asset-show-search.component";
const ViewAsset = (props) => {
  const [id, setId] = useState(null)
  const [type, setType] = useState(null)
  useEffect(() => {
    setId(parseInt(props.match.params.id,10))
    setType(props.match.params.type)
  }, [])

   return (
     <div className="app-body-container-view">
       <div className="animated fadeIn animation-view">
         <div className="view-header">
           <h1 className="mb0">ASSET 360 VIEW</h1>
           <Grid.Column style={{ width: "50%" }}>
             <AssetShowSearchComponent />            
           </Grid.Column>
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
