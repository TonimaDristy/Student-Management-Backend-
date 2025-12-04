import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
    login(data: any) {
        const token = jwt.sign(
            { email: data.email },
            "MY_SECRET_KEY",
            { expiresIn: "1h" }
        );
        return { token };
    }
}
