import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { use } from 'passport';
import { GetUser } from '../auth/decorator';
import { JwTGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
@UseGuards(JwTGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        //console.trace()
        return user;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number, 
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userId, dto);
    }
    
}
