export const getRandomNumber = max => Math.floor(Math.random() * Math.floor(max))

export const upperCaseFirstLetter = str => str.replace(/\b\w/g, l => l.toUpperCase())

export const isAllElemsOfArrayEqual = array => array.every(e => e === array[0])

export const shuffleArray = array => array.map(x => [Math.random(), x]).sort(([a], [b]) => a - b).map(([_, x]) => x)