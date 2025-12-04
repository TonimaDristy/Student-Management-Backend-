import { Controller, Post, Body, Get, Param, Patch, Put, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { StudentService } from './student.service';
import { UserDto } from './student.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';


@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    // Register / Create Student
    @Post('create')
    createStudent(@Body() student: UserDto) {
        return this.studentService.registerUser(student);
    }


    //// Login Student////
    @Post('login')
    async loginStudent(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.studentService.validateStudent(email, password);
    }






    // Update Status
    @Patch('status/:id')
    changeStatus(@Param('id') id: number, @Body('status') status: string) {
        return this.studentService.updateStatus(id, status);
    }

    // Get Inactive Students
    @Get('inactive')
    findInactive() {
        return this.studentService.getInactiveStudents();
    }

    // Get Students Older Than 40
    @Get('older40')
    findOlderThan40() {
        return this.studentService.getStudentsOver40();
    }

    // Get Student by ID
    @Get(':id')
    getStudentById(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.getStudentById(id);
    }

    // Update Student
    @Put('update/:id')
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() updatedData: Partial<UserDto>) {
        return this.studentService.updateStudent(id, updatedData);
    }

    // Delete Student
    @Delete('delete/:id')
    deleteStudent(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.deleteStudent(id);
    }

    // Get Students by Department
    @Get('department/:dept')
    getByDepartment(@Param('dept') dept: string) {
        return this.studentService.getStudentsByDepartment(dept);
    }





    // ----------course------------


    @Post('createcoursewithstudent')
    createCourseWithStudent(
        @Body() body: { studentId: number; courseName: string; credit: number }
    ) {
        const { studentId, courseName, credit } = body;
        return this.studentService.createCourseWithStudent(studentId, { courseName, credit });
    }




    // Get all courses of a student
    @Get(':id/courses')
    getCourses(@Param('id', ParseIntPipe) studentId: number) {
        return this.studentService.getCoursesByStudent(studentId);
    }

    // Update a course
    @Patch('course/:id')
    updateCourse(
        @Param('id', ParseIntPipe) courseId: number,
        @Body() data: { courseName?: string; credit?: number },
    ) {
        return this.studentService.updateCourse(courseId, data);
    }

    // Delete a course (optional)
    @Delete('course/:id')
    deleteCourse(@Param('id', ParseIntPipe) courseId: number) {
        return this.studentService.deleteCourse(courseId);
    }


    // -------ID-------

    @Post(':id/idcard')
    @UseGuards(JwtGuard)
    async createIDCard(
        @Param('id', ParseIntPipe) studentId: number,
        @Body() data: { cardNumber: string; issueDate: string },
    ) {
        const result = await this.studentService.createIDCard(studentId, data);
        return result; // will return null if student not found
    }





    @Get(':id/idcard')
    @UseGuards(JwtGuard)
    getIDCard(@Param('id', ParseIntPipe) studentId: number) {
        return this.studentService.getIDCard(studentId);
    }


    @Patch(':id/idcard')
    @UseGuards(JwtGuard)
    updateIDCard(
        @Param('id', ParseIntPipe) studentId: number,
        @Body() data: { cardNumber?: string; issueDate?: string },
    ) {
        return this.studentService.updateIDCard(studentId, data);
    }







}   
