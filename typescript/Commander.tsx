import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable, setFolderItems, folderItemsChanged, FolderTableItem, FolderTableItems } from './FolderTable'
import { Column, TableItem } from 'virtual-table-react'

export type PathInfo = {
    type: string, 
    columns: Column[],
    path: string,
    itemRenderer: (item: TableItem)=>JSX.Element[]
}

type CommanderProps = {
    namespace: string,
    theme: string,
    getPathInfo: (path: string | null)=>Promise<PathInfo>
    getItems: (pathInfo: PathInfo)=>Promise<FolderTableItem[]>,
}

export const Commander = ({namespace, theme, getPathInfo, getItems}: CommanderProps) => {
// ============================== States =======================================

    const [focusedLeft, setFocusedLeft] = useState(false)
    const [focusedRight, setFocusedRight] = useState(false)
    const setFocusLeft = () => {
        setFocusedRight(false)
        setFocusedLeft(true)
    }   
    const setFocusRight = () => {
        setFocusedLeft(false)
        setFocusedRight(true)
    }   
    const setFocus = (folderId: 1|2) => folderId == 1 ? setFocusLeft() : setFocusRight()

    const [columnsLeft, setColumnsLeft] = useState([{ name: "Name" } ] as Column[])
    const [columnsRight, setColumnsRight] = useState([{ name: "Name" } ] as Column[])

    const [pathLeft, setPathLeft] = useState("")
    const [pathRight, setPathRight] = useState("")
    const pathInfoLeft = useRef<PathInfo>()
    const pathInfoRight = useRef<PathInfo>()
    const getColumnsWithWidths = (type: string, folder: string, columns: Column[]) => {
        const cached = localStorage.getItem(`${namespace}-${type}-${folder}-columnWiths`)        
        const widths = cached ? JSON.parse(cached) as number[] : null
        return widths 
            ? columns.map((n, i) => ({
                columnsSort: n.columnsSort,
                isSortable: n.isSortable,
                name: n.name,
                subItem: n.subItem,
                subItemSort: n.subItemSort,
                width: widths[i]
            }))
            : columns
    }

    const setPathInfoLeft = (pathInfo: PathInfo) => {
        pathInfoLeft.current = pathInfo
        setPathLeft(pathInfo.path)
        setColumnsLeft(getColumnsWithWidths(pathInfo.type, "left", pathInfo.columns))
    }
    const setPathInfoRight = (pathInfo: PathInfo) => {
        pathInfoRight.current = pathInfo
        setPathRight(pathInfo.path)
        setColumnsRight(getColumnsWithWidths(pathInfo.type, "right", pathInfo.columns))
    }
    const setPathInfo = (folderId: 1|2) => folderId == 1 ? setPathInfoLeft : setPathInfoRight
    const getItemRendererLeft = () => pathInfoLeft.current ? pathInfoLeft.current.itemRenderer : (item: TableItem) => ([] as JSX.Element[])
    const getItemRendererRight = () => pathInfoRight.current ? pathInfoRight.current.itemRenderer : (item: TableItem) => ([] as JSX.Element[])
    const getItemRenderer = (folderId: 1|2) => folderId == 1 ? getItemRendererLeft() : getItemRendererRight()

    const [itemsLeft, setItemsLeft ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const [itemsRight, setItemsRight ] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    const setItems = (folderId: 1|2) => folderId == 1 ? setItemsLeft : setItemsRight

    const onPathChangedLeft = (path: string) =>  onChange(1, path)
    const onPathChangedRight = (path: string) => onChange(2, path)

    const onColsChangedLeft = (cols: Column[])=> {
        localStorage.setItem(`${namespace}-${pathInfoLeft.current?.type}-left-columnWiths`, JSON.stringify(cols.map(n => n.width)))
        setColumnsLeft(cols)
    }
    const onColsChangedRight = (cols: Column[])=> {
        localStorage.setItem(`${namespace}-${pathInfoRight.current?.type}-right-columnWiths`, JSON.stringify(cols.map(n => n.width)))
        setColumnsRight(cols)
    }
    const onSortLeft = ()=> {}
    const onSortRight = ()=> {}

// ============================== States =======================================

    const onChange = async (folderId: 1|2, path: string | null) => {
        const pathInfo = await getPathInfo(path)
        setPathInfo (folderId) (pathInfo)
        const folderItems = await getItems(pathInfo)
        setItems (folderId) (setFolderItems({ items: folderItems}))
        setFocus (folderId)
    }

    useEffect(() => {
        const initialize = async () => {
            await onChange (1, null)
            await onChange (2, null)
            setFocus(1)
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
                        itemRenderer={getItemRenderer (1)}
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
                        itemRenderer={getItemRenderer (2)}
                        onItemsChanged={setItemsRight}
                        path={pathRight}
                        onPathChanged={onPathChangedRight}
                        onEnter={onEnter} /> 
                )} 
            />
        </div>
    )
}

// TODO enter to change path
// TODO ParentItem
// TODO Sorting
// TODO changePath when editing path field to the same value
// TODO TAB to change Focus

// TODO Status with item and # items/# of selected items

// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in another style