// General helpers that really shouldn't have their own files.

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

export const transformMedia = (src, width, height = width) =>
  src.replace(/([^\/]*)$/, `tr:w-${width},h-${height},fo-auto/$1`)
