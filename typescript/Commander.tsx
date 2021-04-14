import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import _ from 'lodash'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTable, FolderTableItem } from './FolderTable'
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
    getPathInfo: (path: string | null, newSubPath: string | undefined)=>Promise<[PathInfo, string?]>
    getItems: (id: number, pathInfo: PathInfo, updateItems: (updatedItems: FolderTableItem[])=>void, folderToSelect?: string)=>Promise<[FolderTableItem[], number]>,
    refreshLeft: boolean,
    refreshRight: boolean,
    sort: (items: FolderTableItem[], column: number, isDescending: boolean, isSubItem?: boolean) => FolderTableItem[]
    isViewerVisible: boolean
}

export const Commander = ({
        namespace, theme, getPathInfo, getItems, refreshLeft, refreshRight, sort, isViewerVisible
    }: CommanderProps) => {
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
    const getPath = (folderId: 1|2) => folderId == 1 ? pathLeft : pathRight

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

    const getItemRendererLeft = () => pathInfoLeft.current ? pathInfoLeft.current.itemRenderer : (item: TableItem) => ([] as JSX.Element[])
    const getItemRendererRight = () => pathInfoRight.current ? pathInfoRight.current.itemRenderer : (item: TableItem) => ([] as JSX.Element[])
    const getItemRenderer = (folderId: 1|2) => folderId == 1 ? getItemRendererLeft() : getItemRendererRight()

    const [itemsLeft, setItemsLeft ] = useState([] as FolderTableItem[])
    const [itemsRight, setItemsRight ] = useState([] as FolderTableItem[])
    const setItems = (folderId: 1|2) => folderId == 1 ? setItemsLeft : setItemsRight
    const items = (folderId: 1|2) => folderId == 1 ? itemsLeft : itemsRight

    const [currentIndexLeft, setCurrentIndexLeft ] = useState(0)
    const [currentIndexRight, setCurrentIndexRight ] = useState(0)
    const setCurrentIndex = (folderId: 1|2) => folderId == 1 ? setCurrentIndexLeft : setCurrentIndexRight
    const currentIndex = (folderId: 1|2) => folderId == 1 ? currentIndexLeft : currentIndexRight

    const onPathChangedLeft = (path: string) =>  onChange(1, path)
    const onPathChangedRight = (path: string) => onChange(2, path)

// ============================== States =======================================

    const onChange = async (folderId: 1|2, path: string | null, newSubPath?: string) => {
        const [pathInfo, folderToSelect] = await getPathInfo(path, newSubPath)
        setItems (folderId) ([])
        setPathInfo (folderId) (pathInfo)
        const [folderItems, indexToSelect] = await getItems(folderId, pathInfo, getUpdateItems(folderId), folderToSelect)
        setItems (folderId) (folderItems) 
        setCurrentIndex (folderId) (indexToSelect)
        setFocus (folderId)
    }

    const updateItems = (folderId: 1|2, updatedItems: FolderTableItem[]) => setItems (folderId) (updatedItems)

    const getUpdateItems = (folderId: 1|2) => 
        _.partial(updateItems, folderId)
    

    const onColsChangedLeft = (cols: Column[])=> {
        localStorage.setItem(`${namespace}-${pathInfoLeft.current?.type}-left-columnWiths`, JSON.stringify(cols.map(n => n.width)))
        setColumnsLeft(cols)
    }
    const onColsChangedRight = (cols: Column[])=> {
        localStorage.setItem(`${namespace}-${pathInfoRight.current?.type}-right-columnWiths`, JSON.stringify(cols.map(n => n.width)))
        setColumnsRight(cols)
    }
    const onSort = (folderId: 1|2, column: number, isDescending: boolean, isSubItem?: boolean) => {
        const selectedItem = items(folderId) [currentIndex(folderId)]
        const sortedItems = sort(items(folderId), column, isDescending, isSubItem)
        const selectedIndex = sortedItems.findIndex(n => n == selectedItem)
        setItems (folderId) (sortedItems)
        setCurrentIndex(folderId)(selectedIndex)
    }

    const onEnter = async (folderId: (1|2), items: FolderTableItem[]) => {
        if (items.length == 1 && items[0].isDirectory) 
            await onChange(folderId, getPath(folderId), items[0].subPath)
    }

    const onKeyDown = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 9) { // tab
            const iaf = getInactiveFolder()
            setFocus(iaf)            
            sevt.stopPropagation()
            sevt.preventDefault()
        }
    }

    const activeFolder = useRef<1|2>(1)
    const getInactiveFolder = () => activeFolder.current == 1 ? 2 : 1
    useLayoutEffect(() => {
        if (focusedLeft)
            activeFolder.current = 1
        else if (focusedRight)
            activeFolder.current = 2
    }, [focusedLeft, focusedRight])

    useEffect(() => {
        onChange(1, pathInfoLeft.current?.path!)
    }, [refreshLeft])
    useEffect(() => {
        onChange(2, pathInfoRight.current?.path!)
    }, [refreshRight])
    
    useEffect(() => {
        const initialize = async () => {
            await onChange (1, null)
            await onChange (2, null)
            setFocus(1)
        }
        initialize()
    }, [])

    return (	
        <div className={"commander"} onKeyDown={onKeyDown}>
            <SplitterGrid isVertical={true} isSecondInvisible={!isViewerVisible}
                first = {(
                    <SplitterGrid 
                        first={(
                            <FolderTable 
                                theme={theme} 
                                focused={focusedLeft} 
                                setFocused={setFocusedLeft} 
                                columns={columnsLeft} 
                                onColumnsChanged={onColsChangedLeft} 
                                onSort={(col, isDesc, isSub) => onSort(1, col, isDesc, isSub)}
                                items={itemsLeft}
                                onItemsChanged={setItemsLeft}
                                itemRenderer={getItemRenderer (1)}
                                currentIndex={currentIndexLeft}
                                onCurrentIndexChanged={setCurrentIndexLeft}
                                path={pathLeft}
                                onPathChanged={onPathChangedLeft}
                                onEnter={items => onEnter(1, items)} /> 
                        )} 
                        second={(
                            <FolderTable 
                                theme={theme} 
                                focused={focusedRight} 
                                setFocused={setFocusedRight} 
                                columns={columnsRight} 
                                onColumnsChanged={onColsChangedRight} 
                                onSort={(col, isDesc, isSub) => onSort(2, col, isDesc, isSub)}
                                items={itemsRight}
                                onItemsChanged={setItemsRight}
                                itemRenderer={getItemRenderer (2)}
                                currentIndex={currentIndexRight}
                                onCurrentIndexChanged={setCurrentIndexRight}
                                path={pathRight}
                                onPathChanged={onPathChangedRight}
                                onEnter={items => onEnter(2, items)} /> 
                        )} 
                    />
                )} 
                second = {(
                    <div />
                )}
            />
        </div>
    )
}

// TODO VirtualTableReact: adapt VirtualTable to Table
// TODO F3 viewer: OnGridChanged: resize VirtualTables
// TODO F3 viewer
// TODO Status only in app! with item and # items/# of selected items 
