import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable } from 'file-commander-control'
import { FolderTableItem } from '../../dist/FolderTable'
import { Column, TableItem } from 'virtual-table-react'

interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}

type CommanderTestProps = {
    theme: string
}

export const CommanderTest = ({theme}: CommanderTestProps) => {
// ============================== States =======================================

    const [focusedLeft, setFocusedLeft] = useState(false)
    const [focusedRight, setFocusedRight] = useState(false)

    const [pathLeft, setPathLeft] = useState("")
    const [pathRight, setPathRight] = useState("")
    const setPath = (folderId: 1|2) => folderId == 1 ? setPathLeft : setPathRight

    const [columnsLeft, setColumnsLeft] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])
    const [columnsRight, setColumnsRight] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const [itemsLeft, setItemsLeft ] = useState([] as FolderTableItem[])
    const [itemsRight, setItemsRight ] = useState([] as FolderTableItem[])
    const setItems = (folderId: 1|2) => folderId == 1 ? setItemsLeft : setItemsRight

    const [currentIndexLeft, setCurrentIndexLeft ] = useState(0)
    const [currentIndexRight, setCurrentIndexRight ] = useState(0)
    const setCurrentIndex = (folderId: 1|2) => folderId == 1 ? setCurrentIndexLeft : setCurrentIndexRight

    const onSetFocusLeft = () => {
        setFocusedLeft(true)
        setFocusedRight(false)
    }   
    const onSetFocusRight = () => {
        setFocusedLeft(false)
        setFocusedRight(true)
    }   

    const onPathChangedLeft = (path: string) => {
        alert(path)
        onChange(1)
    }
    const onPathChangedRight = (path: string) => {
        alert(path)
        onChange(2)
    }

    const onColsChangedLeft = (cols: Column[])=> {}
    const onColsChangedRight = (cols: Column[])=> {}
    const onSortLeft = ()=> {}
    const onSortRight = ()=> {}

// ============================== States =======================================

    const onChange = (folderId: 1|2) => {
        setPath (folderId) ("/home/uwe/documents")
        const folderItems = Array.from(Array(6000).keys()).map(index => ({ subPath: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setItems (folderId) (folderItems)
    }

    useEffect(() => setFocusedLeft(true), [])
    const activeFolder = useRef<1|2>(1)
    useLayoutEffect(() => {
        if (focusedLeft)
            activeFolder.current = 1
        else if (focusedRight)
            activeFolder.current = 2
    }, [focusedLeft, focusedRight])

    const onChangeActive = () => onChange(activeFolder.current)

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
        <div className={"commander"}>
            <button onClick={onChangeActive}>Fill</button>
            <button onClick={onSetFocusLeft}>Set Focus</button>
            <SplitterGrid 
                first={(
                    <FolderTable 
                        theme={theme} 
                        focused={focusedLeft} 
                        setFocused={setFocusedLeft} 
                        columns={columnsLeft} 
                        onColumnsChanged={onColsChangedLeft} 
                        onSort={onSortLeft}
                        items={itemsLeft}
                        onItemsChanged={setItemsLeft}
                        itemRenderer={itemRenderer}
                        currentIndex={currentIndexLeft}
                        onCurrentIndexChanged={setCurrentIndexLeft}
                        path={pathLeft}
                        onPathChanged={onPathChangedLeft}
                        onEnter={onEnter}
                        heightChanged={0} /> 
                )} 
                second={(
                    <FolderTable 
                        theme={theme} 
                        focused={focusedRight} 
                        setFocused={setFocusedRight} 
                        columns={columnsRight} 
                        onColumnsChanged={onColsChangedRight} 
                        onSort={onSortRight}
                        items={itemsRight}
                        onItemsChanged={setItemsRight}
                        itemRenderer={itemRenderer}
                        currentIndex={currentIndexRight}
                        onCurrentIndexChanged={setCurrentIndexRight}
                        path={pathRight}
                        onPathChanged={onPathChangedRight}
                        onEnter={onEnter}
                        heightChanged={0} /> 
                )} 
            />
        </div>
    )
}