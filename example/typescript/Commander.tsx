import React, { useEffect, useRef, useState } from 'react'
import { Commander, Column, PathInfo, FolderTableItem, TableItem, Info } from 'file-commander-control'
import compose from 'lodash/fp/compose'
import * as Array from './Array'

type DriveItem = {
    name: string,
    description: string,
    driveType: string,
    mountPoint: string,
    size: number,
    type: number,
    isDirectory: boolean,
    subPath: string,
    isNotSelectable: boolean
}

type FileItem = {
    name: string,
    time: string,
    exifDate?: string,
    size: number,
    isDirectory: boolean
    isParent: boolean
    isHidden: boolean,
    subPath: string,
    isNotSelectable: boolean
}

type ExifDate = {
    index: number
    name: string,
    exifDate: string
}

type NormalizedPath = {
    path: string,
}

type CommanderProps = {
    theme: string,
    showHidden: boolean
    isViewerVisible: boolean
    info: Info
    setInfo: (info: Info)=>void
}

const currentExifIds = new Map<number, number>()
var currentExifId = 0

const dateFormat = Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const timeFormat = Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
})

const getDateTime = (dateString: string) => {
    if (!dateString)
        return ''

    const date = new Date(dateString)
    return dateFormat.format(date) + " " + timeFormat.format(date)  
}

export const getItem = (info: Info) => {
    if (info.item) {
        if (info.path != "root") {
            const fileItem = info.item as FileItem
            return (info.path != "/" ? info.path + '/' : info.path) + fileItem.name
        }
        else
            return (info.item as DriveItem).mountPoint
    }
    else
        return ""
}

