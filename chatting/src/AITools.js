import { schoolDB } from './assets/school_DB.js'

const AITool = {
  // ✅ Student Functions
  getStudentInformationByName(studentName) {
    if (!studentName) return null
    const student = schoolDB.students.find(
      s => s.name.toLowerCase().includes(studentName.toLowerCase())
    )
    if (!student) return null

    // Auto-generate info string
    return `Name: ${student.name}, Class ID: ${student.class_id}, Subjects Enrolled: ${student.subjects_enrolled?.join(', ') || 'N/A'}`
  },

  getStudentInformationById(studentId) {
    if (!studentId) return null
    const id = Number(studentId)
    const student = schoolDB.students.find(s => Number(s.student_id) === id)
    if (!student) return null

    // Auto info generation
    return `Name: ${student.name}, Class ID: ${student.class_id}, Subjects Enrolled: ${student.subjects_enrolled?.join(', ') || 'N/A'}`
  },

  getStudentSubjectsById(studentId) {
    if (!studentId) return null
    const id = Number(studentId)
    const student = schoolDB.students.find(s => Number(s.student_id) === id)
    return student ? student.subjects_enrolled : null
  },

  getStudentsByClassName(className) {
    if (!className) return null
    const students = schoolDB.students.filter(
      s => s.class?.toLowerCase() === className.toLowerCase()
    )
    return students.length
      ? students.map(
          s =>
            `Name: ${s.name}, Class ID: ${s.class_id}, Subjects: ${s.subjects_enrolled?.join(', ') || 'N/A'}`
        )
      : null
  },

  getStudentsByClassId(classId) {
    if (!classId) return null
    const id = Number(classId)
    const students = schoolDB.students.filter(s => Number(s.class_id) === id)
    return students.length
      ? students.map(
          s =>
            `Name: ${s.name}, Class ID: ${s.class_id}, Subjects: ${s.subjects_enrolled?.join(', ') || 'N/A'}`
        )
      : null
  },

  // ✅ Teacher Functions
  getTeacherInformationByName(name) {
    if (!name) return null
    const teacher = schoolDB.teachers.find(t =>
      t.name.toLowerCase().includes(name.toLowerCase())
    )
    if (!teacher) return null
    return `Name: ${teacher.name}, Subjects: ${teacher.subjects?.join(', ') || 'N/A'}`
  },

  getTeachersInformationById(subjectId) {
    if (!subjectId) return null
    const id = Number(subjectId)
    const teachers = schoolDB.teachers.filter(t => t.subjects.includes(id))
    return teachers.length
      ? teachers.map(
          t => `Name: ${t.name}, Subjects: ${t.subjects?.join(', ') || 'N/A'}`
        )
      : null
  },

  getTeacherSubjectsById(teacherId) {
    if (!teacherId) return null
    const id = Number(teacherId)
    const teacher = schoolDB.teachers.find(t => Number(t.teacher_id) === id)
    return teacher ? teacher.subjects : null
  },

  // ✅ Employee Functions
  getEmployeesInformationByName(name) {
    if (!name) return null
    const employees = schoolDB.employees.filter(e =>
      e.name.toLowerCase().includes(name.toLowerCase())
    )
    return employees.length
      ? employees.map(
          e => `Name: ${e.name}, Role: ${e.role}, ID: ${e.employee_id}`
        )
      : null
  },

  getEmployeesInformationById(employeeId) {
    if (!employeeId) return null
    const id = Number(employeeId)
    const employee = schoolDB.employees.find(e => Number(e.employee_id) === id)
    return employee
      ? `Name: ${employee.name}, Role: ${employee.role}, ID: ${employee.employee_id}`
      : null
  },

  getEmployeesByRole(role) {
    if (!role) return null
    const employees = schoolDB.employees.filter(
      e => e.role.toLowerCase() === role.toLowerCase()
    )
    return employees.length
      ? employees.map(
          e => `Name: ${e.name}, Role: ${e.role}, ID: ${e.employee_id}`
        )
      : null
  },

  // ✅ Subject Functions
  getSubjectByStudentId(studentId) {
    if (!studentId) return null
    const id = Number(studentId)
    const student = schoolDB.students.find(s => Number(s.student_id) === id)
    return student ? student.subjects_enrolled : null
  },

  getSubjectByStudentName(studentName) {
    if (!studentName) return null
    const student = schoolDB.students.find(s =>
      s.name.toLowerCase().includes(studentName.toLowerCase())
    )
    return student ? student.subjects_enrolled : null
  },

  getSubjectByTeacherId(teacherId) {
    if (!teacherId) return null
    const id = Number(teacherId)
    const teacher = schoolDB.teachers.find(t => Number(t.teacher_id) === id)
    return teacher ? teacher.subjects : null
  },

  getSubjectByTeacherName(teacherName) {
    if (!teacherName) return null
    const teacher = schoolDB.teachers.find(t =>
      t.name.toLowerCase().includes(teacherName.toLowerCase())
    )
    return teacher ? teacher.subjects : null
  },

  getSubjectByClassId(classId) {
    if (!classId) return null
    const id = Number(classId)
    const students = schoolDB.students.filter(s => Number(s.class_id) === id)
    return students.length ? students.flatMap(s => s.subjects_enrolled) : null
  },

  // ✅ Attendance Functions
  getAttendanceByDate(date) {
    if (!date) return null
    const attendanceRecords = schoolDB.attendance.filter(a => a.date === date)
    return attendanceRecords.length ? attendanceRecords : null
  },

  getStudentAttendance(studentId) {
    if (!studentId) return null
    const id = Number(studentId)
    const attendanceRecords = schoolDB.attendance.filter(
      a => Number(a.student_id) === id
    )
    return attendanceRecords.length ? attendanceRecords : null
  },

  getTeacherAttendance(teacherId) {
    if (!teacherId) return null
    const id = Number(teacherId)
    const attendanceRecords = schoolDB.attendance.filter(
      a => Number(a.teacher_id) === id
    )
    return attendanceRecords.length ? attendanceRecords : null
  },

  getEmployeeAttendance(employeeId) {
    if (!employeeId) return null
    const id = Number(employeeId)
    const attendanceRecords = schoolDB.attendance.filter(
      a => Number(a.employee_id) === id
    )
    return attendanceRecords.length ? attendanceRecords : null
  }
}

// ✅ tools list
export const toolsList = Object.keys(AITool).map(name => ({
  name,
  func: AITool[name],
  description: name.replace(/([A-Z])/g, ' $1').trim()
}))

export default AITool
