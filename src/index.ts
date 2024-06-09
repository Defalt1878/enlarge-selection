import { isHotkey } from 'is-hotkey'
import { handleEnlargeSelection } from './selectionHandler'

const isEnlargeHotkey = isHotkey('alt+w')

document.body.addEventListener('keydown', event => {
  if (isEnlargeHotkey(event)) {
    console.debug('enlargeHotkeyDetected')
    handleEnlargeSelection()
  }
})

console.debug('Text enlarger initialized')
