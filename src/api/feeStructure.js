import api from './api'

// Create Fee Structure
export const createFeeStructure = async (data) => {
  const response = await api.post('/fee-structure', data)
  return response.data
}

// Get all Fee Structures
export const getAllFeeStructures = async () => {
  const response = await api.get('/fee-structure')
  return response.data
}

// Get Fee Structure by Class and Academic Year
export const getFeeStructureByClass = async ({ classId, academicYear }) => {
  const response = await api.get(
    `/fee-structure/by-class?className=${classId}&academicYear=${academicYear}`
  )
  return response.data
}

// Update Fee Structure
export const updateFeeStructure = async (id, data) => {
  const response = await api.put(`/fee-structure/${id}`, data)
  return response.data
}

// Delete Fee Structure
export const deleteFeeStructure = async (id) => {
  const response = await api.delete(`/fee-structure/${id}`)
  return response.data
}
