import React, { useState, useRef } from 'react'
import { FolderTable, setFolderItems, folderItemsChanged } from 'file-commander-control'
import { VirtualTableItem, VirtualTableItems, Column, VirtualTable } from 'virtual-table-react'

interface FolderItem extends VirtualTableItem {
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

    const [items, setItems ] = useState(setFolderItems({
        count: 0, getItem: i => ({ index: 0 }) , itemRenderer: i=>[] 
    }) as VirtualTableItems)

    const folderItems = useRef([] as FolderItem[])
    const getFolderItem = (index: number) => folderItems.current[index]

    const onChange = () => {
        folderItems.current = Array.from(Array(6000).keys()).map(index => ({ col1: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setItems(setFolderItems({ 
            count: folderItems.current.length,
            getItem: getFolderItem,
            itemRenderer
        }))
    }

    const itemRenderer = (item: VirtualTableItem) => {
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
                onItemsChanged={setItems} /> 
        </div>
	)
}

