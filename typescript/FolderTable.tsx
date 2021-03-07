import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import 'virtual-table-react/dist/index.css'
import { Column, Table, TableItems, setTableItems, TableItem } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'

export const setFolderItems = setTableItems

export const folderItemsChanged = (items: TableItems) => setFolderItems({ 
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
    items: TableItems
    itemRenderer: (item: TableItem)=>JSX.Element[]
    onItemsChanged: (items: TableItems)=>void
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
    useEffect(() => setPathText(path), [path])

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
            items.items.forEach((item, i) => item.isSelected = i >= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            items.items.forEach((item, i) => item.isSelected = i <= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 45) { // Ins
            const item = items.items[items.currentIndex ?? 0]
            item.isSelected = !item.isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 107) { // Numlock +
            items.items.forEach(item => item.isSelected = true)
            onItemsChanged(folderItemsChanged(items))
            return true
        }
        if (evt.which == 109) { // Numlock -
            items.items.forEach(item => item.isSelected = false)
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

    const restrictTo = (val: string) => setRestrictValue(restrictValue + val)

    const restrictClose = () => setRestrictValue("")

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
                items={items}
                itemRenderer={itemRenderer}
                onItemsChanged={onItemsChanged} 
                theme={theme}
                focused={focused}
                onFocused={setFocused} />
        </div>
    )
}

// TODO Restriction

// TODO Grid splitter type script

// TODO two folder items

// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in another style