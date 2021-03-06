import React from 'react'
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
    onItemsChanged }: FolderTableProps) => {

    const onKeyDown = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 35 && evt.shiftKey) { // Shift + end
            items.items.forEach((item, i) => item.isSelected = i >= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 36 && evt.shiftKey) { // Shift + home
            items.items.forEach((item, i) => item.isSelected = i <= (items.currentIndex ?? 0)) 
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 45) { // Ins
            const item = items.items[items.currentIndex ?? 0]
            item.isSelected = !item.isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 107) { // Numlock +
            items.items.forEach(item => item.isSelected = true)
            onItemsChanged(folderItemsChanged(items))
        }
        if (evt.which == 109) { // Numlock -
            items.items.forEach(item => item.isSelected = false)
            onItemsChanged(folderItemsChanged(items))
        }
    }
    
    return (
        <div 
            onKeyDown={onKeyDown}
            className={styles.containerVirtualTable}>
            <Table 
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

// TODO textbox containing path, enter
// TODO path combine to set
// TODO Restriction
// TODO Grid splitter type script
// TODO two folder items
// TODO F3 viewer

// TODO in hyper rename fill directory items and drive items and icons


// TODO parent item not selectable: isSelectable property per folder item
// TODO Exif info in anoter style