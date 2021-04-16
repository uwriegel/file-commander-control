import React, { useLayoutEffect, useState} from 'react'
import { FolderTest } from './FolderTest'
import 'file-commander-control/dist/index.css'
import 'grid-splitter-react/dist/index.css'
import { CommanderTest } from './CommanderTest'
import { CommanderContainer, getItem } from './Commander'
import { Info } from 'file-commander-control'

const App = () => {
    const [appChoice, setAppChoice] = useState(0)
    const [theme, setTheme] = useState("")

    const onAppChange = (evt: React.ChangeEvent<HTMLSelectElement>) => setAppChoice(evt.target.selectedIndex)
    const onThemeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        switch (evt.target.selectedIndex) {
            case 0:
                changeTheme("adwaita")
                break
            case 1:
                changeTheme("adwaitadark")
                break
            case 2:
                changeTheme("blue")
                break
            case 3:
                changeTheme("yaru")
                break
            case 4:
                changeTheme("yarudark")
                break
        }
    }

    const changeTheme = (theme: string) => {
        const styleSheet = document.getElementById("theme")  
        const head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'theme'
        link.type = 'text/css'
        link.href = `themes/${theme}.css`
        link.media = 'all'
        head.appendChild(link)
        if (styleSheet)
            styleSheet.remove()
        setTheme(theme)
    }

    useLayoutEffect(() => {
        changeTheme("adwaita")
    }, [])

    const [showHidden, setShowHidden] = useState(false)
    const onShowHiddenChanged = (evt: React.ChangeEvent<HTMLInputElement>) => 
        setShowHidden(evt.target.checked)

    const [isViewerVisible, setIsViewerVisible] = useState(false)
    const onShowViewerChanged = (evt: React.ChangeEvent<HTMLInputElement>) => 
        setIsViewerVisible(evt.target.checked)

    const [info, setInfo] = useState({path:"", numberOfSelectedItems: 0, numberOfItems: 0} as Info)

    const getCount = (info: Info) => {
        const count = info.path != "root"
        ? info.numberOfItems - 1
        : info.numberOfItems
        return count == 1 ? "1 Eintrag" : `${count} Einträge`
    }

    const getCounts = (info: Info) => 
        info.numberOfSelectedItems
        ? `${info.numberOfSelectedItems} selektiert/${getCount(info)}`
        : `${getCount(info)}`
                    
    return (	
		<div>
			<div>
				<select onChange={onAppChange}>
                    <option>Commander</option>
					<option>Folder</option>
                    <option>CommanderTest</option>
				</select>
				<select onChange={onThemeChange}>
                    <option>Adwaita</option>
                    <option>Adwaita dark</option>
                    <option>Blue</option>
                    <option>Yaru</option>
                    <option>Yaru dark</option>
				</select>
                <input type="checkbox" name="showHidden" id="showHidden" onChange={onShowHiddenChanged} />
                <label htmlFor="showHidden" >Show hidden</label>
                <input type="checkbox" name="showViewer" id="showHidden" onChange={onShowViewerChanged} />
                <label htmlFor="showViewer" >Show Viewer</label>
			</div>
			{appChoice == 0 
				? <CommanderContainer theme={theme} showHidden={showHidden} isViewerVisible={isViewerVisible}
                    info={info} setInfo={setInfo} /> 
				: appChoice == 1 
                    ? <FolderTest theme={theme} />
                    : <CommanderTest theme={theme} />
            }
            <div className={"status"}>
                <div>{getItem(info)}</div>
                <div>{getCounts(info)}</div>
            </div>
		</div>  
	)
}

export default App
