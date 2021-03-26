import React, { useLayoutEffect, useState} from 'react'
import { FolderTest } from './FolderTest'
import 'file-commander-control/dist/index.css'
import 'grid-splitter-react/dist/index.css'
import { CommanderTest } from './CommanderTest'
import { CommanderContainer } from './Commander'

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

    return (	
		<div>
			<div>
				<select onChange={onAppChange}>
					<option>Folder</option>
                    <option>CommanderTest</option>
                    <option>Commander</option>
				</select>
				<select onChange={onThemeChange}>
                    <option>Adwaita</option>
                    <option>Adwaita dark</option>
                    <option>Blue</option>
                    <option>Yaru</option>
                    <option>Yaru dark</option>
				</select>
			</div>
			{appChoice == 0 
				? <FolderTest theme={theme} /> 
				: appChoice == 1 
                    ? <CommanderTest theme={theme} />
                    : <CommanderContainer theme={theme} />
            }
		</div>  
	)
}

export default App
