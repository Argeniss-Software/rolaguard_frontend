import React from "react";
import { Segment, Grid } from "semantic-ui-react";

const ResourceUsageGraphComponent = (props) => {
  return (
    <Segment>
      <Grid className="animated fadeIn">
        <Grid.Row id="visualization-container" className="data-container pl pr">
          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
              <i
                style={{ color: "gray", align: "middle" }}
                className="fas fa-exclamation fa-4x"
              ></i>
            </div>
          </Grid.Column>

          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
              <i
                style={{ color: "gray", align: "middle" }}
                className="fas fa-exclamation fa-4x"
              ></i>
            </div>
          </Grid.Column>

          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
              <i
                style={{ color: "gray", align: "middle" }}
                className="fas fa-exclamation fa-4x"
              ></i>
            </div>
          </Grid.Column>

          <Grid.Column
            className="data-container-box pl0 pr0"
            mobile={16}
            tablet={8}
            computer={4}
          >
            <div className="box-data">
              <h5 style={{ color: "gray" }}>WORK IN PROGRESS</h5>
              <i
                style={{ color: "gray", align: "middle" }}
                className="fas fa-exclamation fa-4x"
              ></i>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}

export default ResourceUsageGraphComponent;
