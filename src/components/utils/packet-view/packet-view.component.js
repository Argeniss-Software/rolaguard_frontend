import React from "react";
import { Table, Item } from "semantic-ui-react";
import _ from "lodash";


const Prefix = (props) => {
  return (`${props.prefix ? props.prefix : ""}`);
};

const Suffix = (props) => {
  return (`${props.suffix ? props.suffix : ""}`);
};

const ShowValue = (props) => {
  /**
   * @param props
   *    value: value to show
   *    details: details on how to show the value
   */
  
   const value = _.get(props, 'value', null);
   const details = _.get(props, 'details', null);

   if ( !_.isNull(value)){
     return (
       <b>
         <Prefix prefix={details.prefix} />
         <span className={details.toUpperCase? "upper" : ""} >
           {value}
         </span>
         <Suffix suffix={details.suffix} />
      </b>
     );
   }

   return (<span></span>);
};

const PacketViewer = (props) => {
  /**
   * @param props:
   *  packetData: data from first packet
   *  previousPacketData: data from previous packet (if needed)
   */

  const downloadTxtFile = (packet) => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(packet, undefined, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `packet-${packet.id}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const showSecondPacket = _.get(props, "previousPacketData");

  const fieldsToShow = [
    "dev_eui",
    "dev_addr",
    "gateway",
    "join_eui",
    "rssi",
    "lsnr",
    "date",
    "m_type",
    "f_count",
    "mic",
  ];

  const details = {
    id: {
      title: "ID",
    },
    dev_eui: {
      title: "Device EUI",
      toUpperCase: true,
    },
    dev_addr: {
      title: "Device address",
      toUpperCase: true,
    },
    join_eui: {
      title: "Join EUI",
      toUpperCase: true,
    },
    rssi: {
      title: "RSSI",
      suffix: " dBm",
    },
    lsnr: {
      title: "SNR",
      suffix: " dB",
    },
    date: {
      title: "Timestamp",
    },
    m_type: {
      title: "Message type",
    },
    mic: {
      title: "Message integity check (mic)",
      toUpperCase: true,
    },
    gateway: {
      title: "Gateway ID",
      toUpperCase: true,
    },
    f_count: {
      title: "Counter",
    }
  };

  return (
    <React.Fragment>
      <div className="alert-details-technical-table">
        <Table compact="very" celled padded>
          <Table.Body>
            <Table.Row>
              <Table.Cell
                width="3"
                className="technical-details-table-row-right"
              >
                <b>
                  Property
                </b>
              </Table.Cell>
              <Table.Cell
                width="3"
                className="technical-details-table-row-right"
              >
                <b>
                  Message #1
                </b>
              </Table.Cell>
              {showSecondPacket &&
                <Table.Cell
                  width="3"
                  className="technical-details-table-row-right"
                >
                  <b>
                    Message #2
                  </b>
                </Table.Cell>
              }
            </Table.Row>
            {fieldsToShow
              .map((item, index) => {
                const itemDetails = details[item];
                return (
                  <Table.Row key={index}>
                    <Table.Cell
                      width="3"
                      className="technical-details-table-row-left"
                      style={{ borderTop: "1px solid lightgray !important" }}
                    >
                      <i>{itemDetails.title}</i>
                    </Table.Cell>
                    <Table.Cell
                      width="3"
                      className="technical-details-table-row-right"
                    >
                      <ShowValue value={props.packetData[item]} details={itemDetails} />
                    </Table.Cell>
                    {showSecondPacket &&
                      <Table.Cell
                        width="3"
                        className="technical-details-table-row-right"
                      >
                        <ShowValue value={props.previousPacketData[item]} details={itemDetails} />
                      </Table.Cell>
                    }
                  </Table.Row>
                );
              })}
            <Table.Row>
              <Table.Cell
                width="3"
                className="technical-details-table-row-left"
                style={{ borderTop: "1px solid lightgray !important" }}
              >
              </Table.Cell>
              <Table.Cell
                width="3"
                className="technical-details-table-row-right"
              >
                <a href="#" onClick={() => downloadTxtFile(props.packetData)}>
                      download raw data
                    </a>
              </Table.Cell>
              {showSecondPacket &&
                <Table.Cell
                  width="3"
                  className="technical-details-table-row-right"
                >
                    <a href="#" onClick={() => downloadTxtFile(props.previousPacketData)}>
                      download raw data
                    </a>
                </Table.Cell>
              }
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </React.Fragment>
  );
};

export default PacketViewer;
