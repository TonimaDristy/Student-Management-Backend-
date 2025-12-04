import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { StudentEntity } from "../student.entity";

@Entity('course')
export class CourseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courseName: string;

    @Column()
    credit: number;

    @ManyToOne(() => StudentEntity, (student) => student.courses)
    student: StudentEntity;
}
