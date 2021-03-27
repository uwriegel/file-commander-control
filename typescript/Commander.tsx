import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable, setFolderItems, folderItemsChanged, FolderTableItem, FolderTableItems } from './FolderTable'
import { Column, TableItem } from 'virtual-table-react'

type PathInfo = {
    columns: Column[]
}

type CommanderProps = {
    theme: string,
    getPathInfo: (path: string)=>PathInfo
    getItems: (pathInfo: PathInfo)=>Promise<FolderTableItem[]>,
    itemRenderer: (item: TableItem)=>JSX.Element[]
}

export const Commander = ({theme, getPathInfo, getItems, itemRenderer}: CommanderProps) => {
// ============================== States =======================================

    const [focusedLeft, setFocusedLeft] = useState(false)
    const [focusedRight, setFocusedRight] = useState(false)

    const [pathLeft, setPathLeft] = useState("")
    const [pathRight, setPathRight] = useState("")
    const setPath = (folderId: 1|2) => folderId == 1 ? setPathLeft : setPathRight

    const [columnsLeft, setColumnsLeft] = useState([{ name: "Name" } ] as Column[])
    const [columnsRight, setColumnsRight] = useState([{ name: "Name" } ] as Column[])
    const setColumns = (folderId: 1|2) => folderId == 1 ? setColumnsLeft : setColumnsRight

    const [itemsLeft, setItemsLeft ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const [itemsRight, setItemsRight ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const setItems = (folderId: 1|2) => folderId == 1 ? setItemsLeft : setItemsRight

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

    const onChange = async (folderId: 1|2) => {
        const pathInfo = getPathInfo("/home/uwe/documents")
        setPath (folderId) ("")
        setColumns (folderId) (pathInfo.columns)
        const folderItems = await getItems(pathInfo)

        setPath (folderId) ("/home/uwe/documents")
        setItems (folderId) (setFolderItems({ items: folderItems}))
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
                        itemRenderer={itemRenderer}
                        onItemsChanged={setItemsLeft}
                        path={pathLeft}
                        onPathChanged={onPathChangedLeft}
                        onEnter={onEnter} /> 
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
                        itemRenderer={itemRenderer}
                        onItemsChanged={setItemsRight}
                        path={pathRight}
                        onPathChanged={onPathChangedRight}
                        onEnter={onEnter} /> 
                )} 
            />
        </div>
    )
}