export const CommanderContainer = ({theme, showHidden, isViewerVisible, info, setInfo}: CommanderProps) => {

    const [refreshLeft, doRefreshLeft] = useState(false)
    const [refreshRight, doRefreshRight] = useState(false)

    const notFoundImgExts = useRef(new Set<string>())

    const itemRendererRoot = (item: TableItem) => {
        const tableItem = item as DriveItem
        return [
            <td key={1}>

                <svg preserveAspectRatio="xMidYMid meet" className="svg" viewBox="0 0 24 24">
                    <path className="svgPath" d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m6 2a6 6 0 0 0-6 6c0 3.31 2.69 6 6.1 6l-.88-2.23a1.01 1.01 0 0 1 .37-1.37l.86-.5a1.01 1.01 0 0 1 1.37.37l1.92 2.42A5.977 5.977 0 0 0 18 10a6 6 0 0 0-6-6m0 5a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m-5 9a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m5.09-4.73l2.49 6.31l2.59-1.5l-4.22-5.31l-.86.5z" />
                </svg>
                <span>{tableItem.name}</span>
            </td>,
            <td key={2}>{tableItem.description}</td>,
            <td key={3}>{tableItem.mountPoint}</td>,
            <td key={4} className='rightAligned'>{getSize(tableItem.size)}</td>,
            <td key={5}>{tableItem.driveType}</td>,
	    ]
    }

    const getExtension = (name: string) => {
        name = name || ""
        const parts = name.split('.')
        return Array.first(parts)
                ? Array.last(parts)
                : "" 
    }

    const onImgNotFound = (ext:string, evt: React.SyntheticEvent<HTMLImageElement>) => {
        notFoundImgExts.current.add(ext) 
        return evt.currentTarget.parentElement?.classList.add("defaultImg")
    }

    const isDefaultImg = (ext:string) => 
        ext 
            ? notFoundImgExts.current.has(ext) 
                ? "defaultImg"
                : ""
            : "defaultImg"

    const getImgUrl = (ext: string) => 
        isDefaultImg(ext)
        ? ""
        : `http://localhost:3333/geticon?ext=.${ext}`
    
    const itemRendererFiles = (item: TableItem) => {

        const getTimeClassName = () => [ 
                tableItem.isHidden ? "hidden" : null, 
                tableItem.exifDate ? "exif" : null
            ].filter(n => n).join(" ")

        const tableItem = item as FileItem
        const ext = getExtension(tableItem.name) || ""
        return [
            <td key={1} className={tableItem.isHidden ? "hidden" : ""}>
                { 
                tableItem.isDirectory ?
                    tableItem.isParent ?
                      <svg className="svg" viewBox="0 0 24 24">
                            <path className="svgPath" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                        </svg>
                    :
                        <svg className="svg" viewBox="0 0 1600 1600">
                            <path className="svgPath" d="M 233.82369,1371.7235 C 142.86653,1363.9041 76.893745,1273.6489 88.471385,1186.1738 88.725189,878.60148 86.478209,570.93784 90.1772,263.42085 103.1198,176.20618 192.96815,117.12319 279.57048,127.95809 c 94.86457,2.08486 190.64811,-5.67983 284.97182,4.30185 72.81507,15.81931 127.5668,84.58276 127.55779,157.93224 226.79955,0.66551 453.79181,-0.60344 680.47101,1.27009 89.0887,10.85174 153.416,98.45583 141.9829,185.1704 0.601,249.12184 1.1249,498.2542 -0.4428,747.37123 -5.107,90.6798 -96.2513,159.9695 -186.2129,148.1059 -364.68965,0.5778 -729.38836,1.0611 -1094.07461,-0.3863 z M 1361.5894,1263.2986 c 44.4976,-8.42 46.5224,-54.0812 43.4627,-88.8588 -0.7473,-245.14763 1.8126,-490.38804 -1.661,-735.46491 -10.2423,-42.2289 -54.8891,-42.78353 -89.3332,-40.24177 -357.21072,0 -714.42148,0 -1071.63223,0 -65.54009,18.1395 -38.72153,96.98298 -44.67661,145.98103 -0.071,225.23903 0.21972,450.47812 0.30847,675.71715 26.96503,71.7946 119.03872,34.6939 178.20156,44.0088 328.4356,-0.426 656.92461,1.5407 985.33031,-1.1415 z" />
                        </svg>                
                :
                    <span className={isDefaultImg(ext)}>
                        <svg className="svg svgFile" viewBox="0 0 24 24">
                            <path className="svgPath" d="M 14,2 H 6 C 4.9,2 4.01,2.9 4.01,4 L 4,20 c 0,1.1 0.89,2 1.99,2 H 18 c 1.1,0 2,-0.9 2,-2 V 8 Z m 4,18 H 6 V 4 h 7 v 5 h 5 z" />
                        </svg>                
                        <img className="image" src={getImgUrl(ext)} onError={evt => onImgNotFound(ext, evt)} ></img>
                    </span>
                }
                <span>{tableItem.name}</span>
            </td>,
            <td key={2} className={getTimeClassName()}>{getDateTime(tableItem.exifDate || tableItem.time)}</td>,
            <td key={3} className={tableItem.isHidden ? "hidden rightAligned" : "rightAligned"}>{getSize(tableItem.size)}</td>	
	    ]
    }

    const getSize = (size: number) => {
        if (!size)
            return ""
        let strNumber = `${size}`
        const thSep = '.'
        if (strNumber.length > 3) {
            var begriff = strNumber
            strNumber = ""
            for (var j = 3; j < begriff.length; j += 3) {
                var extract = begriff.slice(begriff.length - j, begriff.length - j + 3)
                strNumber = thSep + extract + strNumber
            }
            var strfirst = begriff.substr(0, (begriff.length % 3 == 0) ? 3 : (begriff.length % 3))
            strNumber = strfirst + strNumber
        }
        return strNumber
    }        

    const getPathInfo = async (path: string | null, newSubPath?: string) => {
        const oldPath = path
        path = path && (path != "/" || newSubPath != "..") ? path : "root"
        if (path != "root" || (newSubPath && newSubPath != "..")) {
            path = path.startsWith("/") && newSubPath ? path + '/' + newSubPath! : path
            path = path == "root" ? newSubPath! : path
            const resPath = await fetch(`http://localhost:3333/normalize?path=${path}`)
            path = (await resPath.json() as NormalizedPath).path
        }
        const pathInfo = { 
            type: path != "root" ?  "directory" : "root",
            columns: path != "root" 
            ? [
                { name: "Name", isSortable: true, subItem: "Erw."}, 
                { name: "Datum", isSortable: true },
                { name: "Größe", isSortable: true }
            ] as Column[]
            : [
                { name: "Name" }, 
                { name: "Beschreibung" }, 
                { name: "Mountpoint" }, 
                { name: "Größe" }, 
                { name: "Typ" } 
            ] as Column[],
            itemRenderer: path != "root" ? itemRendererFiles : itemRendererRoot,
            path 
        } 
        return [pathInfo, newSubPath == ".." ? Array.last(oldPath?.split('/')) : undefined] as [PathInfo, string?]
    }

    const sortByName = (a: FileItem, b: FileItem) => a.name.localeCompare(b.name)
    const sortByExtension = (a: FileItem, b: FileItem) => {
        const ae = getExtension(a.name) || ""
        const be = getExtension(b.name) || ""
        const res = ae.localeCompare(be)
        return res != 0 ? res : a.name.localeCompare(b.name)
    }
    const sortByDate = (a: FileItem, b: FileItem) => new Date(a.exifDate || a.time).getTime() - new Date(b.exifDate || b.time).getTime()
    const sortBySize = (a: FileItem, b: FileItem) => a.size - b.size

    const sortItems = (items: FileItem[], sortfunc: (a: FileItem, b: FileItem)=>number) => {
        const directories = items.filter(n => n.isDirectory).sort(sortByName)
        const files = items.filter(n => !n.isDirectory).sort(sortfunc)
        return [...directories, ...files]
    }

    const getExifDates = async (id: number, path: string, fileItems: FileItem[], updateItems: (updatedItems: FolderTableItem[])=>void) => {

        const currentId = ++currentExifId
        currentExifIds.set(id, currentId)
        const imgFiles = 
            fileItems
                .map((n, i) => ({index: i, name: n.name, isDirectory: n.isDirectory}))
                .filter(n => !n.isDirectory && getExtension(n.name)?.toLowerCase().endsWith('jpg'))
        const res = await fetch("http://localhost:3333/getExifDates", {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify({path, files: imgFiles})
        })

        let items = await res.json() as ExifDate[]
        if (items.length > 0 && currentExifIds.get(id) == currentId) {
            items.forEach(n => fileItems[n.index].exifDate = n.exifDate)
            updateItems([...fileItems])
        }
    }

    const getItems = async (id: number, pathInfo: PathInfo, updateItems: (updatedItems: FolderTableItem[])=>void, folderToSelect?: string) => {

        if (pathInfo.path == "root") {
            const res = await fetch(`http://localhost:3333/root`)
            const items =  await res.json() as DriveItem[]
            return [items.map(n => {
                n.isDirectory = true
                n.subPath = n.mountPoint
                n.isNotSelectable = true
                return n
            }), 0] as [FolderTableItem[], number]
        } else {
            const makeFileItem = (n: FileItem) => {
                n.subPath = n.name 
                return n
            } 

            const res = await fetch(`http://localhost:3333/getFiles?path=${pathInfo.path}`)
            let items = await res.json() as FileItem[]
            const parentItem = {
                name: "..",
                isDirectory: true,
                time: "",
                size: 0,
                isHidden: false,
                isParent: true,
                subPath: "..",
                isNotSelectable: true
            }
            
            if (!showHidden)
                items = items.filter(n => !n.isHidden)

            const result = sortItems([parentItem, ...items.map(makeFileItem)], sortByName)
            getExifDates(id, pathInfo.path, result, updateItems)
            const selectedIndex = folderToSelect ? result.findIndex(n => n.name == folderToSelect) : 0
            return [result, selectedIndex] as [FolderTableItem[], number]
        }
    }

    const sort = (items: FolderTableItem[], column: number, isDescending: boolean, isSubItem?: boolean) => {

        let sortfunc: (a: FileItem, b: FileItem)=>number = (a, b)=>0
        switch (column) {
            case 0: 
                sortfunc = 
                    isSubItem 
                        ? isDescending ? compose(n => -n, sortByExtension) : sortByExtension
                        : isDescending ? compose(n => -n, sortByName) : sortByName
                break
            case 1: 
                sortfunc = isDescending ? compose(n => -n, sortByDate) : sortByDate
                break
            case 2:
                sortfunc = isDescending ? compose(n => -n, sortBySize) : sortBySize
                break
        }
        return sortItems(items as FileItem[], sortfunc)
    }
    useEffect(() => {
        doRefreshLeft(!refreshLeft)
        doRefreshRight(!refreshRight)
    }, [showHidden])
         
    return <Commander namespace={"test-commander"} 
            theme={theme} getPathInfo={getPathInfo} getItems={getItems}
            refreshLeft={refreshLeft} refreshRight={refreshRight} sort={sort} isViewerVisible ={isViewerVisible} 
            info={info} setInfo={setInfo}/>
}

