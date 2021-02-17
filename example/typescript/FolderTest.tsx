import React, { useState } from 'react'
import { FolderTable  } from 'file-commander-control'
import { VirtualTableItem, VirtualTableItems, Column } from 'virtual-table-react'


interface FolderItem extends VirtualTableItem {
    index: number
    col1: string
    col2: string
    col3: string
}
type FolderTestProps = {
    theme: string
}
export const FolderTest = ({theme}: FolderTestProps) => {
    const [focused, setFocused] = useState(false)

    const onSetFocus = () => {
        setFocused(true)
    }   

    const [columns, setColumns] = useState([
        { name: "Eine Spalte", isSortable: true }, 
        { name: "Zweite. Spalte" }, 
        { name: "Letzte Spalte", isSortable: true }
    ] as Column[])

    const onColsChanged = (cols: Column[])=> {}
    const onSort = ()=> {}

    const [items, setItems ] = useState({items: [] as FolderItem[], itemRenderer: i=>[] } as VirtualTableItems)
    const onChange = () => {
        setItems({ 
            items: Array.from(Array(6000).keys()).map(index => ({ col1: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem)),
            itemRenderer
        })
    }

    const changeItem = (index: number, item: FolderItem) => {
        const newItems = [...items.items]
        newItems[index] = item
        return { itemRenderer: items.itemRenderer, items: newItems }
    }

    const onSelection = (index: number, isSelected: boolean)=> {
        var newItem = items.items[index] as FolderItem
        newItem.isSelected = isSelected
        setItems(changeItem(index, newItem)) 
    }

    const itemRenderer = (item: VirtualTableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.col1}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    return (	
        <div className={"folderTest"}>
            <button onClick={onChange}>Fill</button>
            <button onClick={onSetFocus}>Set Focus</button>
            <FolderTable 
                theme={theme} 
                focused={focused} 
                setFocused={setFocused} 
                columns={columns} 
                onColumnsChanged={onColsChanged} 
                onSort={onSort}
                items={items}
                onSelection={onSelection} /> 
        </div>
	)
}
// TODO itemsChanged not resetting Position and CurrentItem, but adjusting them (Math.min)
// TODO itemsChanged: new items: first set new items count 0 then new items 