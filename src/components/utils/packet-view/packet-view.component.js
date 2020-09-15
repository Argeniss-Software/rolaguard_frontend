import React from "react";
import { Table, Item } from "semantic-ui-react";
import _ from "lodash";

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
    "id",
    "dev_eui",
    "join_eui",
    "rssi",
    "lsnr",
    "date",
    "m_type",
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
    join_eui: {
      title: "Join EUI",
      toUpperCase: true,
    },
    rssi: {
      title: "Signal Strenght",
      suffix: " dBm",
    },
    lsnr: {
      title: "Signal to noise ratio",
      suffix: " dB",
    },
    date: {
      title: "Timestamp",
    },
    m_type: {
      title: "Message type",
    },
    mic: {
      title: "Message integrity check",
      toUpperCase: true,
    },
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
                  Involved Packet #1
                </b>
              </Table.Cell>
              {showSecondPacket &&
                <Table.Cell
                  width="3"
                  className="technical-details-table-row-right"
                >
                  <b>
                    Involved Packet #2
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
                      <b>{`${itemDetails.prefix ? itemDetails.prefix : ""} ${
                        itemDetails.toUpperCase && props.packetData[item]
                          ? props.packetData[item].toUpperCase()
                          : (props.packetData[item]? props.packetData[item] : "")
                      }${itemDetails.suffix ? itemDetails.suffix : ""}`}</b>
                    </Table.Cell>
                    {showSecondPacket &&
                      <Table.Cell
                        width="3"
                        className="technical-details-table-row-right"
                      >
                        <b>{`${itemDetails.prefix ? itemDetails.prefix : ""} ${
                          itemDetails.toUpperCase && props.packetData[item]
                            ? props.previousPacketData[item].toUpperCase()
                            : (props.previousPacketData[item]? props.previousPacketData[item] : "")
                        }${itemDetails.suffix ? itemDetails.suffix : ""}`}</b>
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
