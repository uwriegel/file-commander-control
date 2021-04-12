import React, { useState, useRef } from 'react'
import { FolderTable } from 'file-commander-control'
import { TableItem, Column, Table } from 'virtual-table-react'
import { FolderTableItem } from '../../dist/FolderTable'

interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}
type FolderTestProps = {
    theme: string
}
export const FolderTest = ({theme}: FolderTestProps) => {
    const [focused, setFocused] = useState(false)
    const [path, setPath] = useState("")

    const onSetFocus = () => {
        setFocused(true)
    }   

    const onPathChanged = (path: string) => {
        alert(path)
        onChange()
    }

    const [columns, setColumns] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const [items, setItems ] = useState([] as FolderTableItem[])
    const [currentIndex, setCurrentIndex ] = useState(0)

    const onChange = () => {
        setPath("/home/uwe/documents")
        const folderItems = Array.from(Array(6000).keys()).map(index => ({ subPath: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setItems(folderItems)
    }

    const onEnter = (items: FolderTableItem[]) => {
        console.log("Enter", items)
    }

    const itemRenderer = (item: TableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.subPath}</td>,
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
                onItemsChanged={setItems}
                itemRenderer={itemRenderer}
                currentIndex={currentIndex}
                onCurrentIndexChanged={setCurrentIndex}
                path={path}
                onPathChanged={onPathChanged}
                onEnter={onEnter} /> 
        </div>
	)
}

