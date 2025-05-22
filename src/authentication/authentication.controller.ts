import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtAuthenticationGuard from './jwt-authentication.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    console.log(user, 'use');
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    // user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  logOut(@Req() request: RequestWithUser) {
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return request.res.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
