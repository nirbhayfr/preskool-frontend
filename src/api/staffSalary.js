import api from './api'

export const getStaffSalaries = async () => {
  const { data } = await api.get('/staff-salary')
  return data
}

export const getStaffSalaryListById = async (id) => {
  const { data } = await api.get(`/staff-salary/${id}`)
  return data.data
}

export const bulkMarkStaffSalaryPaid = async (staffIds) => {
  const { data } = await api.post('/staff-salary/bulk-mark-paid', {
    staffIds,
  })
  return data
}

export const createStaffSalary = async (payload) => {
  const { data } = await api.post('/staff-salary', payload)
  return data
}

export const updateStaffSalary = async ({ id, payload }) => {
  const { data } = await api.put(`/staff-salary/${id}`, payload)
  return data
}

export const deleteStaffSalary = async (id) => {
  const { data } = await api.delete(`/staff-salary/${id}`)
  return data
}
export const getStaffSalaryByStaffId = async (staffId) => {
  const response = await api.get(`/staff-salary/staff/${staffId}`)
  return response.data
}
