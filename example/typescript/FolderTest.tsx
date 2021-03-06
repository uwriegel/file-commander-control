import React, { useState, useRef } from 'react'
import { FolderTable, setFolderItems, folderItemsChanged } from 'file-commander-control'
import { TableItem, TableItems, Column, Table } from 'virtual-table-react'

interface FolderItem extends TableItem {
    index: number
    col1: string
    col2: string
    col3: string
}
type FolderTestProps = {
    theme: string
}
export const FolderTest = ({theme}: FolderTestProps) => {
    const [focused, setFocused] = useState(false)

    const onSetFocus = () => {
        setFocused(true)
    }   

    const [columns, setColumns] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const [items, setItems ] = useState(setFolderItems({ items: [] }) as TableItems)

    const onChange = () => {
        const folderItems = Array.from(Array(6000).keys()).map(index => ({ col1: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setItems(setFolderItems({ items: folderItems}))
    }

    const itemRenderer = (item: TableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.col1}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    return (	
        <div className={"folderTest"}>
            <button onClick={onChange}>Fill</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <FolderTable 
                theme={theme} 
                focused={focused} 
                setFocused={setFocused} 
                columns={columns} 
                onColumnsChanged={onColsChanged} 
                onSort={onSort}
                items={items}
                itemRenderer={itemRenderer}
                onItemsChanged={setItems} /> 
        </div>
	)
}

