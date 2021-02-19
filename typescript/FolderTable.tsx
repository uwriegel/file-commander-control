import React from 'react'
import 'virtual-table-react/dist/index.css'
import { Column, VirtualTable, VirtualTableItems, setVirtualTableItems, VirtualTableItem } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'

export const setFolderItems = setVirtualTableItems

export const folderItemsChanged = (items: VirtualTableItems) => setFolderItems({ 
    count: items.count,
    getItem: items.getItem,
    itemRenderer: items.itemRenderer, 
    currentIndex: items.currentIndex 
})

export type FolderTableProps = {
    theme?: string
    focused: boolean
    setFocused: (val: boolean)=>void
    columns: Column[]
    onColumnsChanged: (cols: Column[])=>void
    onSort: (index: number, descending: boolean, isSubItem?: boolean)=>void
    items: VirtualTableItems
    onItemsChanged: (items: VirtualTableItems)=>void
}

export const FolderTable = ({
    theme, 
    focused, 
    setFocused, 
    columns, 
    onColumnsChanged, 
    onSort, 
    items, 
    onItemsChanged }: FolderTableProps) => {

    const performEachItem = (perform: (item: VirtualTableItem, index: number)=>void) => {
        [...Array(items.count).keys()].forEach(n => {
            const item = items.getItem(n)
            perform(item, n)
        })
    }

    const onKeyDown = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 35 && evt.shiftKey) { // Shift + end
            performEachItem((item, i) => item.isSelected = i >= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            performEachItem((item, i) => item.isSelected = i <= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 45) { // Ins
            const item = items.getItem(items.currentIndex ?? 0)
            item.isSelected = !item.isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 107) { // Numlock +
            performEachItem(item => item.isSelected = true)
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 109) { // Numlock -
            performEachItem(item => item.isSelected = false)
            onItemsChanged(folderItemsChanged(items))
        }
    }
    return (
        <div 
            onKeyDown={onKeyDown}
            className={styles.containerVirtualTable}>
            <VirtualTable 
                columns={columns} 
                onColumnsChanged={onColumnsChanged} 
                onSort={onSort} 
                items={items}
                onItemsChanged={onItemsChanged} 
                theme={theme}
                focused={focused}
                onFocused={setFocused} />
        </div>
    )
}

// TODO textbox containing path, enter
// TODO path combine to set
// TODO Restriction
// TODO Grid splitter type script
// TODO two folder items
// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in anoter style