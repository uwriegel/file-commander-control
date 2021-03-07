import React, { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import 'virtual-table-react/dist/index.css'
import { Column, Table, TableItems, setTableItems, TableItem } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import restrictTransition from './transition.restrict.module.css'

export interface FolderTableItem extends TableItem {
//    index: number
    name: string
}

export interface FolderTableItems extends TableItems {
    items: FolderTableItem[]
}

export const setFolderItems = (items: FolderTableItems) => setTableItems(items) as FolderTableItems

export const folderItemsChanged = (items: FolderTableItems) => setFolderItems({ 
    items: items.items,
    currentIndex: items.currentIndex 
})

export type FolderTableProps = {
    theme?: string
    focused: boolean
    setFocused: (val: boolean)=>void
    columns: Column[]
    onColumnsChanged: (cols: Column[])=>void
    onSort: (index: number, descending: boolean, isSubItem?: boolean)=>void
    items: FolderTableItems
    itemRenderer: (item: TableItem)=>JSX.Element[]
    onItemsChanged: (items: FolderTableItems)=>void
    path: string
    onPathChanged: (path: string)=>void
}

export const FolderTable = ({
    theme, 
    focused, 
    setFocused, 
    columns, 
    onColumnsChanged, 
    onSort, 
    items, 
    itemRenderer,
    onItemsChanged,
    path,
    onPathChanged 
}: FolderTableProps) => {

    const [pathText, setPathText] = useState("")
    const [restrictValue, setRestrictValue] = useState<string>("")
    const onInputChange = (sevt: ChangeEvent<HTMLInputElement>) => setPathText(sevt.currentTarget.value)
    useLayoutEffect(() => {
        restrictClose()
        setPathText(path)
    }, [path])

    const [displayItems, setDisplayItems] = useState(setFolderItems({ items: [] }) as FolderTableItems)
    useLayoutEffect(() => setDisplayItems(items), [items])
    const originalItems = useRef<FolderTableItems>()

    const pathInput = useRef<HTMLInputElement>(null)        

    const onKeyDown = (sevt: React.KeyboardEvent) => {

        const evt = sevt.nativeEvent
        if (evt.which == 9 && evt.shiftKey) { // Shift + tab
            pathInput.current?.focus()
            sevt.stopPropagation()
            sevt.preventDefault()
            return true
        }
        if (evt.which == 35 && evt.shiftKey) { // Shift + end
            displayItems.items.forEach((item, i) => item.isSelected = i >= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            displayItems.items.forEach((item, i) => item.isSelected = i <= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 45) { // Ins
            const item = displayItems.items[items.currentIndex ?? 0]
            item.isSelected = !item.isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 107) { // Numlock +
            displayItems.items.forEach(item => item.isSelected = true)
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 109) { // Numlock -
            displayItems.items.forEach(item => item.isSelected = false)
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (!evt.altKey && !evt.ctrlKey && evt.key.length > 0 && evt.key.length < 2) {
            restrictTo(evt.key)
            return true
        }
        if (evt.which == 27) { // esc
            restrictClose()
            return true
        }
        return false
    }

    const onPathInput = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 9) { // tab
            setFocused(true)
            sevt.stopPropagation()
            sevt.preventDefault()
        }
        if (evt.which == 13)  // enter
            onPathChanged(pathInput.current?.value || "")
    }
    
    const onInputFocus = () => {
        pathInput.current?.select()
    }

    const restrictTo = (val: string) => {
        const newValue = restrictValue + val
        const filteredItems = displayItems.items.filter(n => n.name.toLocaleLowerCase().startsWith(newValue))
        if (filteredItems.length) {
            setRestrictValue(newValue)
            if (restrictValue.length == 0)  
                originalItems.current = items
            setDisplayItems(setFolderItems({
                items: filteredItems,
                currentIndex: displayItems.currentIndex
            }))
        }
    }

    const restrictClose = () => {
        setRestrictValue("")
        if (originalItems.current) {
            setDisplayItems(originalItems.current)
            originalItems.current = undefined
        }
    }

    const onFolderItemsChanged = (items: TableItems) => {
        const folderItems = items as FolderTableItems
        setDisplayItems(folderItems)
        onItemsChanged(folderItems)
    }

    return (
        <div className={styles.containerVirtualTable}>
            <input ref={pathInput} className={styles.pathInput} 
                value={pathText}
                onChange={onInputChange}
                onKeyDown={onPathInput}
                onFocus={onInputFocus}></input>
            <Table 
                onKeyDown={onKeyDown}
                columns={columns} 
                onColumnsChanged={onColumnsChanged} 
                onSort={onSort} 
                items={displayItems}
                itemRenderer={itemRenderer}
                onItemsChanged={onFolderItemsChanged} 
                theme={theme}
                focused={focused}
                onFocused={setFocused} />
            <CSSTransition
                in={restrictValue.length > 0}
                timeout={400}
                classNames={restrictTransition}
                unmountOnExit>
               <input className={styles.restrictor} disabled value={restrictValue} />                
            </CSSTransition>
        </div>
    )
}

// TODO Restriction: adapt indexes, adapt current index
// TODO Restriction: backspace
// TODO Enter on FolderTable -> callback onenter in Folder Test changeItems  A N D  changePath > restrictClose

// TODO Grid splitter type script

// TODO two folder items

// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in another style