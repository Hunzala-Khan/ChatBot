import { schoolDB } from './assets/school_DB.js';
const AITool = {
  getStudentInformationByName(studentName) {
    const student = schoolDB.students.find(s => s.name.toLowerCase().includes(studentName.toLowerCase()));
    return student ? student.info : null;
  },
  getStudentInformationById(studentId) {
    const student = schoolDB.students.find(s => s.student_id === studentId);
    return student ? student.info : null;
  },
  getStudentSubjectsById(studentId) {
    const student = schoolDB.students.find(s => s.student_id === studentId);
    return student ? student.subjects : null;
  },
  getStudentsByClassName(className) {
    const students = schoolDB.students.filter(s => s.class.toLowerCase() === className.toLowerCase());
    return students.length ? students.map(s => s.info) : null;
  },
  getStudentsByClassId(classId) {
    const students = schoolDB.students.filter(s => s.class_id === classId);
    return students.length ? students.map(s => s.info) : null;
  },

  getTeacherInformationByName(name) {
    const teacher = schoolDB.teachers.find(t => t.name.toLowerCase().includes(name.toLowerCase()));
    return teacher ? teacher.info : null;
  },
  getTeachersInformationById(subjectId) {
    const teachers = schoolDB.teachers.filter(t => t.subjects.includes(subjectId));
    return teachers.length ? teachers.map(t => t.info) : null;
  },
  getTeacherSubjectsById(teacherId) {
    const teacher = schoolDB.teachers.find(t => t.teacher_id === teacherId);
    return teacher ? teacher.subjects : null;
  },
  
  getEmployeesInformationByName(name) {
    const employees = schoolDB.employees.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
    return employees.length ? employees.map(e => e.info) : null;
  },
  getEmployeesInformationById(employeeId) {
    const employee = schoolDB.employees.find(e => e.employee_id === employeeId);
    return employee ? employee.info : null;
  },
  getEmployeesByRole(role) {
    const employees = schoolDB.employees.filter(e => e.role.toLowerCase() === role.toLowerCase());
    return employees.length ? employees.map(e => e.info) : null;
  },

  getSubjectByStudentId(studentId) {
    const student = schoolDB.students.find(s => s.student_id === studentId);
    return student ? student.subjects : null;
  },
  getSubjectByStudentName(studentName) {
    const student = schoolDB.students.find(s => s.name.toLowerCase().includes(studentName.toLowerCase()));
    return student ? student.subjects : null;
  },  

getSubjectByTeacherId(teacherId) {
  const teacher = schoolDB.teachers.find(t => t.teacher_id === teacherId);
  return teacher ? teacher.subjects : null;
},
getSubjectByTeacherName(teacherName) {
  const teacher = schoolDB.teachers.find(t => t.name.toLowerCase().includes(teacherName.toLowerCase()));
  return teacher ? teacher.subjects : null;
},

  getSubjectByClassId(classId) {
    const students = schoolDB.students.filter(s => s.class_id === classId);
    return students.length ? students.flatMap(s => s.subjects) : null;
  },

  getAttendanceByDate(date) {
    const attendanceRecords = schoolDB.attendance.filter(a => a.date === date);
    return attendanceRecords.length ? attendanceRecords : null;
  },
  getStudentAttendance(studentId) {
    const attendanceRecords = schoolDB.attendance.filter(a => a.student_id === studentId);
    return attendanceRecords.length ? attendanceRecords : null;
  },
  getTeacherAttendance(teacherId) {
    const attendanceRecords = schoolDB.attendance.filter(a => a.teacher_id === teacherId);
    return attendanceRecords.length ? attendanceRecords : null;
  },
  getEmployeeAttendance(employeeId) {
    const attendanceRecords = schoolDB.attendance.filter(a => a.employee_id === employeeId);
    return attendanceRecords.length ? attendanceRecords : null;
  }

};

export const toolsList = [{ description: "Get Student Information by Name", func: AITool.getStudentInformationByName, name: "getStudentInformationByName" },
                           { description: "Get Student Information by ID", func: AITool.getStudentInformationById, name: "getStudentInformationById" }
                          ,{ description: "Get Student Subjects by ID", func: AITool.getStudentSubjectsById, name: "getStudentSubjectsById" }
                          ,{ description: "Get Students by Class Name", func: AITool.getStudentsByClassName, name: "getStudentsByClassName" }
                          ,{ description: "Get Students by Class ID", func: AITool.getStudentsByClassId, name: "getStudentsByClassId" }
                          ,{ description: "Get Teacher Information by Name", func: AITool.getTeacherInformationByName, name: "getTeacherInformationByName" }
                          ,{ description: "Get Teachers Information by ID", func: AITool.getTeachersInformationById, name: "getTeachersInformationById" }
                          ,{ description: "Get Teacher Subjects by ID", func: AITool.getTeacherSubjectsById, name: "getTeacherSubjectsById" }
                          ,{ description: "Get Employees Information by Name", func: AITool.getEmployeesInformationByName, name: "getEmployeesInformationByName" }
                          ,{ description: "Get Employees Information by ID", func: AITool.getEmployeesInformationById, name: "getEmployeesInformationById" }
                          ,{ description: "Get Employees by Role", func: AITool.getEmployeesByRole, name: "getEmployeesByRole" }
                          ,{ description: "Get Subject by Student ID", func: AITool.getSubjectByStudentId, name: "getSubjectByStudentId" }
                          ,{ description: "Get Subject by Student Name", func: AITool.getSubjectByStudentName, name: "getSubjectByStudentName" }
                          ,{ description: "Get Subject by Teacher ID", func: AITool.getSubjectByTeacherId, name: "getSubjectByTeacherId" }
                          ,{ description: "Get Subject by Teacher Name", func: AITool.getSubjectByTeacherName, name: "getSubjectByTeacherName" }
                          ,{ description: "Get Subject by Class ID", func: AITool.getSubjectByClassId, name: "getSubjectByClassId" }
                          ,{ description: "Get Attendance by Date", func: AITool.getAttendanceByDate, name: "getAttendanceByDate" }
                          ,{ description: "Get Student Attendance by ID", func: AITool.getStudentAttendance, name: "getStudentAttendance" }
                          ,{ description: "Get Teacher Attendance by ID", func: AITool.getTeacherAttendance, name: "getTeacherAttendance" }
                          ,{ description: "Get Employee Attendance by ID", func: AITool.getEmployeeAttendance, name: "getEmployeeAttendance" }
                         ];
// ✅ yahan ensure karo ke export default sirf AITool hi kare
export default AITool
