/**
 * transfer.js
 * This script allows the exporting and subsequent importing of QuACS semester plan data
 *
 * @license MIT
 * @version 1.0
 * @author  Arthur Neuman, https://github.com/exoRift
 * @updated 2023-07-12
 * @link    https://github.com/exoRift/quacs-scripts
 */

console.log('QuACS Transfer by Arthur Neuman (https://github.com/exoRift)')
const decision = prompt('Do you want to export or import? (E / I)').toUpperCase()

if (decision === 'E') {
  // Generation
  const storage = {}
  for (const key of Object.keys(localStorage)) storage[key] = localStorage.getItem(key)

  const blob = new Blob([JSON.stringify(storage)], {
    type: 'application/json'
  })
  const url = window.URL.createObjectURL(blob)

  // Download
  const phantom = document.createElement('a')
  phantom.style.display = 'none'
  phantom.href = url
  phantom.download = 'quacs.json'

  document.body.append(phantom)
  phantom.click()
  
  console.log('Successfully downloaded data!')

  // Cleanup
  window.URL.revokeObjectURL(url)

  phantom.remove()
} else {
  const reader = new FileReader()

  // Load data
  const mountData = () => {
    const data = JSON.parse(reader.result)

    if (!data) throw Error('Invalid data fle provided')

    for (const key of Object.keys(data)) localStorage.setItem(key, data[key])

    console.log('Successfully loaded data!')
    window.location.reload()
  }
  const handleReadError = () => console.error('Failed to read the provided file')

  const processUpload = (e) => {
    const [file] = e.target.files

    reader.readAsText(file)

    // Cleanup
    e.target.remove()
  }

  reader.addEventListener('load', mountData, { once: true })
  reader.addEventListener('error', handleReadError, { once: true })

  // Upload
  const phantom = document.createElement('input')
  phantom.style.display = 'none'
  phantom.type = 'file'
  phantom.addEventListener('change', processUpload, { once: true })

  document.body.append(phantom)
  phantom.click()
}
