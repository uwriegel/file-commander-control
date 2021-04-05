import React, { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import 'virtual-table-react/dist/index.css'
import { Column, Table, TableItems, setTableItems, TableItem } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'
// @ts-ignore
import restrictTransition from './transition.restrict.module.css'

export interface FolderTableItem extends TableItem {
    subPath: string
    isDirectory: boolean
    isNotSelectable?: boolean
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
    onPathChanged: (path: string)=>void,
    onEnter: (items: FolderTableItem[])=>void
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
    onPathChanged,
    onEnter
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

    const getSelectedItems = () => {
        const selectedItems = displayItems.items.filter(n => n.isSelected)
        return selectedItems.length > 0 
            ? selectedItems 
            : [ displayItems.items[displayItems.currentIndex || 0] ]
    }

    const pathInput = useRef<HTMLInputElement>(null)        

    const onKeyDown = (sevt: React.KeyboardEvent) => {

        const evt = sevt.nativeEvent
        if (evt.which == 8) { // backspace
            if (originalItems.current) {
                const newRestrictValue = restrictValue.substr(0, restrictValue.length - 1)
                if (newRestrictValue.length == 0) 
                    restrictClose()            
                else
                    restrictTo(newRestrictValue)
                sevt.stopPropagation()
                sevt.preventDefault()
                return true
            }
        }  
        if (evt.which == 9 && evt.shiftKey) { // Shift + tab
            pathInput.current?.focus()
            sevt.stopPropagation()
            sevt.preventDefault()
            return true
        }
        if (evt.which == 13) {
            const items = getSelectedItems()
            if (items)
                onEnter(items)
            return true
        }
        if (evt.which == 35 && evt.shiftKey) { // Shift + end
            displayItems.items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i >= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(displayItems))
            return true
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            displayItems.items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i <= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(displayItems))
            return true
        }
        if (evt.which == 45) { // Ins
            const item = displayItems.items[items.currentIndex ?? 0]
            item.isSelected = !item.isNotSelectable && !item.isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(items)
            onItemsChanged(folderItemsChanged(displayItems))
            return true
        }
        if (evt.which == 107) { // Numlock +
            displayItems.items.forEach(item => item.isSelected = !item.isNotSelectable)
            onItemsChanged(folderItemsChanged(displayItems))
            return true
        }
        if (evt.which == 109) { // Numlock -
            displayItems.items.forEach(item => item.isSelected = false)
            onItemsChanged(folderItemsChanged(displayItems))
            return true
        }
        if (!evt.altKey && !evt.ctrlKey && evt.key.length > 0 && evt.key.length < 2) {
            const newValue = restrictValue + evt.key
            restrictTo(newValue)
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

    const restrictTo = (newValue: string) => {
        const itemsToSearch = originalItems.current || displayItems
        const filteredItems = itemsToSearch.items.filter(n => n.subPath.toLocaleLowerCase().startsWith(newValue))
        if (filteredItems.length) {
            setRestrictValue(newValue)
            if (restrictValue.length == 0)  
                originalItems.current = items
            setDisplayItems(setFolderItems({
                items: filteredItems,
                currentIndex: 0
            }))
        }
    }

    const restrictClose = () => {
        setRestrictValue("")
        if (originalItems.current) {
            setDisplayItems(originalItems.current)
            onItemsChanged(originalItems.current!)
            originalItems.current = undefined
        }
    }

    const onFolderItemsChanged = (items: TableItems) => {
        const folderItems = items as FolderTableItems
        setDisplayItems(folderItems)
        onItemsChanged(folderItems)
    }

    const onDoubleClick = (sevt: React.MouseEvent) => {
        const items = getSelectedItems()
        if (items)
            onEnter(items)
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
                onFocused={setFocused}
                onDoubleClick={onDoubleClick} />
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

// TODO: currentindex when restricting is not 0!