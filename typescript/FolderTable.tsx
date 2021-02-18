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
        if (evt.which == 45) {
            items.items[items.currentIndex ?? 0].isSelected = !items.items[items.currentIndex ?? 0].isSelected
            items.currentIndex = (items.currentIndex ?? 0) + 1
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


