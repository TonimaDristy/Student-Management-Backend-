import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './student.entity';
import { CourseEntity } from './moderator/course.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentIDCard } from './studentidcard.entity.ts';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentEntity, CourseEntity, StudentIDCard]),
    ],
    controllers: [StudentController],
    providers: [StudentService],
})
export class StudentModule { }
