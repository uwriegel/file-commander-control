import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable, setFolderItems, folderItemsChanged, FolderTableItem, FolderTableItems } from './FolderTable'
import { Column, TableItem } from 'virtual-table-react'

export type PathInfo = {
    columns: Column[],
    path: string
}

type CommanderProps = {
    theme: string,
    getPathInfo: (path: string | null)=>PathInfo
    getItems: (pathInfo: PathInfo)=>Promise<FolderTableItem[]>,
    itemRenderer: (item: TableItem)=>JSX.Element[]
}

export const Commander = ({theme, getPathInfo, getItems, itemRenderer}: CommanderProps) => {
// ============================== States =======================================

    const [focusedLeft, setFocusedLeft] = useState(false)
    const [focusedRight, setFocusedRight] = useState(false)

    const [columnsLeft, setColumnsLeft] = useState([{ name: "Name" } ] as Column[])
    const [columnsRight, setColumnsRight] = useState([{ name: "Name" } ] as Column[])

    const [pathLeft, setPathLeft] = useState("")
    const [pathRight, setPathRight] = useState("")
    const pathInfoLeft = useRef<PathInfo>()
    const pathInfoRight = useRef<PathInfo>()
    const setPathInfoLeft = (pathInfo: PathInfo) => {
        pathInfoLeft.current = pathInfo
        setPathLeft(pathInfo.path)
        setColumnsLeft(pathInfo.columns)
    }
    const setPathInfoRight = (pathInfo: PathInfo) => {
        pathInfoRight.current = pathInfo
        setPathRight(pathInfo.path)
        setColumnsRight(pathInfo.columns)
    }
    const setPathInfo = (folderId: 1|2) => folderId == 1 ? setPathInfoLeft : setPathInfoRight

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

    const onPathChangedLeft = (path: string) =>  onChange(1, path)
    const onPathChangedRight = (path: string) => onChange(2, path)

    const onColsChangedLeft = (cols: Column[])=> {}
    const onColsChangedRight = (cols: Column[])=> {}
    const onSortLeft = ()=> {}
    const onSortRight = ()=> {}

// ============================== States =======================================

    const onChange = async (folderId: 1|2, path: string | null) => {
        const pathInfo = getPathInfo(path)
        setPathInfo (folderId) (pathInfo)
        const folderItems = await getItems(pathInfo)
        setItems (folderId) (setFolderItems({ items: folderItems}))
    }

    useEffect(() => {
        const initialize = async () => {
            await onChange (1, null)
            await onChange (2, null)
            setFocusedLeft(true)
        }
        initialize()
    }, [])

    const activeFolder = useRef<1|2>(1)
    useLayoutEffect(() => {
        if (focusedLeft)
            activeFolder.current = 1
        else if (focusedRight)
            activeFolder.current = 2
    }, [focusedLeft, focusedRight])

    const onEnter = (items: FolderTableItem[]) => {
        console.log("Enter", items)
    }

    return (	
        <div className={"commander"}>
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
// TODO changePath when editing path field
// TODO getPathInfo with recent pathInfo
// TODO ParentItem
// TODO TAB to change Focus