import { ForbiddenException, Injectable } from "@nestjs/common";
//import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AppDataSource } from "../data-source"
import { User } from "../entity/User";
import { Bookmark } from "../entity/Bookmark";
import { DataSource, MetadataAlreadyExistsError, QueryFailedError } from "typeorm";

const userRepository = AppDataSource.getRepository(User)
const bookmarkRepository = AppDataSource.getRepository(Bookmark)

@Injectable()
export class AuthService {
    constructor(
        //private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService,
    ) {

    }
    async login(dto: AuthDto) {
        //find the user by email
        const user = await userRepository.findOneBy({
            email: dto.email
        })
        // if !user trow exception
        if (!user) throw new ForbiddenException("No one with this email")


        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        );
        //if !password trow exception
        if (!pwMatches) throw new ForbiddenException('Wrong password');


        //send back the user
        return this.signToken(user.id, user.email)
    }

    async signup(dto: AuthDto) {
        //generate the password hash
        const hash = await argon.hash(dto.password)

        const userAlready = await userRepository.findOneBy({
            email: dto.email
        })

        if (!userAlready) {
            const user = new User()
            user.email = dto.email
            user.hash = hash
            await userRepository.save(user)
            const token = await this.signToken(user.id, user.email)
            return await {userId: user.id, acess_token: token.access_token}
        } else {
            throw new ForbiddenException('Credentials taken')
        }

        //return {msg: "cool man"}

        // save the new user in the db


    }
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }
        //console.log(payload.sub)
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '10h',
            secret: secret,
        })
        return {
            access_token: token,
        };

    }

    async users() {
        const users = await AppDataSource
            .getRepository(User)
            .createQueryBuilder('User')
            .getMany()
        console.log("Row of data: " + users)
        console.log(users)
    }
}

