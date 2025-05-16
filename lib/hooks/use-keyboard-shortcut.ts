import { useEffect } from "react"

type ShortcutCallback = () => void

export function useKeyboardShortcut(
  keys: string[],
  callback: ShortcutCallback
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const keyCombo = keys
        .map((k) => k.toLowerCase())
        .sort()
        .join("+")
      const pressedKeys = []

      if (e.ctrlKey) pressedKeys.push("control")
      if (e.metaKey) pressedKeys.push("control")
      if (e.altKey) pressedKeys.push("alt")
      if (e.shiftKey) pressedKeys.push("shift")

      if (!["control", "meta", "alt", "shift"].includes(e.key.toLowerCase())) {
        pressedKeys.push(e.key.toLowerCase())
      }

      const currentCombo = pressedKeys.sort().join("+")

      console.log(currentCombo, keyCombo)

      if (currentCombo === keyCombo) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [keys, callback])
}
