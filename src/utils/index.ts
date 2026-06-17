export const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
