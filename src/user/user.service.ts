import { Injectable } from '@nestjs/common';
//import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '../entity/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

const userRepository = AppDataSource.getRepository(User)

@Injectable()
export class UserService {
    constructor() { }

    async editUser(userId: number, dto: EditUserDto) {
        //user returned to the client
        const userV = await userRepository.findOneByOrFail({
            id: userId,
        })

        if (userV) {
            const user = await userRepository.update(userId, { ...dto })
            //     where: {
            //         id: userId,

            //     },
            //     data: {
            //         ...dto,
            //     }

            // });
            const returnUser = await userRepository.findOneBy({id:userId})
            delete returnUser.hash
            console.log(returnUser)
            return returnUser;
        }else {
            //return Error("There's no person logged in")
        }

    }
}
