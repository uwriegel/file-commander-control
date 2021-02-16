import React, { useEffect, useState } from 'react'
import 'virtual-table-react/dist/index.css'
import { Column, VirtualTable, VirtualTableItems } from 'virtual-table-react'

// @ts-ignore
import styles from './styles.module.css'

type FolderTableProps = {
    theme?: string
    focused: boolean
    setFocused: (val: boolean)=>void
    columns: Column[]
    onColumnsChanged: (cols: Column[])=> {}
    onSort: ()=> {}
    items: VirtualTableItems
}

export const FolderTable = ({theme, focused, setFocused, columns, onColumnsChanged, onSort, items}: FolderTableProps) => {

    const onKeyDown = (sevt: React.KeyboardEvent) => {
        const evt = sevt.nativeEvent
        if (evt.which == 45) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <div 
            onKeyDown={onKeyDown}
            className={styles.containerVirtualTable}>
            <VirtualTable 
                columns={columns} 
                onColumnsChanged={onColumnsChanged} 
                onSort={onSort} items={items} 
                itemRenderer={items.itemRenderer}
                theme={theme}
                focused={focused}
                onFocused={setFocused}
                currentIndex={currentIndex}
                onCurrentIndexChanged={setCurrentIndex} />
        </div>
    )
}


