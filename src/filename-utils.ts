import * as _ from "lodash"
import * as path from "path"

/**
 * Shortens the length of a directory in a pretty way.
 * @param pathName The path to shorten
 * @param maxLength The maximum length of the path. Must be at least 4.
 * @returns The shortened directory name.
 */
export function getPrettyPathName(pathName: string, maxLength: number): string {
  if (maxLength < 4) {
    throw Error("maxLength must be at least 4")
  }
  if (pathName.length <= maxLength) {
    return pathName
  }

  const parts = path.parse(pathName)

  const dirWithoutRoot = parts.dir.slice(parts.root.length, parts.dir.length - parts.root.length + 1)
  const dirs = dirWithoutRoot.split(path.sep)
  const root = `${parts.root}..${path.sep}`

  // Save the first directory, we want to try and prioritize keeping it in the path.
  let firstDir = dirs.shift()
  firstDir = firstDir ? firstDir : ""

  while (dirs.length > 0) {
    // Except for the first directory, start removing dirs from left to right.
    dirs.shift()
    const middle = ["..", ...dirs].join(path.sep)
    const newPath = `${parts.root}${firstDir}${path.sep}${middle}${path.sep}${parts.base}`
    if (newPath.length <= maxLength) {
      return newPath
    }
  }

  const rootAndName = `..${path.sep}${parts.base}`
  if (rootAndName.length <= maxLength) {
    return rootAndName
  }
  return `${rootAndName.slice(0, maxLength - 2)}..`
}

/**
 * Escapes the characters |()[]#*{}-+_!\,`> from a string.
 * @param source The source to escape
 * @returns An escaped version of the string
 */
export function escapeMarkdownCharacters(source: string) {
  const escapedCharacters = ["|", "(", ")", "[", "]", "#", "*", "{", "}", "-", "+", "_", "!", "\\", "`"]
  return [...source].map(c => (_.includes(escapedCharacters, c) ? `\\${c}` : c)).join("")
}