import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signDto } from "./dto/sign.dto";
import { loginDto } from "./dto/login.dto";


@Controller("auth")
export class AuthController {
  constructor(private authclass: AuthService) {}
  @Post("login")
  login(@Body() body: loginDto) {
    return this.authclass.loginService(body);
  }

  @Post("signup")
  signup(@Body() body: signDto) {
    return this.authclass.signupService(body);
  }
}
