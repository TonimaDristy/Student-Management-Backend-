
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { UserDto } from './student.dto';
import { CourseEntity } from './moderator/course.entity';

import { StudentIDCard } from './studentidcard.entity.ts';
import { StudentEntity } from './student.entity';

import * as bcrypt from 'bcrypt';



@Injectable()
export class StudentService {
    CreateCourseWithStudent(studentId: number, courseData: { courseName: string; credit: number; }) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,

        @InjectRepository(CourseEntity)
        private courseRepository: Repository<CourseEntity>,

        @InjectRepository(StudentIDCard)
        private idCardRepository: Repository<StudentIDCard>,
    ) { }


    // Register / Create Student

    async registerUser(student: UserDto): Promise<StudentEntity> {
        //if  student already exists
        const existingStudent = await this.studentRepository.findOne({ where: { email: student.email } });
        if (existingStudent) {
            throw new HttpException('Student already exists', HttpStatus.BAD_REQUEST);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(student.password, salt);

        const newStudent = this.studentRepository.create({
            ...student,
            password: hashedPassword,
        });





        return this.studentRepository.save(newStudent);
    }


    // Validate Student Login

    async validateStudent(email: string, password: string): Promise<StudentEntity> {
        const student = await this.studentRepository.findOne({ where: { email } });
        if (!student) {
            throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return student;
    }






    // Update Status

    updateStatus(id: number, status: string): Promise<any> {
        return this.studentRepository.update(id, { status });
    }


    // Get Inactive Students

    getInactiveStudents(): Promise<StudentEntity[]> {
        return this.studentRepository.find({
            where: { status: 'inactive' },
        });
    }


    // Get Students Older Than 40

    getStudentsOver40(): Promise<StudentEntity[]> {
        return this.studentRepository.find({
            select: {
                fullname: true,
                age: true,
            },
            where: { age: MoreThan(40) },
        });
    }


    // Get Student By ID

    getStudentById(id: number): Promise<StudentEntity | null> {
        return this.studentRepository.findOne({ where: { id } });
    }

    // Update Student (Full Update)

    updateStudent(id: number, updatedData: Partial<StudentEntity>): Promise<any> {
        return this.studentRepository.update(id, updatedData);
    }


    // Delete Student

    deleteStudent(id: number): Promise<any> {
        return this.studentRepository.delete(id);
    }


    // Get Students By Department

    getStudentsByDepartment(department: string): Promise<StudentEntity[]> {

        return this.studentRepository.find({ where: { department } });
    }


    createCourseWithStudent(
        studentId: number,
        courseData: { courseName: string; credit: number },
    ): Promise<CourseEntity> {
        return this.studentRepository.findOne({ where: { id: studentId } })
            .then(student => {
                if (!student) {
                    // throw NestJS exception inside the Promise
                    throw new NotFoundException('Student not found');
                }

                const course = this.courseRepository.create({
                    ...courseData,
                    student,
                });

                return this.courseRepository.save(course);
            });
    }




    ///----Routes----

    // Get all courses of a student
    getCoursesByStudent(studentId: number) {
        return this.courseRepository.find({
            where: { student: { id: studentId } },
        });
    }

    // Update a course
    updateCourse(courseId: number, data: Partial<CourseEntity>) {
        return this.courseRepository.update(courseId, data);
    }

    // Delete a course (optional)
    deleteCourse(courseId: number) {
        return this.courseRepository.delete(courseId);
    }


    // ----------ID Card----

    // Create IDCard by studentId
    async createIDCard(
        studentId: number,
        data: { cardNumber: string; issueDate: string },
    ): Promise<StudentIDCard | null> {
        const student = await this.studentRepository.findOne({ where: { id: studentId } });
        if (!student) return null;

        const card = this.idCardRepository.create({ ...data, student });
        return this.idCardRepository.save(card);
    }

    // Get IDCard by studentId
    async getIDCard(studentId: number): Promise<StudentIDCard | null> {
        return this.idCardRepository.findOne({
            where: { student: { id: studentId } },
        });
    }

    // Update IDCard by studentId
    async updateIDCard(
        studentId: number,
        data: Partial<StudentIDCard>,
    ): Promise<StudentIDCard | null> {
        const card = await this.idCardRepository.findOne({
            where: { student: { id: studentId } },
        });

        if (!card) return null;

        Object.assign(card, data);
        return this.idCardRepository.save(card);
    }




}
