import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { CourseEntity } from './moderator/course.entity';
import { StudentIDCard } from './studentidcard.entity.ts';
import { Exclude } from 'class-transformer';

@Entity('student')
export class StudentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    fullname: string;

    @Column()
    age: number;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive'],
        default: 'active'
    })
    status: string;

    @Column({ nullable: true, unique: true })
    email: string;


    @Column({ nullable: true })
    @Exclude()
    password: string;


    @Column({ nullable: true })
    department: string;



    @Column({ type: 'enum', enum: ['male', 'female'], nullable: true })
    gender: string;


    ///////////Relations-----
    @OneToMany(() => CourseEntity, (course: CourseEntity) => course.student, { cascade: true })
    courses: CourseEntity[];

    @OneToOne(() => StudentIDCard, idCard => idCard.student)
    idCard: StudentIDCard;

}
