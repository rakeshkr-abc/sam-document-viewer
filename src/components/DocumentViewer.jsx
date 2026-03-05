import { useState, useCallback, useEffect } from 'react'

const DocumentViewer = () => {
  const [commSearch, setCommSearch] = useState('')
  const [techSearch, setTechSearch] = useState('')
  const [commSelected, setCommSelected] = useState('')
  const [techSelected, setTechSelected] = useState('')
  
  const [commFiles, setCommFiles] = useState([])
  const [techFiles, setTechFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api.json')
      .then(res => res.json())
      .then(data => {
        setCommFiles(data.communication.map(file => ({
          ...file,
          embedUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          candidateName: extractCandidateName(file.name)
        })))
        setTechFiles(data.technical.map(file => ({
          ...file,
          embedUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          candidateName: extractCandidateName(file.name)
        })))
        setLoading(false)
      })
      .catch(err => {
        console.error('JSON Error:', err)
        setLoading(false)
      })
  }, [])

  const extractCandidateName = (filename) => {
    const patterns = [
      /(.*?) Communication Round report\.pdf$/i,
      /(.*?) Coding Round.*report\.pdf$/i,
      /(.*?) Communication.*report\.pdf$/i,
      /(.*?) Technical.*report\.pdf$/i
    ]
    
    for (const pattern of patterns) {
      const match = filename.match(pattern)
      if (match) return match[1].trim()
    }
    
    return filename.split(' report')[0].split('.')[0].trim()
  }

  // ⭐ INDEPENDENT FILTERING - Only hide own section
  const filteredCommFiles = commFiles.filter(file => {
    // Hide only if Communication PDF selected
    if (commSelected) return false
    const search = commSearch.toLowerCase().trim()
    if (search.length < 2) return false
    
    const fullName = file.name.toLowerCase()
    const candidateName = file.candidateName.toLowerCase()
    
    return fullName.includes(search) || candidateName.includes(search)
  })

  const filteredTechFiles = techFiles.filter(file => {
    // Hide only if Technical PDF selected  
    if (techSelected) return false
    const search = techSearch.toLowerCase().trim()
    if (search.length < 2) return false
    
    const fullName = file.name.toLowerCase()
    const candidateName = file.candidateName.toLowerCase()
    
    return fullName.includes(search) || candidateName.includes(search)
  })

  const handleCommSelect = useCallback((file) => {
    setCommSearch('') // Clear only comm search
    setCommSelected(file.embedUrl)
  }, [])

  const handleTechSelect = useCallback((file) => {
    setTechSearch('') // Clear only tech search
    setTechSelected(file.embedUrl)
  }, [])

  const closeCommPDF = () => {
    setCommSelected('')
    setCommSearch('')
  }

  const closeTechPDF = () => {
    setTechSelected('')
    setTechSearch('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your PDFs...</div>
      </div>
    )
  }

  return (
    <div className="max-w mx-auto px-4 py-8 sm:px-6 lg:px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              Communication 
              <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {commSelected ? '📄 Open' : (commSearch.length >= 2 ? filteredCommFiles.length : 'Type to search...')}
              </span>
            </div>
            {commSelected && (
              <button
                onClick={closeCommPDF}
                className="text-orange-500 hover:text-orange-700 font-medium text-sm"
              >
                ✕ Close
              </button>
            )}
          </h2>
          
          <input
            placeholder={commSelected ? "PDF open - search hidden" : "Type few chars (Abhiram, Preethi...)"}
            className="w-full px-5 py-3 rounded-xl bg-white/50 border-2 border-orange-400/30 focus:border-orange-400 focus:ring-2 mb-6 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={commSearch}
            onChange={(e) => setCommSearch(e.target.value)}
            disabled={commSelected} // Only disable when comm PDF open
          />

          <div className="space-y-3 max-h-96 overflow-y-auto mb-8 scrollbar-thin scrollbar-thumb-gray-300">
            {commSelected ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-orange-50/50 to-white">
                <div className="text-2xl mb-4"></div>
                <div className="text-lg font-medium text-gray-600 mb-1">Communication PDF</div>
                <div className="text-sm">File list hidden</div>
              </div>
            ) : commSearch.length < 2 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                <div className="text-lg mb-2"> Start typing...</div>
                <div className="text-sm">Type few characters to search candidates</div>
                <div className="text-xs mt-2 text-gray-400">
                  Total: {commFiles.length} files
                </div>
              </div>
            ) : filteredCommFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                 No matches for "{commSearch}"
              </div>
            ) : (
              filteredCommFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-5 rounded-xl cursor-pointer hover:bg-orange-400/10 border-2 transition-all group ${
                    commSelected === file.embedUrl
                      ? 'border-orange-400 bg-orange-400/20 shadow-lg ring-2 ring-orange-400/50 scale-[1.02]'
                      : 'border-transparent hover:border-orange-400/50 hover:shadow-md'
                  }`}
                  onClick={() => handleCommSelect(file)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-bold text-lg text-gray-800 leading-tight mb-1 truncate">
                        {file.candidateName.replace(/%20/g, ' ')}
                      </div>
                      <div className="text-xs bg-orange-50 px-3 py-1 rounded-full border inline-block mb-2 max-w-max">
                        Communication Round
                      </div>
                      <div className="text-xs text-gray-500 truncate bg-gray-50 px-2 py-1 rounded">
                        {file.name.length > 60 
                          ? file.name.substring(0, 57) + '...' 
                          : file.name.replace(/%20/g, ' ')
                        }
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {commSelected && (
            <div className="pt-6 border-t border-gray-200">
              <iframe 
                src={commSelected} 
                className="w-full h-[1000px] rounded-xl shadow-2xl border-0" 
                title="Communication PDF"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Technical - INDEPENDENT */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
              Technical 
              <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {techSelected ? '📄 Open' : (techSearch.length >= 2 ? filteredTechFiles.length : 'Type to search...')}
              </span>
            </div>
            {techSelected && (
              <button
                onClick={closeTechPDF}
                className="text-blue-500 hover:text-blue-700 font-medium text-sm"
              >
                ✕ Close
              </button>
            )}
          </h2>
          
          <input
            placeholder={techSelected ? "PDF open - search hidden" : "Type few chars (Abhiram, Preethi...)"}
            className="w-full px-5 py-3 rounded-xl bg-white/50 border-2 border-blue-400/30 focus:border-blue-400 focus:ring-2 mb-6 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={techSearch}
            onChange={(e) => setTechSearch(e.target.value)}
            disabled={techSelected} // Only disable when tech PDF open
          />

          <div className="space-y-3 max-h-96 overflow-y-auto mb-8 scrollbar-thin scrollbar-thumb-gray-300">
            {techSelected ? (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-blue-50/50 to-white">
                <div className="text-2xl mb-4"></div>
                <div className="text-lg font-medium text-gray-600 mb-1">Technical PDF</div>
                <div className="text-sm">File list hidden</div>
              </div>
            ) : techSearch.length < 2 ? (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
                <div className="text-lg mb-2"> Start typing...</div>
                <div className="text-sm">Type few characters to search candidates</div>
                <div className="text-xs mt-2 text-gray-400">
                  Total: {techFiles.length} files
                </div>
              </div>
            ) : filteredTechFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                 No matches for "{techSearch}"
              </div>
            ) : (
              filteredTechFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-5 rounded-xl cursor-pointer hover:bg-blue-400/10 border-2 transition-all group ${
                    techSelected === file.embedUrl
                      ? 'border-blue-400 bg-blue-400/20 shadow-lg ring-2 ring-blue-400/50 scale-[1.02]'
                      : 'border-transparent hover:border-blue-400/50 hover:shadow-md'
                  }`}
                  onClick={() => handleTechSelect(file)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-bold text-lg text-gray-800 leading-tight mb-1 truncate">
                        {file.candidateName.replace(/%20/g, ' ')}
                      </div>
                      <div className="text-xs bg-blue-50 px-3 py-1 rounded-full border inline-block mb-2 max-w-max">
                        Coding Round
                      </div>
                      <div className="text-xs text-gray-500 truncate bg-gray-50 px-2 py-1 rounded">
                        {file.name.length > 60 
                          ? file.name.substring(0, 57) + '...' 
                          : file.name.replace(/%20/g, ' ')
                        }
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex-shrink-0 mt-1 shadow-lg group-hover:scale-110 transition-transform"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {techSelected && (
            <div className="pt-6 border-t border-gray-200">
              <iframe 
                src={techSelected} 
                className="w-full h-[1000px] rounded-xl shadow-2xl border-0" 
                title="Technical PDF"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer