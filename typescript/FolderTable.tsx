import React from 'react'
import 'virtual-table-react/dist/index.css'
import { Column, VirtualTable, VirtualTableItems, setVirtualTableItems, VirtualTableItem } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'

export const setFolderItems = setVirtualTableItems

export const changeFolderItem = (items: VirtualTableItems, index: number, item: VirtualTableItem) => {
    const newItems = [...items.items]
    newItems[index] = item
    return { itemRenderer: items.itemRenderer, items: newItems, currentIndex: items.currentIndex }
}

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

    const onKeyDown = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 35 && evt.shiftKey) { // Shift + end
            items.items = items.items.map((n, i) => { 
                n.isSelected = i >= (items.currentIndex ?? 0) 
                return n
            }) 
            onItemsChanged(setVirtualTableItems(items))
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            items.items = items.items.map((n, i) => { 
                n.isSelected = i <= (items.currentIndex ?? 0) 
                return n
            }) 
            onItemsChanged(setVirtualTableItems(items))
        }
        if (evt.which == 45) { // Ins
            items.items[items.currentIndex ?? 0].isSelected = !items.items[items.currentIndex ?? 0].isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(setVirtualTableItems(items))
        }
        if (evt.which == 107) { // Numlock +
            items.items = items.items.map(n => { 
                n.isSelected = true 
                return n
            }) 
            onItemsChanged(setVirtualTableItems(items))
        }
        if (evt.which == 109) { // Numlock -
            items.items = items.items.map(n => { 
                n.isSelected = false 
                return n
            }) 
            onItemsChanged(setVirtualTableItems(items))
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
// TODO Restriction
// TODO Grid splitter type script
// TODO two folder items
// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in anoter style