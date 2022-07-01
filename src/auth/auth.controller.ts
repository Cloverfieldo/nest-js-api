
import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


@Controller ('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('signup')
    signup (@Body() dto: AuthDto) {
        console.log({
            dto,
    })
        console.log("entre1")
        return this.authService.signup(dto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }

    @Get('all_users')
    users() {
        return this.authService.users();
    }

}
