import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException("Authorization header missing");
        }

        const token = authHeader.replace("Bearer ", "");

        try {
            const decoded = jwt.verify(token, "MY_SECRET_KEY");
            req.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
