import * as React from "react";
import { observer, inject } from "mobx-react";
import { Header, Segment, Table, Icon, Button } from "semantic-ui-react";

@observer
class TableComponent extends React.Component {
    
    buildHeader = () => {
        let headers = ""

        this.props.headers.map((header, index) => {
            headers += <Table.HeaderCell>{header}</Table.HeaderCell>
        })

        return <Table.Header>
        <Table.Row>
            { headers }
        </Table.Row>
    </Table.Header>
    }

    buildRows = () => {
        let rows = ""

        this.props.rows.map((row, index) => {
            let cells = ""

            this.props.headers.map((header, index) => {
                console.log(row[header])
                cells += <Table.Cell>{ row[header] }</Table.Cell>
            })
            
            rows += <Table.Row>
                { cells }
            </Table.Row>
        })  

        return rows
    }
  
    render() {
        let headers = this.buildHeader()
        let rows =  this.buildRows() 

        return (
            <Table basic='very' celled collapsing selectable>
                { headers }            
                <Table.Body>
                    { rows }
                </Table.Body>
            </Table>
        );
    }
}

export default TableComponent;
